//v8

import axios from "axios";

/**
 * Fetch WMS GetCapabilities and return a dataLayers array compatible with useMapLayers.
 * Handles any depth of parent/child layers and styles, keeps checkboxes and radio styles independent.
 */
export async function DataLayerCreate(
  wmsUrl,
  datasetName = "WMS Layer",
  type = "wms"
) {
  if (type.toLowerCase() !== "wms") {
    console.warn(`[DataLayerCreate] Skipping non-WMS layer: ${wmsUrl}`);
    return [];
  }

  const safeDatasetName = String(datasetName || "WMS Layer");

  try {
    const response = await axios.get(wmsUrl);
    const xmlDoc = new DOMParser().parseFromString(response.data, "text/xml");

    const rootLayer = xmlDoc.querySelector("Capability > Layer");
    if (!rootLayer) return [];

    const traverseLayer = (layerNode, parentKey = "") => {
      const name = layerNode.querySelector(":scope > Name")?.textContent;
      const title =
        layerNode.querySelector(":scope > Title")?.textContent ||
        name ||
        "unnamed";

      const safeName = (name || title).replace(/\s+/g, "_");
      const layerKey = parentKey ? `${parentKey}_${safeName}` : safeName;

      // Fetch legend URL from <Style> if available
      let legendUrl = null;
      const styleNode = layerNode.querySelector(":scope > Style");
      if (styleNode) {
        // Some servers use xlink:href, some href
        legendUrl =
          styleNode
            .querySelector("LegendURL > OnlineResource")
            ?.getAttribute("xlink:href") ||
          styleNode
            .querySelector("LegendURL > OnlineResource")
            ?.getAttribute("href") ||
          null;
      }

      const baseLayer = {
        id: layerKey,
        wmsLayerName: name || title,
        title,
        inputType: "checkbox",
        type: "wms",
        opacity: 100,
        active: false,
        children: [],
        groupTitle: safeDatasetName,
        legendUrl,
      };

      // Recursively handle child layers
      const childNodes = Array.from(
        layerNode.querySelectorAll(":scope > Layer")
      );
      childNodes.forEach((childNode) => {
        const child = traverseLayer(childNode, layerKey);
        if (child) baseLayer.children.push(child);
      });

      // Add styles as separate radio children
      const styleNodes = Array.from(
        layerNode.querySelectorAll(":scope > Style")
      );
      styleNodes.forEach((styleNode, idx) => {
        const styleName = (
          styleNode.querySelector(":scope > Name")?.textContent ||
          `style-${idx}`
        ).replace(/\s+/g, "_");
        const styleLegendUrl =
          styleNode
            .querySelector("LegendURL > OnlineResource")
            ?.getAttribute("xlink:href") ||
          styleNode
            .querySelector("LegendURL > OnlineResource")
            ?.getAttribute("href") ||
          null;

        baseLayer.children.push({
          id: styleName,
          wmsLayerName: name || title, // parent WMS layer
          title: styleName,
          inputType: "radio",
          type: "wms",
          active: false,
          children: [],
          groupTitle: safeDatasetName,
          legendUrl: styleLegendUrl || legendUrl, // fallback to layer legend
        });
      });

      return name || baseLayer.children.length ? baseLayer : null;
    };

    // Collect first-level layers
    const firstLevelLayers = Array.from(
      rootLayer.querySelectorAll(":scope > Layer")
    )
      .map((l) => traverseLayer(l))
      .filter(Boolean);

    // Include root layer itself if it has a Name
    if (rootLayer.querySelector(":scope > Name")) {
      const rootAsLayer = traverseLayer(rootLayer);
      if (rootAsLayer) firstLevelLayers.unshift(rootAsLayer);
    }

    return firstLevelLayers;
  } catch (err) {
    console.error("Error fetching or parsing WMS GetCapabilities:", err);
    return [];
  }
}

//v9

// import axios from "axios";

// /**
//  * Fetch GetCapabilities for WMS or WMTS and return a dataLayers array
//  * compatible with useMapLayers.
//  */
// export async function DataLayerCreate(
//   url,
//   datasetName = "WMS Layer",
//   type = "wms"
// ) {
//   const safeDatasetName = String(datasetName || "Layer");

//   try {
//     // =====================
//     // === WMS PARSING ====
//     // =====================
//     if (type === "wms") {
//       const response = await axios.get(url);
//       const xmlDoc = new DOMParser().parseFromString(response.data, "text/xml");

//       const rootLayer = xmlDoc.querySelector("Capability > Layer");
//       if (!rootLayer) return [];

