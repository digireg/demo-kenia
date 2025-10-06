import { useRef, useMemo } from "react";
import TileWMS from "ol/source/TileWMS";
import TileLayer from "ol/layer/Tile";
import { DATASET_CONFIG } from "../config/datasets"; // adjust path

/**
 * Dynamically create OpenLayers sources + layers from DATASET_CONFIG
 */
export const useDatasetSources = () => {
  // Keep refs stable between renders
  const sourcesRef = useRef({});
  const layersRef = useRef({});

  useMemo(() => {
    Object.values(DATASET_CONFIG).forEach((dataset) => {
      if (dataset.type === "wms") {
        // Create WMS source
        const source = new TileWMS({
          url: dataset.url,
          params: { LAYERS: dataset.id, TILED: true },
          serverType: "geoserver", // adjust if needed
          transition: 0,
        });

        // Save in refs
        sourcesRef.current[dataset.id] = source;

        // Create WMS layer
        const layer = new TileLayer({
          source,
          visible: false, // default off, toggle via UI
          properties: { datasetId: dataset.id },
        });

        layersRef.current[dataset.id] = layer;
      }

      // 🚧 placeholder for WMTS or vector layers in future
    });
  }, []);

  return {
    sources: sourcesRef.current,
    layers: layersRef.current,
  };
};
