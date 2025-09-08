import WMTSTileGrid from "ol/tilegrid/WMTS";

// ---- PDOK 28992 ----
export const pdokMatrixIds28992 = Array.from({ length: 16 }, (_, i) =>
  i.toString()
);
export const pdokResolutions28992 = [
  3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76, 26.88, 13.44, 6.72,
  3.36, 1.68, 0.84, 0.42, 0.21, 0.105,
];
export const pdokOrigin28992 = [-285401.92, 903401.92];

export const createPdokTileGrid28992 = () =>
  new WMTSTileGrid({
    origin: pdokOrigin28992,
    resolutions: pdokResolutions28992,
    matrixIds: pdokMatrixIds28992,
  });

// ---- ESRI 3857 ----
export const esriMatrixIds3857 = [];
export const esriResolutions3857 = [];
for (let z = 0; z <= 19; z++) {
  esriMatrixIds3857.push(z.toString());
  esriResolutions3857.push(156543.03392804097 / Math.pow(2, z));
}
export const esriOrigin3857 = [-20037508.342789244, 20037508.342789244];

export const createEsriTileGrid3857 = () =>
  new WMTSTileGrid({
    origin: esriOrigin3857,
    resolutions: esriResolutions3857,
    matrixIds: esriMatrixIds3857,
  });
