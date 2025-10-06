//V5
export async function fetchLayerBBoxes(datasetConfig) {
  // Ensure datasetConfig.url never ends with "?"
  const baseUrl = datasetConfig.url.endsWith("?")
    ? datasetConfig.url.slice(0, -1)
    : datasetConfig.url;

  const projectionPriority = ["EPSG:3857", "EPSG:4326"]; // prefer 3857 if available

  try {
    const response = await fetch(
      `${baseUrl}?SERVICE=WMS&REQUEST=GetCapabilities`
    );
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");

    const layerNodes = Array.from(xml.getElementsByTagName("Layer"));
    const bboxes = {};

    layerNodes.forEach((layerNode) => {
      const nameNode = layerNode.getElementsByTagName("Name")[0];
      if (!nameNode) return;

      const layerName = nameNode.textContent;

      let bboxNode = null;
      let crsUsed = null;

      for (const crs of projectionPriority) {
        const boxes = Array.from(layerNode.getElementsByTagName("BoundingBox"));
        bboxNode = boxes.find((b) => b.getAttribute("CRS") === crs);
        if (bboxNode) {
          crsUsed = crs;
          break;
        }
      }

      if (bboxNode) {
        const minx = parseFloat(bboxNode.getAttribute("minx"));
        const miny = parseFloat(bboxNode.getAttribute("miny"));
        const maxx = parseFloat(bboxNode.getAttribute("maxx"));
        const maxy = parseFloat(bboxNode.getAttribute("maxy"));

        bboxes[layerName] = {
          extent: [minx, miny, maxx, maxy],
          crs: crsUsed,
        };
      }
    });

    return bboxes;
  } catch (err) {
    console.error(
      "[fetchLayerBBoxes] Error fetching/parsing WMS Capabilities:",
      err
    );
    return {};
  }
}
