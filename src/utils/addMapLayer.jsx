//V3
// import TileLayer from "ol/layer/Tile";
// import TileWMS from "ol/source/TileWMS";
// import { DATASET_CONFIG } from "../config/datasetConfig";
// import { transformExtent } from "ol/proj";
// import { loadWMSLayers } from "./wmsLoader";
// import { fetchLayerBBoxes } from "./fetchLayerBBoxes";
// import { zoomToLayer } from "./zoomToLayer";

// export async function addMapLayer({
//   mapInstance,
//   groupId,
//   layerId,
//   isActive,
//   type = "wms",
//   styleId = "",
//   wmsWmtsLayersRef,
//   projectionCode = "EPSG:3857",
//   highlightSource,
// }) {
//   if (!wmsWmtsLayersRef?.current) return;
//   if (!mapInstance) return;

//   const key = styleId
//     ? `${groupId}:${layerId}:${styleId}`
//     : `${groupId}:${layerId}`;

//   const dataset = DATASET_CONFIG[groupId];
//   if (!dataset) {
//     console.error(`[addMapLayer] No dataset config for groupId: ${groupId}`);
//     return;
//   }

//   const layerIdToUse = layerId || dataset.layer || dataset.id;
//   if (!layerIdToUse) {
//     console.error("[addMapLayer] missing layerId!", { groupId, layerId });
//     return;
//   }

//   // Remove old layer if exists
//   if (wmsWmtsLayersRef.current[key]) {
//     mapInstance.removeLayer(wmsWmtsLayersRef.current[key]);
//     delete wmsWmtsLayersRef.current[key];
//   }

//   if (!isActive) {
//     highlightSource?.clear();
//     return;
//   }

//   let newLayer = null;

//   if (type === "wms") {
//     newLayer = new TileLayer({
//       source: new TileWMS({
//         url: dataset.url,
//         params: {
//           SERVICE: "WMS",
//           REQUEST: "GetMap",
//           VERSION: "1.3.0",
//           LAYERS: layerIdToUse,
//           STYLES: styleId || "",
//           CRS: projectionCode,
//           FORMAT: "image/png",
//           TRANSPARENT: true,
//         },
//         serverType: "geoserver",
//         crossOrigin: "anonymous",
//       }),
//       zIndex: 10,
//       opacity: 1.0,
//     });

//     newLayer.set("id", layerIdToUse);
//   }

//   // Add layer to map
//   if (newLayer) {
//     mapInstance.addLayer(newLayer);
//     wmsWmtsLayersRef.current[key] = newLayer;
//     console.log("[addMapLayer] added layer:", key);

//     // -----------------------------
//     // Fetch BBox and zoom
//     // -----------------------------
//     try {
//       const bboxes = await fetchLayerBBoxes(dataset);
//       const bbox = bboxes[layerIdToUse];

//       if (bbox) {
//         console.log(`[addMapLayer] fetched bbox for ${key}:`, bbox);
//         zoomToLayer(mapInstance, bbox.extent, bbox.crs);
//       } else {
//         console.warn(`[addMapLayer] no bbox found for ${key}`);
//       }
//     } catch (err) {
//       console.warn(`[addMapLayer] failed to fetch bbox for ${key}:`, err);
//     }
//   }

//   return newLayer;
// }

//v4
// addMapLayer — BBox fix for sub-layers & styles
// import TileLayer from "ol/layer/Tile";
// import TileWMS from "ol/source/TileWMS";
// import { DATASET_CONFIG } from "../config/datasetConfig";
// import { fetchLayerBBoxes } from "./fetchLayerBBoxes";
// import { zoomToLayer } from "./zoomToLayer";

// export async function addMapLayer({
//   mapInstance,
//   groupId,
//   layerId,
//   isActive,
//   type = "wms",
//   styleId = "",
//   wmsWmtsLayersRef,
//   projectionCode = "EPSG:3857",
//   highlightSource,
//   parentLayer = null, // optional, for BBox fallback
// }) {
//   if (!wmsWmtsLayersRef?.current || !mapInstance) return;

//   const key = styleId
//     ? `${groupId}:${layerId}:${styleId}`
//     : `${groupId}:${layerId}`;
//   const dataset = DATASET_CONFIG[groupId];
//   if (!dataset) {
//     console.error(`[addMapLayer] No dataset config for groupId: ${groupId}`);
//     return;
//   }

