import { DATASET_CONFIG } from "../config/datasetConfig";
import { transformExtent } from "ol/proj";

/**
 * Fetch WMS GetCapabilities, return the bbox for a specific layer in target projection.
 * @param {string} datasetId - Dataset key in DATASET_CONFIG
 * @param {string} targetProjection - e.g. "EPSG:3857"
 * @param {string} layerName - specific layer name (optional, defaults to first child)
 * @returns {Array<number>|undefined} [minX, minY, maxX, maxY] in targetProjection
 */
export async function loadWMSLayers(datasetId, targetProjection, layerName) {
  const dataset = DATASET_CONFIG[datasetId];
  if (!dataset || dataset.type !== "WMS") return undefined;

  try {
    const url = new URL(dataset.url);
    url.searchParams.set("SERVICE", "WMS");
    url.searchParams.set("REQUEST", "GetCapabilities");
    url.searchParams.set("VERSION", "1.3.0");

    const res = await fetch(url.toString());
    const text = await res.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");

    // Grab all named layers
    const layers = Array.from(xml.getElementsByTagName("Layer")).filter(
      (layer) => layer.getElementsByTagName("Name").length > 0
    );

    if (!layers.length) return undefined;

    // Pick the requested layer or fallback to first
    const layer = layerName
      ? layers.find(
          (l) => l.getElementsByTagName("Name")[0].textContent === layerName
        )
      : layers[0];

    if (!layer) return undefined;

    // Find bbox, fallback to first available if EPSG:4326 missing
    let bboxElem =
      Array.from(layer.getElementsByTagName("BoundingBox")).find(
        (b) => b.getAttribute("CRS") === "EPSG:4326"
      ) || layer.getElementsByTagName("BoundingBox")[0];

    if (!bboxElem) return undefined;

    const bboxCRS = bboxElem.getAttribute("CRS") || "EPSG:4326";
    const bbox = [
      parseFloat(bboxElem.getAttribute("minx")),
      parseFloat(bboxElem.getAttribute("miny")),
      parseFloat(bboxElem.getAttribute("maxx")),
      parseFloat(bboxElem.getAttribute("maxy")),
    ];

    // Transform to target projection if needed
    const transformed =
      bboxCRS !== targetProjection
        ? transformExtent(bbox, bboxCRS, targetProjection)
        : bbox;

    console.log(
      `[WMS Loader] Fetched bbox for ${datasetId}:${
        layerName || layer.getElementsByTagName("Name")[0].textContent
      }:`,
      transformed
    );

    return transformed;
  } catch (err) {
    console.error("[WMS Loader] Failed to load WMS layers:", err);
    return undefined;
  }
}