//       const traverseLayer = (layerNode, parentKey = "") => {
//         const name = layerNode.querySelector(":scope > Name")?.textContent;
//         const title =
//           layerNode.querySelector(":scope > Title")?.textContent ||
//           name ||
//           "unnamed";

//         const safeName = (name || title).replace(/\s+/g, "_");
//         const layerKey = parentKey ? `${parentKey}_${safeName}` : safeName;

//         // Fetch legend URL from <Style> if available
//         let legendUrl = null;
//         const styleNode = layerNode.querySelector(":scope > Style");
//         if (styleNode) {
//           legendUrl =
//             styleNode
//               .querySelector("LegendURL > OnlineResource")
//               ?.getAttribute("xlink:href") ||
//             styleNode
//               .querySelector("LegendURL > OnlineResource")
//               ?.getAttribute("href") ||
//             null;
//         }

//         const baseLayer = {
//           id: layerKey,
//           wmsLayerName: name || title,
//           title,
//           inputType: "checkbox",
//           type: "wms",
//           opacity: 100,
//           active: false,
//           children: [],
//           groupTitle: safeDatasetName,
//           legendUrl,
//         };

//         // Recursively handle child layers
//         const childNodes = Array.from(
//           layerNode.querySelectorAll(":scope > Layer")
//         );
//         childNodes.forEach((childNode) => {
//           const child = traverseLayer(childNode, layerKey);
//           if (child) baseLayer.children.push(child);
//         });

//         // Add styles as separate radio children
//         const styleNodes = Array.from(
//           layerNode.querySelectorAll(":scope > Style")
//         );
//         styleNodes.forEach((styleNode, idx) => {
//           const styleName = (
//             styleNode.querySelector(":scope > Name")?.textContent ||
//             `style-${idx}`
//           ).replace(/\s+/g, "_");
//           const styleLegendUrl =
//             styleNode
//               .querySelector("LegendURL > OnlineResource")
//               ?.getAttribute("xlink:href") ||
//             styleNode
//               .querySelector("LegendURL > OnlineResource")
//               ?.getAttribute("href") ||
//             null;

//           baseLayer.children.push({
//             id: styleName,
//             wmsLayerName: name || title, // parent WMS layer
//             title: styleName,
//             inputType: "radio",
//             type: "wms",
//             active: false,
//             children: [],
//             groupTitle: safeDatasetName,
//             legendUrl: styleLegendUrl || legendUrl,
//           });
//         });

//         return name || baseLayer.children.length ? baseLayer : null;
//       };

//       const firstLevelLayers = Array.from(
//         rootLayer.querySelectorAll(":scope > Layer")
//       )
//         .map((l) => traverseLayer(l))
//         .filter(Boolean);

//       if (rootLayer.querySelector(":scope > Name")) {
//         const rootAsLayer = traverseLayer(rootLayer);
//         if (rootAsLayer) firstLevelLayers.unshift(rootAsLayer);
//       }

//       return firstLevelLayers;
//     }

//     // ======================
//     // === WMTS PARSING ====
//     // ======================
//     if (type === "wmts") {
//       const getCapabilitiesUrl = `${url}?SERVICE=WMTS&REQUEST=GetCapabilities`;
//       const response = await axios.get(getCapabilitiesUrl);
//       const xmlDoc = new DOMParser().parseFromString(response.data, "text/xml");

//       const layerNodes = Array.from(
//         xmlDoc.querySelectorAll("Contents > Layer")
//       );
//       if (!layerNodes.length) return [];

//       const wmtsLayers = layerNodes.map((layerNode, index) => {
//         const identifier =
//           layerNode.querySelector("Identifier")?.textContent ||
//           `wmts_layer_${index}`;
//         const title =
//           layerNode.querySelector("Title")?.textContent || identifier;
//         const styleIdentifier =
//           layerNode.querySelector("Style > Identifier")?.textContent ||
//           "default";
//         const format =
//           layerNode.querySelector("Format")?.textContent || "image/png";

//         return {
//           id: identifier,
//           title,
//           wmsLayerName: identifier,
//           type: "wmts",
//           inputType: "checkbox",
//           active: false,
//           opacity: 100,
//           style: styleIdentifier,
//           format,
//           groupTitle: safeDatasetName,
//           children: [],
//         };
//       });

//       return wmtsLayers;
//     }

//     // fallback
//     return [];
//   } catch (err) {
//     console.error(
//       `Error fetching or parsing ${type.toUpperCase()} GetCapabilities:`,
//       err
//     );
//     return [];
//   }
// }
