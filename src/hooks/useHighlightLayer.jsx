import { useMemo } from "react";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Style, Fill, Stroke } from "ol/style";

export default function useHighlightLayer() {
  const highlightSource = useMemo(() => new VectorSource(), []);
  const highlightLayer = useMemo(
    () =>
      new VectorLayer({
        source: highlightSource,
        style: new Style({
          stroke: new Stroke({ color: "#284F97", width: 2 }),
          fill: new Fill({ color: "#e3e9f5" }),
        }),
        zIndex: 999,
      }),
    [highlightSource]
  );

  const addFeatures = (features) => {
    highlightSource.clear();
    highlightSource.addFeatures(features);
  };

  const clearFeatures = () => highlightSource.clear();

  return { highlightLayer, addFeatures, clearFeatures, highlightSource };
}

// Provides a reusable highlight layer with vector source and helper methods.
// Handles feature addition/clearing and ensures consistent style/zIndex across the app.
// Can be used for any feature type (BAG, BGT, WMS) without duplicating highlight logic.
