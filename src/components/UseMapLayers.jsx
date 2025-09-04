import { useState, useRef, useEffect } from "react";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import { DataLayerCreate } from "./DataLayerCreate";
import { DATASET_CONFIG } from "../assets/datasetConfig";

export default function useMapLayers({ projectionCode, highlightSource }) {
  const wmsWmtsLayersRef = useRef({});
  const [dataLayers, setDataLayers] = useState([]);
  const [selectedFeatureId, setSelectedFeatureId] = useState(null);

  useEffect(() => {
    async function fetchLayers() {
      try {
        function cleanLayerTitles(layers = []) {
          return layers.map((layer) => {
            const rawName = layer.name || layer.id || "unknown";
            const rawTitle = layer.title ?? rawName;

            return {
              ...layer,
              id: rawName,
              wmsId: rawName,
              title: rawTitle.replace(/^[^:]+:/, "").trim(), // strip namespace prefix
              opacity: typeof layer.opacity === "number" ? layer.opacity : 100,
              children: cleanLayerTitles(layer.children || []),
            };
          });
        }

        const datasets = await Promise.all(
          Object.entries(DATASET_CONFIG).map(async ([groupId, { url }]) => {
            const layers = await DataLayerCreate(
              `${url}SERVICE=WMS&REQUEST=GetCapabilities`,
              groupId
            );
            return {
              id: groupId,
              title: `${groupId}Data`,
              children: cleanLayerTitles(layers),
            };
          })
        );

        setDataLayers(datasets);
      } catch (err) {
        console.error("Error fetching layers:", err);
      }
    }

    fetchLayers();
  }, []);

  // ----------------------------
  // Add/remove OL layers
  // ----------------------------
  const addMapLayer = (mapInstance, groupId, layerId, isActive, type = "wms", styleId = "") => {
    if (!mapInstance) return;

    const key = styleId ? `${groupId}:${layerId}:${styleId}` : `${groupId}:${layerId}`;
    const dataset = DATASET_CONFIG[groupId];
    if (!dataset) {
      console.error(`No dataset config found for groupId: ${groupId}`);
      return;
    }

    if (isActive) {
      if (wmsWmtsLayersRef.current[key]) return;

      let newLayer = null;
      if (type === "wms") {
        newLayer = new TileLayer({
          source: new TileWMS({
            url: dataset.url,
            params: {
              SERVICE: "WMS",
              REQUEST: "GetMap",
              VERSION: "1.3.0",
              LAYERS: layerId,
              STYLES: styleId || "",
              CRS: projectionCode,
              FORMAT: "image/png",
              TRANSPARENT: true,
            },
            serverType: "geoserver",
            crossOrigin: "anonymous",
          }),
          zIndex: 10,
          opacity: 1.0,
        });
      }

      if (newLayer) {
        mapInstance.addLayer(newLayer);
        wmsWmtsLayersRef.current[key] = newLayer;
      }
    } else {
      const existing = wmsWmtsLayersRef.current[key];
      if (existing) {
        mapInstance.removeLayer(existing);
        delete wmsWmtsLayersRef.current[key];
      }
      if (highlightSource) highlightSource.clear();
    }
  };

  // ----------------------------
  // Toggle layer active
  // ----------------------------
const setLayerActive = (mapInstance, groupId, layerId, inputType = "checkbox") => {
  setDataLayers((prev) =>
    prev.map((group) => {
      if (group.id !== groupId) return group;

      const updatedChildren = group.children.map((parent) => {
        // ---- Parent checkbox toggle ----
        if (inputType === "checkbox" && parent.id === layerId) {
          const newActive = !parent.active;

          // get radio children
          const radios = parent.children.filter((c) => c.inputType === "radio");

          if (radios.length > 1) {
            // ---- Only run radio logic if there are 2 or more radios ----

            // remove any active style layers for this parent
            radios.forEach((r) => addMapLayer(mapInstance, groupId, parent.id, false, parent.type, r.id));

            if (newActive) {
              // pick an active radio if exists, else first
              let activeRadio = radios.find((c) => c.active) || radios[0];

              // add parent layer with chosen style
              addMapLayer(mapInstance, groupId, parent.id, true, parent.type, activeRadio.id);

              const updatedChilds = parent.children.map((c) =>
                c.inputType === "radio" ? { ...c, active: c.id === activeRadio.id } : { ...c }
              );

              return { ...parent, active: newActive, children: updatedChilds };
            } else {
              // parent deactivated -> remove all radio selections
              const updatedChilds = parent.children.map((c) => ({ ...c, active: false }));
              return { ...parent, active: newActive, children: updatedChilds };
            }
          } else {
            // ---- Parent has 0 or 1 radio child ----
            addMapLayer(mapInstance, groupId, parent.id, newActive, parent.type);
            return { ...parent, active: newActive };
          }
        }

        // ---- Radio button toggle ----
        if (inputType === "radio" && parent.children.some((c) => c.id === layerId)) {
          const updatedChilds = parent.children.map((child) => {
            if (child.inputType !== "radio") return child;
            const shouldActivate = child.id === layerId;
            addMapLayer(mapInstance, groupId, parent.id, shouldActivate, parent.type, child.id);
            return { ...child, active: shouldActivate };
          });
          return { ...parent, children: updatedChilds };
        }

        return parent;
      });

      return { ...group, children: updatedChildren };
    })
  );
};


  // ----------------------------
  // Set layer opacity
  // ----------------------------
  const setLayerOpacity = (groupId, layerId, opacity) => {
    const updateOpacityRecursive = (layers) =>
      layers.map((layer) => {
        if (layer.id === layerId) {
          const key = `${groupId}:${layerId}`;
          const olLayer = wmsWmtsLayersRef.current[key];
          if (olLayer) olLayer.setOpacity(opacity / 100);
          return { ...layer, opacity };
        }
        return { ...layer, children: updateOpacityRecursive(layer.children) };
      });

    setDataLayers((prev) =>
      prev.map((group) =>
        group.id === groupId ? { ...group, children: updateOpacityRecursive(group.children) } : group
      )
    );
  };

  return {
    dataLayers,
    setLayerActive,
    setLayerOpacity,
    addMapLayer,
    selectedFeatureId,
    setSelectedFeatureId,
    wmsWmtsLayersRef,
  };
}
