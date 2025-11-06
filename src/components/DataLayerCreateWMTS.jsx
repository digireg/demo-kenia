import axios from "axios";

/**
 * Fetch WMTS GetCapabilities and return dataLayers[] compatible with your useMapLayers hook.
 * @param {string} wmtsUrl - Full WMTS GetCapabilities URL
 * @param {string} groupTitle - Display name like 'BGT' or 'AHN'
 */
export async function DataLayerCreateWMTS(wmtsUrl, groupTitle = "WMTS Layer") {
  try {
    const response = await axios.get(wmtsUrl);
    const xmlString = response.data;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    const layers = Array.from(xmlDoc.querySelectorAll("Layer"));
    const matrixSets = Array.from(xmlDoc.querySelectorAll("TileMatrixSet"));

    // Build quick lookup for matrixSets by ID
    const matrixLookup = Object.fromEntries(
      matrixSets.map((ms) => [
        ms.querySelector("Identifier")?.textContent,
        {
          identifier: ms.querySelector("Identifier")?.textContent,
          crs: ms.querySelector("SupportedCRS")?.textContent,
          tileMatrices: Array.from(ms.querySelectorAll("TileMatrix")).map(
            (tm) => ({
              id: tm.querySelector("Identifier")?.textContent,
              scaleDenominator: parseFloat(
                tm.querySelector("ScaleDenominator")?.textContent
              ),
              topLeft: tm
                .querySelector("TopLeftCorner")
                ?.textContent?.split(" ")
                .map(Number),
              tileWidth: parseInt(tm.querySelector("TileWidth")?.textContent),
              tileHeight: parseInt(tm.querySelector("TileHeight")?.textContent),
              matrixWidth: parseInt(
                tm.querySelector("MatrixWidth")?.textContent
              ),
              matrixHeight: parseInt(
                tm.querySelector("MatrixHeight")?.textContent
              ),
            })
          ),
        },
      ])
    );

    const dataLayers = layers.map((layerNode) => {
      const id =
        layerNode.querySelector("Identifier")?.textContent || "unknown";
      const title = layerNode.querySelector("Title")?.textContent || id;
      const styleNodes = Array.from(layerNode.querySelectorAll("Style"));

      const styles = styleNodes.map((s, i) => ({
        id: s.querySelector("Identifier")?.textContent || `style${i}`,
        name: s.querySelector("Title")?.textContent || `style${i}`,
        inputType: "radio",
        type: "wmts",
        active: i === 0,
        opacity: 100,
        children: [],
        legendUrl:
          s
            .querySelector("LegendURL OnlineResource")
            ?.getAttribute("xlink:href") || null,
      }));

      const format =
        layerNode.querySelector("Format")?.textContent || "image/png";
      const matrixSetId = layerNode.querySelector(
        "TileMatrixSetLink > TileMatrixSet"
      )?.textContent;
      const matrixSet = matrixLookup[matrixSetId] || null;

      return {
        id,
        name: title,
        active: false,
        inputType: "checkbox",
        type: "wmts",
        sourceType: groupTitle.toLowerCase(),
        opacity: 100,
        legendUrl: null,
        groupTitle,
        format,
        matrixSet,
        children: styles,
      };
    });

    return dataLayers;
  } catch (err) {
    console.error("Error fetching WMTS capabilities:", err);
    return [];
  }
}