//   // Use actual WMS layer name for BBox lookup
//   const layerNameToUse =
//     wmsWmtsLayersRef.current[layerId]?.get("wmsLayerName") || layerId;

//   // Remove existing layer if present
//   if (wmsWmtsLayersRef.current[key]) {
//     mapInstance.removeLayer(wmsWmtsLayersRef.current[key]);
//     delete wmsWmtsLayersRef.current[key];
//   }

//   if (!isActive) {
//     highlightSource?.clear();
//     return;
//   }

//   let newLayer = null;

//   if (type === "wms") {
//     newLayer = new TileLayer({
//       source: new TileWMS({
//         url: dataset.url,
//         params: {
//           SERVICE: "WMS",
//           REQUEST: "GetMap",
//           VERSION: "1.3.0",
//           LAYERS: layerNameToUse,
//           STYLES: styleId || "",
//           CRS: projectionCode,
//           FORMAT: "image/png",
//           TRANSPARENT: true,
//         },
//         serverType: "geoserver",
//         crossOrigin: "anonymous",
//       }),
//       zIndex: 10,
//       opacity: 1.0,
//     });

//     newLayer.set("id", layerId);
//     newLayer.set("wmsLayerName", layerNameToUse);
//   }

//   if (newLayer) {
//     mapInstance.addLayer(newLayer);
//     wmsWmtsLayersRef.current[key] = newLayer;
//     console.log("[addMapLayer] added layer:", key);

//     // -----------------------------
//     // Fetch BBox and zoom
//     // -----------------------------
//     try {
//       const bboxes = await fetchLayerBBoxes(dataset);

//       // Try direct layer BBox, fallback to parent layer BBox if missing
//       const bbox =
//         bboxes[layerNameToUse] ||
//         (parentLayer && bboxes[parentLayer.wmsLayerName]);

//       if (bbox) {
//         console.log(`[addMapLayer] fetched bbox for ${key}:`, bbox);
//         zoomToLayer(mapInstance, bbox.extent, bbox.crs);
//       } else {
//         console.warn(
//           `[addMapLayer] no bbox found for ${key} (tried parent fallback)`
//         );
//       }
//     } catch (err) {
//       console.warn(`[addMapLayer] failed to fetch bbox for ${key}:`, err);
//     }
//   }

//   return newLayer;
// }

//v5
// import TileLayer from "ol/layer/Tile";
// import TileWMS from "ol/source/TileWMS";
// import { DATASET_CONFIG } from "../config/datasetConfig";
// import { fetchLayerBBoxes } from "./fetchLayerBBoxes";
// import { zoomToLayer } from "./zoomToLayer";

// export async function addMapLayer({
//   mapInstance,
//   groupId,
//   layerId,
//   isActive,
//   type = "wms",
//   styleId = "",
//   wmsWmtsLayersRef,
//   projectionCode = "EPSG:3857",
//   highlightSource,
//   parentLayer = null, // optional, for BBox fallback
// }) {
//   if (!wmsWmtsLayersRef?.current || !mapInstance) return;

//   const key = styleId
//     ? `${groupId}:${layerId}:${styleId}`
//     : `${groupId}:${layerId}`;

//   const dataset = DATASET_CONFIG[groupId];
//   if (!dataset) {
//     console.error(`[addMapLayer] No dataset config for groupId: ${groupId}`);
//     return;
//   }

//   // Use actual WMS layer name for BBox lookup
//   const possibleNames = [
//     layerId,
//     layerId.includes(":") ? layerId.split(":")[1] : layerId,
//   ];
//   const layerNameToUse =
//     possibleNames.find((name) => dataset.layers?.includes(name)) ||
//     possibleNames[1];

//   // before creating the new TileLayer
//   const bboxes = await fetchLayerBBoxes(dataset);
//   const bbox =
//     bboxes[layerNameToUse] || (parentLayer && bboxes[parentLayer.wmsLayerName]);

//   // fallback: if still no bbox, log once
//   if (!bbox && parentLayer) {
//     console.warn(`[addMapLayer] Using parent extent fallback for ${key}`);
//   }

//   // Remove existing layer if present
//   if (wmsWmtsLayersRef.current[key]) {
//     mapInstance.removeLayer(wmsWmtsLayersRef.current[key]);
//     delete wmsWmtsLayersRef.current[key];
//   }

//   if (!isActive) {
//     highlightSource?.clear();
//     return;
//   }

//   let newLayer = null;

//   const srsParam = projectionCode === "EPSG:4326" ? "CRS" : "SRS";

