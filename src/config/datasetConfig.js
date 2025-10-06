//V2
export const DATASET_CONFIG = {
  Mombasa: {
    id: "Mombasa",
    title: "Mombasa",
    type: "wms",
    url: "https://services.digireg.com/wms/test/mombasa/wms?",
    legendUrl: null, // auto-generate if null
    featureInfo: true,
    dependencies: [],
    children: [],
  },

  Mbale: {
    id: "Mbale",
    title: "Mbale",
    type: "wms",
    url: "https://services.digireg.com/mapserver/mbale?",
    legendUrl: null,
    featureInfo: true,
    dependencies: [],
    children: [],
  },

  BAG: {
    id: "BAG",
    title: "Basisregistratie Adressen en Gebouwen",
    type: "wms",
    url: "https://service.pdok.nl/lv/bag/wms/v2_0?",
    legendUrl: null,
    featureInfo: true,
    dependencies: ["BRT_Standaard"],
    children: [
      // you can later inject: "pand", "verblijfsobject", etc.
    ],
  },

  KadastraleKaart: {
    id: "KadastraleKaartV5",
    title: "Kadastrale kaart",
    type: "wms",
    url: "https://service.pdok.nl/kadaster/kadastralekaart/wms/v5_0?",
    legendUrl: null,
    featureInfo: true,
    dependencies: ["BRT_Standaard"],
    children: [],
  },
};
