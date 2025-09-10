export function flattenDataLayers(dataLayers) {
  const flatten = (layers, groupId) => {
    return layers.flatMap((layer) => {
      if (layer.children?.length > 0) {
        // Each child is a style
        return layer.children.map((child) => ({
          groupId,
          layerId: layer.id, // OL layer id
          styleId: child.id, // style for OL
          label: layer.title, // <-- use layer title, not style name
          active: child.active,
          opacity: child.opacity,
        }));
      } else {
        return {
          groupId,
          layerId: layer.id,
          styleId: "", // no style
          label: layer.title,
          active: layer.active,
          opacity: layer.opacity,
        };
      }
    });
  };

  return dataLayers.flatMap((group) => flatten(group.children, group.id));
}