//   if (type === "wms") {
//     newLayer = new TileLayer({
//       source: new TileWMS({
//         url: dataset.url,
//         params: {
//           SERVICE: "WMS",
//           REQUEST: "GetMap",
//           VERSION: "1.3.0",
//           LAYERS: layerNameToUse,
//           STYLES: styleId || "",
//           [srsParam]: projectionCode,
//           FORMAT: "image/png",
//           TRANSPARENT: true,
//         },
//         serverType: "geoserver",
//         crossOrigin: "anonymous",
//       }),
//       zIndex: 10,
//       opacity: 1.0,
//     });

//     // store metadata
//     newLayer.set("id", layerId);
//     newLayer.set("wmsLayerName", layerNameToUse);
//     newLayer.set("parentLayer", parentLayer || null);

//     // add to map immediately
//     mapInstance.addLayer(newLayer);
//     wmsWmtsLayersRef.current[key] = newLayer;
//     console.log("[addMapLayer] added layer:", key);
//   }

//   // -----------------------------
//   // Fetch BBoxes (optional)
//   // -----------------------------
//   try {
//     const bboxes = await fetchLayerBBoxes(dataset);

//     // Only use BBox for zooming, do not block rendering
//     const bbox =
//       bboxes[layerNameToUse] ||
//       (parentLayer && bboxes[parentLayer.wmsLayerName]);

//     if (bbox) {
//       console.log(`[addMapLayer] applying bbox for ${key}:`, bbox);
//       zoomToLayer(mapInstance, bbox.extent, bbox.crs);
//     } else {
//       console.warn(`[addMapLayer] no bbox found for ${key}, layer still added`);
//     }
//   } catch (err) {
//     console.warn(
//       `[addMapLayer] failed to fetch bbox for ${key}, layer still added`,
//       err
//     );
//   }

//   return newLayer;
// }

//v6
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import { DATASET_CONFIG } from "../config/datasetConfig";
import { fetchLayerBBoxes } from "./fetchLayerBBoxes";
import { zoomToLayer } from "./zoomToLayer";
import { resolveLayerName } from "./wmsUtils";

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
  parentLayer = null,
}) {
  if (!wmsWmtsLayersRef?.current || !mapInstance) return;

  const key = styleId
    ? `${groupId}:${layerId}:${styleId}`
    : `${groupId}:${layerId}`;

  const dataset = DATASET_CONFIG[groupId];
  if (!dataset) {
    console.error(`[addMapLayer] No dataset config for groupId: ${groupId}`);
    return;
  }

  const useRecursiveParsing = dataset.recursiveBBoxes || false;

  // === Fetch BBoxes first ===
  const bboxes = await fetchLayerBBoxes(dataset, {
    recursiveParsing: useRecursiveParsing,
  });

  // === Use resolveLayerName instead of manual search ===
  const layerNameToUse = resolveLayerName(layerId, bboxes, dataset, {
    verbose: true,
  });

  // Now safe to get bbox
  const bbox =
    bboxes[layerNameToUse] || (parentLayer && bboxes[parentLayer.wmsLayerName]);

  if (!bbox && parentLayer) {
    console.warn(`[addMapLayer] Using parent extent fallback for ${key}`);
  }

  // Remove existing layer if present
  if (wmsWmtsLayersRef.current[key]) {
    mapInstance.removeLayer(wmsWmtsLayersRef.current[key]);
    delete wmsWmtsLayersRef.current[key];
  }

  if (!isActive) {
    highlightSource?.clear();
    return;
  }

  let newLayer = null;
  const srsParam = projectionCode === "EPSG:4326" ? "CRS" : "SRS";

  if (type === "wms") {
    newLayer = new TileLayer({
      source: new TileWMS({
        url: dataset.url,
        params: {
          SERVICE: "WMS",
          REQUEST: "GetMap",
          VERSION: "1.3.0",
          LAYERS: layerNameToUse,
          STYLES: styleId || "",
          [srsParam]: projectionCode,
          FORMAT: "image/png",
          TRANSPARENT: true,
        },
        serverType: "geoserver",
        crossOrigin: "anonymous",
      }),
      zIndex: 10,
      opacity: 1.0,
    });

    newLayer.set("id", layerId);
    newLayer.set("wmsLayerName", layerNameToUse);
    newLayer.set("parentLayer", parentLayer || null);

    mapInstance.addLayer(newLayer);
    wmsWmtsLayersRef.current[key] = newLayer;
    console.log("[addMapLayer] added layer:", key);
  }

  // Apply zoom
  if (bbox) {
    console.log(`[addMapLayer] applying bbox for ${key}:`, bbox);
    zoomToLayer(mapInstance, bbox.extent, bbox.crs);
  } else {
    console.warn(`[addMapLayer] no bbox found for ${key}, layer still added`);
  }

  return newLayer;
}

