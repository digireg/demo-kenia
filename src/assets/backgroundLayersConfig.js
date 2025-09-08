import {
  createPdokTileGrid28992,
  createEsriTileGrid3857,
} from "../components/tileGrids";

export const backgroundLayersConfig = {
  "EPSG:28992": {
    pdok_BRT: {
      type: "WMTS",
      url: "https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/{Layer}/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png",
      layer: "standaard",
      matrixSet: "EPSG:28992",
      format: "image/png",
      style: "default",
      attributions: "© PDOK BRT Achtergrondkaart",
      tileGridFunc: createPdokTileGrid28992,
    },
    pdok_luchtfoto: {
      type: "WMTS",
      url: "https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/",
      layer: "Actueel_ortho25",
      matrixSet: "EPSG:28992",
      format: "image/png",
      style: "default",
      attributions: "© PDOK",
      tileGridFunc: createPdokTileGrid28992,
    },
  },
  "EPSG:3857": {
    esri: {
      type: "WMTS",
      url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/WMTS/",
      layer: "World_Imagery",
      matrixSet: "EPSG:3857",
      format: "image/png",
      style: "default",
      attributions: "© Esri",
      tileGridFunc: createEsriTileGrid3857,
    },
    mombasa: {
      type: "WMS",
      url: "https://services.digireg.com/wms/test/mombasa-ortho/ows?",
      params: {
        LAYERS: "ortho:mombasa2019",
        FORMAT: "image/png",
        TILED: true,
        CRS: "EPSG:4326",
      },
      serverType: "geoserver",
      version: "1.3.0",
    },
  },
};
