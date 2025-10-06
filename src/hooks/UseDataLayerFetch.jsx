//v4
import { useState, useEffect } from "react";
import { DataLayerCreate } from "../components/DataLayerCreate";
import { DATASET_CONFIG } from "../config/datasetConfig";

function addKeysRecursively(layers, groupId, parentKey = "") {
  return layers.filter(Boolean).map((layer, index) => {
    const uniqueKey = parentKey
      ? `${parentKey}-${layer.id || index}` // React key
      : `${groupId}:${layer.id || index}`;

    return {
      ...layer,
      id: layer.id, // keep OL layer id untouched
      key: uniqueKey, // React uniqueness
      children: layer.children
        ? addKeysRecursively(layer.children, groupId, uniqueKey)
        : [],
    };
  });
}

export default function useDataLayerFetch() {
  const [dataLayers, setDataLayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchAllLayers() {
      try {
        const datasets = await Promise.all(
          Object.entries(DATASET_CONFIG).map(async ([groupId, config]) => {
            let children = [];

            // ✅ Use hardcoded children if they exist
            if (Array.isArray(config.children) && config.children.length > 0) {
              children = addKeysRecursively(
                config.children.map((child) => ({
                  ...child,
                  opacity: child.opacity ?? 100,
                  active: child.active ?? false,
                  type: child.type ?? config.type,
                })),
                groupId
              );
            } else {
              // Otherwise fetch from WMS
              const rawLayers = await DataLayerCreate(
                `${config.url}SERVICE=WMS&REQUEST=GetCapabilities`,
                groupId
              );
              children = Array.isArray(rawLayers)
                ? addKeysRecursively(rawLayers, groupId)
                : [];
            }

            return {
              id: groupId,
              title: config.title || groupId,
              url: config.url,
              children,
            };
          })
        );

        if (isMounted) {
          setDataLayers(datasets);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching layers:", err);
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    }

    fetchAllLayers();
    return () => {
      isMounted = false;
    };
  }, []);

  return { dataLayers, loading, error };
}
