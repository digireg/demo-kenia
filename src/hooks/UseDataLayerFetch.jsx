import { useState, useEffect } from "react";
import { DataLayerCreate } from "../components/DataLayerCreate";
import { DATASET_CONFIG } from "../config/datasetConfig";

/**
 * Fetch and normalize layers for all datasets in DATASET_CONFIG
 * Returns { dataLayers, loading, error }
 */
export default function useDataLayerFetch() {
  const [dataLayers, setDataLayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchAllLayers() {
      try {
        const datasets = await Promise.all(
          Object.entries(DATASET_CONFIG).map(async ([groupId, { url }]) => {
            const layers = await DataLayerCreate(
              `${url}SERVICE=WMS&REQUEST=GetCapabilities`,
              groupId
            );

            return {
              id: groupId,
              title: `${groupId} Data`,
              children: layers || [],
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
