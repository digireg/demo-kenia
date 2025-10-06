//V3
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import { DATASET_CONFIG } from "../config/datasetConfig";
import { transformExtent } from "ol/proj";
import { loadWMSLayers } from "./wmsLoader";
import { fetchLayerBBoxes } from "./fetchLayerBBoxes";
import { zoomToLayer } from "./zoomToLayer";

export async function addMapLayer({
  mapInstance,
  groupId,
  layerId,
  isActive,
  type = "wms",
  styleId = "",
  wmsWmtsLayersRef,
  projectionCode = "EPSG:3857",
  highlightSource,
}) {
  if (!wmsWmtsLayersRef?.current) return;
  if (!mapInstance) return;

  const key = styleId
    ? `${groupId}:${layerId}:${styleId}`
    : `${groupId}:${layerId}`;

  const dataset = DATASET_CONFIG[groupId];
  if (!dataset) {
    console.error(`[addMapLayer] No dataset config for groupId: ${groupId}`);
    return;
  }

  const layerIdToUse = layerId || dataset.layer || dataset.id;
  if (!layerIdToUse) {
    console.error("[addMapLayer] missing layerId!", { groupId, layerId });
    return;
  }

  // Remove old layer if exists
  if (wmsWmtsLayersRef.current[key]) {
    mapInstance.removeLayer(wmsWmtsLayersRef.current[key]);
    delete wmsWmtsLayersRef.current[key];
  }

  if (!isActive) {
    highlightSource?.clear();
    return;
  }

  let newLayer = null;

  // if (type === "wms") {
  //   newLayer = new TileLayer({
  //     source: new TileWMS({
  //       url: dataset.url,
  //       params: {
  //         SERVICE: "WMS",
  //         REQUEST: "GetMap",
  //         VERSION: "1.3.0",
  //         LAYERS: layerIdToUse,
  //         STYLES: styleId || "",
  //         CRS: projectionCode,
  //         FORMAT: "image/png",
  //         TRANSPARENT: true,
  //       },
  //       serverType: "geoserver",
  //       crossOrigin: "anonymous",
  //     }),
  //     zIndex: 10,
  //     opacity: 1.0,
  //   });

  //   mapInstance.addLayer(newLayer);
  //   wmsWmtsLayersRef.current[key] = newLayer;
  //   console.log("[addMapLayer] added layer:", key);

  //   // -----------------------------
  //   // Fetch WMS bbox and zoom dynamically
  //   // -----------------------------
  //   try {
  //     const layers = await loadWMSLayers(layerIdToUse); // returns array of children
  //     const layerMeta =
  //       layers.find((l) => l.id === `${layerIdToUse}_${layerIdToUse}`) ||
  //       layers[0];

  //     if (layerMeta?.bbox) {
  //       const transformedBbox = transformExtent(
  //         layerMeta.bbox,
  //         "EPSG:4326",
  //         projectionCode
  //       );
  //       mapInstance.getView().fit(transformedBbox, {
  //         size: mapInstance.getSize(),
  //         maxZoom: 18,
  //         padding: [50, 50, 50, 50],
  //       });
  //       console.log(`[addMapLayer] zoomed to bbox for ${key}`);
  //     } else {
  //       console.warn(`[addMapLayer] no bbox found for ${key}`);
  //     }
  //   } catch (err) {
  //     console.warn(`[addMapLayer] failed to fetch bbox for ${key}:`, err);
  //   }
  // }

  if (type === "wms") {
    newLayer = new TileLayer({
      source: new TileWMS({
        url: dataset.url,
        params: {
          SERVICE: "WMS",
          REQUEST: "GetMap",
          VERSION: "1.3.0",
          LAYERS: layerIdToUse,
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

    newLayer.set("id", layerIdToUse);
  }

  // Add layer to map
  if (newLayer) {
    mapInstance.addLayer(newLayer);
    wmsWmtsLayersRef.current[key] = newLayer;
    console.log("[addMapLayer] added layer:", key);

    // -----------------------------
    // Fetch BBox and zoom
    // -----------------------------
    try {
      const bboxes = await fetchLayerBBoxes(dataset);
      const bbox = bboxes[layerIdToUse];

      if (bbox) {
        console.log(`[addMapLayer] fetched bbox for ${key}:`, bbox);
        zoomToLayer(mapInstance, bbox.extent, bbox.crs);
      } else {
        console.warn(`[addMapLayer] no bbox found for ${key}`);
      }
    } catch (err) {
      console.warn(`[addMapLayer] failed to fetch bbox for ${key}:`, err);
    }
  }

  return newLayer;
}
