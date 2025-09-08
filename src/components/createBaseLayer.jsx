import TileLayer from "ol/layer/Tile";
import WMTS from "ol/source/WMTS";
import TileWMS from "ol/source/TileWMS";
import OSM from "ol/source/OSM";
import { get as getProjection } from "ol/proj";
import { createPdokTileGrid28992, createEsriTileGrid3857 } from "./tileGrids";
import { backgroundLayersConfig } from "../assets/backgroundLayersConfig";

export function createBaseLayer(projectionCode, backgroundId) {
  const proj = getProjection(projectionCode);
  const layerConfig = backgroundLayersConfig[projectionCode]?.[backgroundId];

  if (!layerConfig)
    return new TileLayer({ source: new OSM(), zIndex: 0, preload: Infinity });

  if (layerConfig.type === "WMTS") {
    return new TileLayer({
      source: new WMTS({
        url: layerConfig.url,
        layer: layerConfig.layer,
        matrixSet: layerConfig.matrixSet,
        format: layerConfig.format,
        style: layerConfig.style,
        projection: proj,
        tileGrid: layerConfig.tileGridFunc(),
        attributions: layerConfig.attributions,
        crossOrigin: "anonymous",
        requestEncoding: "REST",
      }),
      zIndex: 0,
      preload: Infinity,
    });
  }

  if (layerConfig.type === "WMS") {
    return new TileLayer({
      source: new TileWMS({
        url: layerConfig.url,
        params: layerConfig.params,
        serverType: layerConfig.serverType,
        version: layerConfig.version,
        crossOrigin: "anonymous",
      }),
      zIndex: 0,
    });
  }

  return new TileLayer({ source: new OSM(), zIndex: 0, preload: Infinity });
}
