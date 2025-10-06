//v2 background map test
// src/components/Map.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import { get as getProjection } from "ol/proj";
import proj4 from "proj4";
import { register } from "ol/proj/proj4";
import TileWMS from "ol/source/TileWMS";
import WMTS from "ol/source/WMTS";
import { ScaleLine, Attribution } from "ol/control";
import GeoJSON from "ol/format/GeoJSON";
import WMSGetFeatureInfo from "ol/format/WMSGetFeatureInfo";

import {
  MapContainer,
  FloatingSearch,
  MapStyleContainer,
} from "../style_components/MapStyle";
import GlobalStyle from "../style_components/GlobalStyle";

import AchtergrondLaag from "./AchtergrondLaagContainer";
import TransparantieLaagSelect from "./TransparantieLaagContainer";
import DataLaagSelect from "./DataLaagSelectContainer";
import LaagData from "./LaagData";
import Measurement from "./MeasurementContainer";
import DataLabel from "./DataLabelContainer (not in use)";
import ZoomControl from "./ZoomControl";
import SearchBar from "./Searchbar";
import Legend from "./Legend";

import useBackgroundLayer from "../hooks/UseBackgroundLayer";
import useMapLayers from "../hooks/UseMapLayers";
import useHighlightLayer from "../hooks/useHighlightLayer";
import useMeasurementLayer from "../hooks/useMeasurementLayer";
import useMeasurementTool from "../hooks/UseMeasurementTools";

import { createBaseLayer } from "../utils/baseLayerFactory";
import {
  registerEPSG28992,
  createPdokTileGrid28992,
  createEsriTileGrid3857,
} from "../utils/projectionsAndTileGrids";
import { toProjection } from "../utils/projections";
import { flattenDataLayers } from "./flattenDataLayers";

// ----------------------------
// Register projections
// ----------------------------
registerEPSG28992();
createPdokTileGrid28992();
createEsriTileGrid3857();
register(proj4);

