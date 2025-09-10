import { useState, useRef, useEffect } from "react";
import { transformExtent } from "ol/proj";
import { containsExtent } from "ol/extent";

import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import useDataLayerFetch from "../hooks/UseDataLayerFetch";
import { DATASET_CONFIG } from "../config/datasetConfig";

export default function useMapLayers({ projectionCode, highlightSource }) {
  // Fetch datasets
  const { dataLayers: fetchedDataLayers, loading, error } = useDataLayerFetch();

  const normalizeTitles = (layers) =>
    layers.map((layer) => ({
      ...layer,
      title:
        layer.title?.replace(/^test_mombasa:/, "") ||
        layer.name ||
        layer.id ||
        "",
      children: layer.children ? normalizeTitles(layer.children) : [],
    }));

  // Local state for layer management
  const [dataLayers, setDataLayers] = useState([]);
  useEffect(() => {
    if (!loading && fetchedDataLayers.length > 0) {
      const normalizedLayers = normalizeTitles(fetchedDataLayers);
      setDataLayers(normalizedLayers);
    }
  }, [loading, fetchedDataLayers]);

  const wmsWmtsLayersRef = useRef({});
  const [selectedFeatureId, setSelectedFeatureId] = useState(null);

  // ----------------------------
  // Add/remove OL layers
  // ----------------------------
  const addMapLayer = (
    mapInstance,
    groupId,
    layerId,
    isActive,
    type = "wms",
    styleId = ""
  ) => {
    if (!mapInstance) return;

    const key = styleId
      ? `${groupId}:${layerId}:${styleId}`
      : `${groupId}:${layerId}`;
    const dataset = DATASET_CONFIG[groupId];
    if (!dataset) {
      console.error(`No dataset config found for groupId: ${groupId}`);
      return;
    }

    if (isActive) {
      if (wmsWmtsLayersRef.current[key]) return;

      let newLayer = null;
      if (type === "wms") {
        newLayer = new TileLayer({
          source: new TileWMS({
            url: dataset.url,
            params: {
              SERVICE: "WMS",
              REQUEST: "GetMap",
              VERSION: "1.3.0",
              LAYERS: layerId,
              STYLES: styleId || "",
              CRS: projectionCode,
              FORMAT: "image/png",
              TRANSPARENT: true,
            },
            serverType: "geoserver",
            crossOrigin: "anonymous",
          }),
          zIndex: 10,
          opacity: 1.0,
        });
      }

      if (newLayer) {
        mapInstance.addLayer(newLayer);
        wmsWmtsLayersRef.current[key] = newLayer;
      }
    } else {
      const existing = wmsWmtsLayersRef.current[key];
      if (existing) {
        mapInstance.removeLayer(existing);
        delete wmsWmtsLayersRef.current[key];
      }
      if (highlightSource) highlightSource.clear();
    }
  };

  // ----------------------------
  // Toggle layer active
  // ----------------------------
  const setLayerActive = (
    mapInstance,
    groupId,
    layerId,
    inputType = "checkbox"
  ) => {
    setDataLayers((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id !== groupId) return group;

        const updatedChildren = group.children.map((parent) => {
          // Only handle the target layer
          if (parent.id !== layerId && inputType === "checkbox") return parent;

          const newActive =
            inputType === "checkbox" ? !parent.active : parent.active;

          // Handle radio children
          const radios = parent.children.filter((c) => c.inputType === "radio");

          if (radios.length > 1) {
            // Turn off all radio layers
            radios.forEach((r) =>
              addMapLayer(
                mapInstance,
                groupId,
                parent.id,
                false,
                parent.type,
                r.id
              )
            );

            if (newActive) {
              const activeRadio = radios.find((c) => c.active) || radios[0];
              addMapLayer(
                mapInstance,
                groupId,
                parent.id,
                true,
                parent.type,
                activeRadio.id
              );

              // Zoom if bbox exists
              if (parent.bbox) zoomToLayer(mapInstance, parent);

              const updatedChilds = parent.children.map((c) =>
                c.inputType === "radio"
                  ? { ...c, active: c.id === activeRadio.id }
                  : c
              );

              return { ...parent, active: newActive, children: updatedChilds };
            } else {
              const updatedChilds = parent.children.map((c) => ({
                ...c,
                active: false,
              }));
              return { ...parent, active: newActive, children: updatedChilds };
            }
          } else {
            // No or single radio children
            addMapLayer(
              mapInstance,
              groupId,
              parent.id,
              newActive,
              parent.type
            );
            if (newActive && parent.bbox) zoomToLayer(mapInstance, parent);
            return { ...parent, active: newActive };
          }
        });

        return { ...group, children: updatedChildren };
      })
    );
  };

  // ----------------------------
  // Set layer opacity
  // ----------------------------
  const setLayerOpacity = (groupId, layerId, opacity) => {
    const updateOpacityRecursive = (layers) =>
      layers.map((layer) => {
        if (layer.id === layerId) {
          const key = `${groupId}:${layerId}`;
          const olLayer = wmsWmtsLayersRef.current[key];
          if (olLayer) olLayer.setOpacity(opacity / 100);
          return { ...layer, opacity };
        }
        return { ...layer, children: updateOpacityRecursive(layer.children) };
      });

    setDataLayers((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? { ...group, children: updateOpacityRecursive(group.children) }
          : group
      )
    );
  };

  // ----------------------------
  // Zoom to layer
  // ----------------------------
  const zoomToLayer = (mapInstance, layer) => {
    if (!mapInstance || !layer?.bbox) return;

    const view = mapInstance.getView();
    const layerExtent = transformExtent(
      layer.bbox,
      "EPSG:4326",
      view.getProjection()
    );
    const currentExtent = view.calculateExtent(mapInstance.getSize());

    // Check intersection manually
    const intersects = !(
      currentExtent[2] < layerExtent[0] ||
      currentExtent[0] > layerExtent[2] ||
      currentExtent[3] < layerExtent[1] ||
      currentExtent[1] > layerExtent[3]
    );

    if (intersects) {
      console.log("Layer already partially in view, skipping zoom:", layer.id);
      return;
    }

    console.log("Zooming to layer", layer.id, layer.bbox);
    view.fit(layerExtent, {
      padding: [50, 50, 50, 50],
      duration: 500,
      maxZoom: 18,
    });
  };

  // ----------------------------
  // Zoom to layer
  // ----------------------------

  return {
    dataLayers,
    loading,
    error,
    setLayerActive,
    setLayerOpacity,
    addMapLayer,
    zoomToLayer, // <-- expose it here
    selectedFeatureId,
    setSelectedFeatureId,
    wmsWmtsLayersRef,
  };
}
