import axios from 'axios';

/**
 * Fetch WMS GetCapabilities and return `dataLayers` array compatible with useMapLayers
 * @param {string} wmsUrl - Full URL of WMS GetCapabilities (ending with ?service=WMS&request=GetCapabilities)
 * @param {string} groupTitle - Optional group title (like 'BAG' or 'Kadaster')
 */
export async function DataLayerCreate(wmsUrl, groupTitle = 'WMS Layer') {
  try {
    const response = await axios.get(wmsUrl);
    const xmlString = response.data;

    // Browser-safe XML parser
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    // Recursive function to get all layers, including root
    function getAllLayers(layerNode) {
      const layers = [];

      // Include layer if it has a Name
      const name = layerNode.querySelector(':scope > Name')?.textContent;
      if (name) layers.push(layerNode);

      // Recurse into direct child layers
      const childLayers = Array.from(layerNode.querySelectorAll(':scope > Layer'));
      childLayers.forEach(child => {
        layers.push(...getAllLayers(child));
      });

      return layers;
    }

    const rootLayers = Array.from(xmlDoc.querySelectorAll('Capability > Layer > Layer'));
    const allLayers = rootLayers.flatMap(layerNode => getAllLayers(layerNode));

const sourceType = groupTitle.toLowerCase() === 'bag'
  ? 'bag'
  : groupTitle.toLowerCase() === 'kadaster'
  ? 'kadastrale'
  : 'wms';

const dataLayers = allLayers.map(layer => {
  const layerName = layer.querySelector(':scope > Name')?.textContent || 'unknown';
  const layerTitle = layer.querySelector(':scope > Title')?.textContent || layerName;

  const styleElements = Array.from(layer.querySelectorAll(':scope > Style'));
  const styles = styleElements.map((s, i) => ({
    id: s.querySelector('Name')?.textContent || `style${i}`,
    name: s.querySelector('Title')?.textContent || `style${i}`,
    inputType: 'radio',
    type: 'wms',
    children: [],
    opacity: 100,
    legendUrl: s.querySelector('LegendURL > OnlineResource')?.getAttribute('xlink:href') || null,
    active: i === 0,
    sourceType, // <-- assign here!
  }));

  return {
    id: layerName,
    name: layerTitle,
    active: false,
    inputType: 'checkbox',
    type: 'wms',
    children: styles,
    opacity: 100,
    legendUrl: null,
    groupTitle,
    sourceType, // <-- assign here too!
  };
});



    return dataLayers;
  } catch (err) {
    console.error('Error fetching or parsing WMS GetCapabilities:', err);
    return [];
  }
}