// ----------------------------
// OLMap Component
// ----------------------------
export default function OLMap({
  activePanel,
  setActivePanel,
  activeBackgroundLayer,
  setActiveBackgroundLayer,
}) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const backgroundLayerRef = useRef(null);
  const [currentProjectionCode, setCurrentProjectionCode] =
    useState("EPSG:3857");

  const [selectedFeature, setSelectedFeature] = useState(null);
  const [activeLegendLayers, setActiveLegendLayers] = useState([]);

  // Highlight Layer
  const { highlightLayer, addFeatures, clearFeatures, highlightSource } =
    useHighlightLayer();

  // Measurement Layer
  const measureLayer = useMeasurementLayer();
  const { activeTool, handleSelectTool } = useMeasurementTool(
    mapInstance.current,
    measureLayer
  );

  // Data layers hook
  const {
    getWMSFeatureInfoUrlDebug,
    dataLayers,
    flattenedLayers,
    setLayerActive,
    setLayerOpacity,
    addMapLayer,
    selectedFeatureId,
    setSelectedFeatureId,
    wmsWmtsLayersRef,
    setDataLayers,
  } = useMapLayers({
    projectionCode: currentProjectionCode,
    olProjection: getProjection(currentProjectionCode),
    highlightSource,
  });

  const dataLayersRef = useRef([]);
  useEffect(() => {
    dataLayersRef.current = dataLayers;
  }, [dataLayers]);

  // ----------------------------
  // Map creation function
  // ----------------------------
  const createMap = (
    projCode,
    centerLonLat,
    zoom = 15,
    backgroundId = "openstreet"
  ) => {
    if (mapInstance.current) {
      mapInstance.current.setTarget(null);
      mapInstance.current = null;
    }

    const baseLayer = createBaseLayer(projCode, backgroundId);
    backgroundLayerRef.current = baseLayer;

    const center = toProjection(centerLonLat, projCode);

    const map = new Map({
      target: mapRef.current,
      layers: [baseLayer, highlightLayer, measureLayer],
      view: new View({
        projection: getProjection(projCode),
        center,
        zoom,
      }),
      controls: [],
      renderer: "canvas",
      canvas: { willReadFrequently: true },
    });

    map.addControl(
      new ScaleLine({ units: "metric", bar: true, steps: 4, text: true })
    );
    map.addControl(new Attribution({ collapsible: true }));

    mapInstance.current = map;

    //v6 click handler
    map.on("singleclick", async (evt) => {
      if (!mapInstance.current) return;

      const view = mapInstance.current.getView();
      const resolution = view.getResolution();
      const coordinate = evt.coordinate;

      let clickedFeature = null;
      let clickedLayerId = null;

      const INFO_FORMATS = [
        "application/json",
        "application/json; subtype=geojson",
        "application/vnd.ogc.gml/3.1.1",
        "application/vnd.ogc.gml",
        "text/xml; subtype=gml/3.1.1",
        "text/xml",
        "text/plain",
        "text/html",
      ];

      const getFeaturesFromWMS = async (layer) => {
        const source = wmsWmtsLayersRef.current[layer.id];
        if (!source) {
          console.log(`[WMS] No source found for layer: ${layer.id}`);
          return null;
        }

        for (const format of INFO_FORMATS) {
          try {
            const url = getWMSFeatureInfoUrlDebug(
              layer,
              coordinate,
              resolution,
              view.getProjection().getCode()
            );
            if (!url) continue;
            console.log("URL generated:", url);

            const res = await fetch(url);
            const text = await res.text();

            if (!text.trim()) continue;

            if (format.includes("json") && text.trim().startsWith("{")) {
              const json = JSON.parse(text);
              if (json?.features?.length > 0) {
                return new GeoJSON().readFeatures(json, {
                  featureProjection: view.getProjection(),
                });
              }
            } else {
              const parsedFeatures = new WMSGetFeatureInfo().readFeatures(
                text,
                {
                  featureProjection: view.getProjection(),
                }
              );
              if (parsedFeatures?.length) return parsedFeatures;
            }
          } catch (err) {
            console.warn(
              `[WMS] GetFeatureInfo failed for layer ${layer.id}`,
              err
            );
            continue;
          }
        }
        return null;
      };

      // Recursive function to walk children
      const findActiveFeature = async (layer) => {
        if (layer.active) {
          const features = await getFeaturesFromWMS(layer);
          if (features?.length) return { layer, features };
        }
        if (layer.children?.length) {
          for (const child of layer.children) {
            const result = await findActiveFeature(child);
            if (result) return result;
          }
        }
        return null;
      };

      for (const group of dataLayersRef.current) {
        console.log(`[Click] Checking group: ${group.id}`);
        for (const layer of group.children ?? []) {
          console.log(
            `[Click] Checking layer: ${layer.id}, active: ${layer.active}`
          );
          const result = await findActiveFeature(layer);
          if (result) {
            clickedFeature = result.features[0];
            clickedLayerId = result.layer.id;

            console.log(
              `[Click] Feature found on layer: ${clickedLayerId}, feature ID: ${clickedFeature.getId()}`
            );
            clearFeatures();
            addFeatures(result.features);
            setSelectedFeature(clickedFeature.getProperties());
            setSelectedFeatureId(clickedLayerId);
            setActivePanel("laagdata");
            break;
          }
        }
        if (clickedFeature) break;
      }

      if (!clickedFeature) {
        console.log("[Click] No feature found on click");
        clearFeatures();
        setSelectedFeature(null);
        setSelectedFeatureId(null);
      }
    });
  };

  // ----------------------------
  // Initialize map
  // ----------------------------
  useEffect(() => {
    const initialCenter = [5.1214, 52.0907]; // default NL center
    createMap(
      currentProjectionCode,
      initialCenter,
      10,
      activeBackgroundLayer || "openstreet"
    );
  }, []);

  // useEffect(() => {
  //   const vihigaCenter = [(34.708 + 34.7368) / 2, (0.0722392 + 0.102843) / 2];

  //   createMap(
  //     currentProjectionCode,
  //     vihigaCenter,
  //     18,
  //     activeBackgroundLayer || "openstreet"
  //   );
  // }, []);

  // const TEST_MODE = true; // set to false for production/NL

  // useEffect(() => {
  //   const center = TEST_MODE
  //     ? [(34.708 + 34.7368) / 2, (0.0722392 + 0.102843) / 2] // Vihiga
  //     : [5.1214, 52.0907]; // NL default

  //   const zoom = TEST_MODE ? 18 : 10;

  //   createMap(
  //     currentProjectionCode,
  //     center,
  //     zoom,
  //     activeBackgroundLayer || "openstreet"
  //   );
  // }, [currentProjectionCode, activeBackgroundLayer]);

  // ----------------------------
  // Background layer & projection switch
  // ----------------------------
  useBackgroundLayer({
    mapInstance,
    backgroundLayerRef,
    currentProjectionCode,
    setCurrentProjectionCode,
    activeBackgroundLayer,
    setActiveBackgroundLayer,
    createMap,
    wmsWmtsLayersRef, // <-- pass your data layers ref
    zoomThreshold: 12, // optional
  });
  // ----------------------------
  // Search handler
  // ----------------------------
  const handleSearchResult = (coordsLonLat) => {
    if (!mapInstance.current) return;
    const targetCoords = toProjection(coordsLonLat, currentProjectionCode);
    mapInstance.current
      .getView()
      .animate({ center: targetCoords, zoom: 14, duration: 1000 });
  };

  // ----------------------------
  // Legend setup
  // ----------------------------

  useEffect(() => {
    if (!dataLayers || dataLayers.length === 0) {
      setActiveLegendLayers([]);
      return;
    }

    const flattened = flattenDataLayers(dataLayers);

    // ✅ Filter by layers that are active
    const activeLayers = flattened.filter((layer) => layer.active);
    activeLayers.forEach((layer) => {
      console.log(
        "[LegendEffect] Active layer:",
        layer.id,
        "→ legendUrl:",
        layer.legendUrl
      );
    });

    setActiveLegendLayers(activeLayers);
  }, [dataLayers]); // only depend on dataLayers

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <MapContainer>
      <GlobalStyle />
      <FloatingSearch>
        <SearchBar onSearchResult={handleSearchResult} />
      </FloatingSearch>

      <ZoomControl mapRef={mapInstance} />
      <MapStyleContainer ref={mapRef} />

      <AchtergrondLaag
        isOpen={activePanel === "achtergrond"}
        setActivePanel={setActivePanel}
        activeBackgroundLayer={activeBackgroundLayer}
        setActiveBackgroundLayer={setActiveBackgroundLayer}
      />

      <TransparantieLaagSelect
        isOpen={activePanel === "transparantie"}
        setActivePanel={setActivePanel}
        dataLayers={dataLayers}
        setLayerOpacity={setLayerOpacity}
      />

      <DataLaagSelect
        isOpen={activePanel === "lagen"}
        setActivePanel={setActivePanel}
        dataLayers={dataLayers}
        setDataLayers={setDataLayers}
        setLayerActive={setLayerActive}
        mapRef={mapInstance}
        wmsWmtsLayersRef={wmsWmtsLayersRef}
        currentProjectionCode={currentProjectionCode}
      />

      <LaagData
        isOpen={activePanel === "laagdata"}
        setActivePanel={setActivePanel}
        selectedFeature={selectedFeature}
      />

      <Measurement
        isOpen={activePanel === "metingen"}
        setActivePanel={setActivePanel}
        onSelectTool={handleSelectTool}
      />

      <DataLabel dataLayers={dataLayers} />
      <Legend activeLayers={activeLegendLayers} />
    </MapContainer>
  );
}
