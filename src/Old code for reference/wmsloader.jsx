//V1

// import { DATASET_CONFIG } from "../config/datasetConfig";

// /**
//  * Fetch and parse WMS GetCapabilities, populate children dynamically.
//  */
// export async function loadWMSLayers(datasetId) {
//   const dataset = DATASET_CONFIG[datasetId];
//   if (!dataset || dataset.type !== "WMS") return;

//   try {
//     const url = new URL(dataset.url);
//     url.searchParams.set("SERVICE", "WMS");
//     url.searchParams.set("REQUEST", "GetCapabilities");
//     url.searchParams.set("VERSION", "1.3.0");

//     const res = await fetch(url.toString());
//     const text = await res.text();
//     const parser = new DOMParser();
//     const xml = parser.parseFromString(text, "text/xml");

//     // Grab all named layers
//     const layers = Array.from(xml.getElementsByTagName("Layer")).filter(
//       (layer) => layer.getElementsByTagName("Name").length > 0
//     );

//     dataset.children = layers.map((layer) => {
//       const name = layer.getElementsByTagName("Name")[0].textContent;
//       const title = layer.getElementsByTagName("Title")[0]?.textContent || name;

//       // Try EPSG:4326 bbox first, fallback to undefined
//       const bboxElem = Array.from(
//         layer.getElementsByTagName("BoundingBox")
//       ).find((b) => b.getAttribute("CRS") === "EPSG:4326");

//       const bbox = bboxElem
//         ? [
//             parseFloat(bboxElem.getAttribute("minx")),
//             parseFloat(bboxElem.getAttribute("miny")),
//             parseFloat(bboxElem.getAttribute("maxx")),
//             parseFloat(bboxElem.getAttribute("maxy")),
//           ]
//         : undefined;

//       return {
//         id: `${datasetId}_${name}`,
//         title,
//         layer: name,
//         bbox,
//         inputType: "checkbox", // default
//         active: false, // default
//       };
//     });

//     console.log(
//       `[WMS Loader] Loaded ${dataset.children.length} layers for ${datasetId}`
//     );
//   } catch (err) {
//     console.error("[WMS Loader] Failed to load WMS layers:", err);
//   }
// }

//V2
// import { DATASET_CONFIG } from "../config/datasetConfig";

// /**
//  * Fetch and parse WMS GetCapabilities, populate children dynamically.
//  * Returns the bbox of a specific layer if available.
//  */
// export async function loadWMSLayers(datasetId, layerName) {
//   const dataset = DATASET_CONFIG[datasetId];
//   if (!dataset || dataset.type !== "WMS") return;

//   try {
//     const url = new URL(dataset.url);
//     url.searchParams.set("SERVICE", "WMS");
//     url.searchParams.set("REQUEST", "GetCapabilities");
//     url.searchParams.set("VERSION", "1.3.0");

//     const res = await fetch(url.toString());
//     const text = await res.text();
//     const parser = new DOMParser();
//     const xml = parser.parseFromString(text, "text/xml");

//     // Grab all named layers
//     const layers = Array.from(xml.getElementsByTagName("Layer")).filter(
//       (layer) => layer.getElementsByTagName("Name").length > 0
//     );

//     dataset.children = layers.map((layer) => {
//       const name = layer.getElementsByTagName("Name")[0].textContent;
//       const title = layer.getElementsByTagName("Title")[0]?.textContent || name;

//       // Try EPSG:4326 bbox first
//       const bboxElem = Array.from(
//         layer.getElementsByTagName("BoundingBox")
//       ).find((b) => b.getAttribute("CRS") === "EPSG:4326");

//       const bbox = bboxElem
//         ? [
//             parseFloat(bboxElem.getAttribute("minx")),
//             parseFloat(bboxElem.getAttribute("miny")),
//             parseFloat(bboxElem.getAttribute("maxx")),
//             parseFloat(bboxElem.getAttribute("maxy")),
//           ]
//         : undefined;

//       return {
//         id: `${datasetId}_${name}`,
//         title,
//         layer: name,
//         bbox,
//         inputType: "checkbox", // default
//         active: false, // default
//       };
//     });

//     console.log(
//       `[WMS Loader] Loaded ${dataset.children.length} layers for ${datasetId}`
//     );

//     // Return bbox for the requested layerName if available
//     if (layerName) {
//       const matched = dataset.children.find((l) => l.layer === layerName);
//       return matched?.bbox;
//     }
//   } catch (err) {
//     console.error("[WMS Loader] Failed to load WMS layers:", err);
//   }
// }