//v7
// import TileLayer from "ol/layer/Tile";
// import TileWMS from "ol/source/TileWMS";
// import { zoomToLayer } from "./zoomToLayer";
// import { createWmtsLayer } from "../utils/createWmtsLayer";
// import { resolveLayerName } from "./wmsUtils";
// import { fetchLayerBBoxes } from "./fetchLayerBBoxes";
// import { DATASET_CONFIG } from "../config/datasetConfig";

// /**
//  * Add a WMS or WMTS layer to the map dynamically
//  */
// export async function addMapLayer({
//   mapInstance,
//   groupId,
//   layerId,
//   isActive,
//   type = "wms",
//   styleId = "",
//   wmsWmtsLayersRef,
//   projectionCode = "EPSG:3857",
//   highlightSource,
//   parentLayer = null,
// }) {
//   if (!mapInstance || !wmsWmtsLayersRef?.current) return;

//   const key = styleId
//     ? `${groupId}:${layerId}:${styleId}`
//     : `${groupId}:${layerId}`;
//   const dataset = DATASET_CONFIG[groupId];

//   if (!dataset) {
//     console.error(`[addMapLayer] No dataset config for groupId: ${groupId}`);
//     return;
//   }

//   // Fetch BBoxes if configured
//   const bboxes = await fetchLayerBBoxes(dataset, {
//     recursiveParsing: dataset.recursiveBBoxes || false,
//   });

//   const layerNameToUse = resolveLayerName(layerId, bboxes, dataset, {
//     verbose: true,
//   });
//   const bbox =
//     bboxes[layerNameToUse] || (parentLayer && bboxes[parentLayer.wmsLayerName]);

//   // Remove existing layer if present
//   if (wmsWmtsLayersRef.current[key]) {
//     mapInstance.removeLayer(wmsWmtsLayersRef.current[key]);
//     delete wmsWmtsLayersRef.current[key];
//   }

//   if (!isActive) {
//     highlightSource?.clear();
//     return;
//   }

//   let newLayer = null;

//   if (type === "wms") {
//     // Dynamic WMS layer
//     newLayer = new TileLayer({
//       source: new TileWMS({
//         url: dataset.url,
//         params: {
//           SERVICE: "WMS",
//           REQUEST: "GetMap",
//           VERSION: "1.3.0",
//           LAYERS: layerNameToUse,
//           STYLES: styleId || "",
//           [projectionCode === "EPSG:4326" ? "CRS" : "SRS"]: projectionCode,
//           FORMAT: "image/png",
//           TRANSPARENT: true,
//         },
//         serverType: "geoserver",
//         crossOrigin: "anonymous",
//       }),
//       zIndex: 10,
//       opacity: 1.0,
//     });
//   }

//   if (type === "wmts") {
//     // Dynamic WMTS layer using createWmtsLayer util
//     if (!dataset.url) {
//       console.error(`[addMapLayer] WMTS dataset missing URL for ${layerId}`);
//       return;
//     }

//     newLayer = createWmtsLayer({
//       url: dataset.url, // from parsed capabilities
//       layerId: layerId, // identifier from DataLayerCreateWMTS
//       projection: mapInstance.getView().getProjection(),
//       style: styleId || "default",
//       opacity: 1.0,
//       matrixSetId: dataset.matrixSet || "EPSG:28992",
//     });
//   }

//   if (newLayer) {
//     newLayer.set("id", layerId);
//     newLayer.set("wmsLayerName", layerNameToUse);
//     newLayer.set("parentLayer", parentLayer || null);

//     mapInstance.addLayer(newLayer);
//     wmsWmtsLayersRef.current[key] = newLayer;
//     console.log(`[addMapLayer] added ${type.toUpperCase()} layer:`, key);
//   }

//   // Apply zoom to layer extent
//   if (bbox) {
//     zoomToLayer(mapInstance, bbox.extent, bbox.crs);
//   } else {
//     console.warn(`[addMapLayer] No bbox found for ${key}, layer still added`);
//   }

//   return newLayer;
// }
