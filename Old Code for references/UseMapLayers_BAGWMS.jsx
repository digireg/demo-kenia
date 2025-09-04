import { useState, useRef, useEffect } from 'react';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import WMTS from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { get as getProjection } from 'ol/proj';

/**
 * Custom hook for managing WMS and WMTS layers in OpenLayers.
 * Fully supports nested children and dynamically toggles layers on the map.
 */
export default function useMapLayers(projection) {
  const wmsWmtsLayersRef = useRef({}); // OL layer references
  const [dataLayers, setDataLayers] = useState([]); // Metadata and toggle states

  /**
   * Fetch BAG WMS GetCapabilities and populate dataLayers state
   */
  useEffect(() => {
    async function fetchBAGCapabilities() {
      try {
        const res = await fetch(
          'https://service.pdok.nl/lv/bag/wms/v2_0?request=GetCapabilities&service=WMS'
        );
        const text = await res.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'application/xml');

        // Get all <Layer> elements that have a <Name>
        const layerEls = Array.from(xml.querySelectorAll('Layer > Layer'))
          .filter(layer => layer.querySelector('Name'))
          .map(layer => {
            const id = layer.querySelector('Name').textContent.trim();
            const title = layer.querySelector('Title')?.textContent.trim() || id;
            return {
              id: id.toLowerCase(),
              name: title,
              active: false,
              opacity: 100,
              inputType: 'checkbox', // default type
              type: 'wms',
              children: [], // placeholder for nested children
            };
          });

        setDataLayers([
          {
            id: 'bag',
            title: 'BAG',
            children: layerEls,
          },
        ]);
      } catch (err) {
        console.error('Error fetching BAG WMS capabilities:', err);
      }
    }

    fetchBAGCapabilities();
  }, []);

  /**
   * Add or remove a layer from the map
   */
  const addMapLayer = (mapInstance, groupId, layerId, isActive, type = 'wms') => {
    if (!mapInstance) return;
    const layerKey = `${groupId}:${layerId}`;

    if (isActive) {
      if (wmsWmtsLayersRef.current[layerKey]) return; // Already added

      let newLayer = null;

      if (type === 'wms') {
        newLayer = new TileLayer({
          source: new TileWMS({
            url: 'https://service.pdok.nl/lv/bag/wms/v2_0',
            params: {
              SERVICE: 'WMS',
              REQUEST: 'GetMap',
              VERSION: '1.3.0',
              LAYERS: layerId,
              STYLES: '',
              CRS: 'EPSG:28992',
              FORMAT: 'image/png',
              TRANSPARENT: true,
            },
            serverType: 'geoserver',
            crossOrigin: 'anonymous',
          }),
          opacity: 0.7,
        });
      } else if (type === 'wmts') {
        const wmtsTileGrid = new WMTSTileGrid({
          origin: [-285401.92, 903401.92],
          resolutions: [
            3440, 1720, 860, 430, 215, 107.5, 53.75, 26.875, 13.4375,
            6.71875, 3.359375, 1.6796875, 0.83984375, 0.419921875,
            0.2099609375, 0.10498046875, 0.052490234375, 0.0262451171875,
          ],
          matrixIds: Array(18).fill(0).map((_, i) => i.toString()),
        });

        newLayer = new TileLayer({
          source: new WMTS({
            url: 'https://example.com/geoserver/gwc/service/wmts?',
            layer: `${groupId}:${layerId}`,
            matrixSet: 'EPSG:28992',
            format: 'image/png',
            projection,
            tileGrid: wmtsTileGrid,
            style: 'default',
            attributions: '© Provider Name',
            crossOrigin: 'anonymous',
          }),
          opacity: 1.0,
        });
      }

      if (newLayer) {
        mapInstance.addLayer(newLayer);
        wmsWmtsLayersRef.current[layerKey] = newLayer;
      }
    } else {
      const existingLayer = wmsWmtsLayersRef.current[layerKey];
      if (existingLayer) {
        mapInstance.removeLayer(existingLayer);
        delete wmsWmtsLayersRef.current[layerKey];
      }
    }
  };

  /**
   * Recursively toggle a layer and optionally its children
   */
  const setLayerActive = (mapInstance, groupId, layerId, inputType = 'checkbox') => {
    const toggleRecursive = (layers) =>
      layers.map(layer => {
        let active = layer.active;

        if (layer.id === layerId) {
          active = inputType === 'radio' ? true : !layer.active;
          addMapLayer(mapInstance, groupId, layer.id, active, layer.type);
        } else if (inputType === 'radio') {
          // If parent is radio, deactivate siblings
          active = false;
          addMapLayer(mapInstance, groupId, layer.id, false, layer.type);
        }

        // Keep children intact; they will render but hidden unless parent active
        const children = layer.children.length > 0 ? toggleRecursive(layer.children) : [];

        return { ...layer, active, children };
      });

    setDataLayers(prev =>
      prev.map(group => (group.id === groupId ? { ...group, children: toggleRecursive(group.children) } : group))
    );
  };

  /**
   * Recursively set opacity for a layer
   */
  const setLayerOpacity = (groupId, layerId, opacity) => {
    const updateOpacityRecursive = (layers) =>
      layers.map(layer => {
        if (layer.id === layerId) {
          const key = `${groupId}:${layerId}`;
          const olLayer = wmsWmtsLayersRef.current[key];
          if (olLayer) olLayer.setOpacity(opacity / 100);
          return { ...layer, opacity };
        }
        return { ...layer, children: updateOpacityRecursive(layer.children) };
      });

    setDataLayers(prev =>
      prev.map(group =>
        group.id === groupId ? { ...group, children: updateOpacityRecursive(group.children) } : group
      )
    );
  };

  return { dataLayers, setLayerActive, setLayerOpacity, addMapLayer };
}
