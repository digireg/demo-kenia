export const DATASET_CONFIG = {
  // WMS dataset example
  Mombasa: {
    id: "Mombasa",
    title: "Mombasa",
    type: "WMS",
    url: "https://services.digireg.com/wms/test/mombasa/wms?",
    layer: "base_layer", // main WMS layer
    legendUrl: null, // auto-generated if null
    featureInfo: true, // enable GetFeatureInfo
    dependencies: [], // no dependencies
    children: [
      { id: "Mombasa_roads", title: "Roads", layer: "roads" },
      { id: "Mombasa_buildings", title: "Buildings", layer: "buildings" },
    ],
  },

  // Another WMS dataset example
  Mbale: {
    id: "Mbale",
    title: "Mbale",
    type: "WMS",
    url: "https://services.digireg.com/mapserver/mbale?",
    layer: "base_layer",
    legendUrl: null,
    featureInfo: true,
    dependencies: [],
    children: [],
  },

  // WMTS dataset example
  // BRT_Standaard: {
  //   id: "BRT_Standaard",
  //   title: "BRT Standaard Achtergrond",
  //   type: "WMTS",
  //   url: "https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0",
  //   layer: "standaard",
  //   legendUrl: null,
  //   featureInfo: false, // WMTS usually doesn’t support GetFeatureInfo
  //   dependencies: [],
  //   children: [],
  // },

  // Dataset with a dependency example
  // BAG: {
  //   id: "BAG",
  //   title: "BAG Gebouwen",
  //   type: "WMS",
  //   url: "https://service.pdok.nl/lv/bag/wms/v2_0?",
  //   layer: "pand",
  //   legendUrl: null,
  //   featureInfo: true,
  //   dependencies: ["BRT_Standaard"], // require background active first
  //   children: [
  //     {
  //       id: "BAG_verblijfsobject",
  //       title: "Verblijfsobject",
  //       layer: "verblijfsobject",
  //     },
  //     { id: "BAG_standplaats", title: "Standplaats", layer: "standplaats" },
  //   ],
  // },
};
