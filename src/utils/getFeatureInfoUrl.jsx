export function getWmsFeatureInfoUrl(
  source,
  coordinate,
  resolution,
  projectionCode,
  layerId,
  extraOptions = {}
) {
  if (!source) return null;

  const defaultOptions = {
    INFO_FORMAT: "application/json",
    QUERY_LAYERS: layerId,
    FEATURE_COUNT: 10,
  };

  const options = { ...defaultOptions, ...extraOptions };

  return source.getFeatureInfoUrl(
    coordinate,
    resolution,
    projectionCode,
    options
  );
}
