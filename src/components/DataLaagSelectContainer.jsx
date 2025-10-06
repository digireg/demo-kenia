// import React, { useEffect, useRef, useState } from "react";
// import { FiLayers } from "react-icons/fi";
// import { Switch } from "../style_components/FormStyles";
// import Accordion from "../style_components/Accordion";

// import {
//   DataLaagSelectContainer,
//   DataLaagSelectPanel,
//   Header,
//   TopRow,
//   TitleGroup,
//   SwitchGroup,
//   FilterInput,
//   Content,
//   BottomSpacer,
//   NoResults,
// } from "../style_components/DataLaagSelectContainerStyle";

// import Spinner from "../style_components/Spinner";

// function findLayerById(groupId, layerId, dataLayers) {
//   const group = dataLayers.find((g) => g.id === groupId);
//   if (!group) return null;

//   const search = (layers) => {
//     for (const layer of layers) {
//       if (layer.id === layerId) return layer;
//       if (layer.children?.length) {
//         const found = search(layer.children);
//         if (found) return found;
//       }
//     }
//     return null;
//   };

//   return search(group.children || []);
// }

// export default function DataLaagSelect({
//   isOpen,
//   setActivePanel,
//   dataLayers,
//   setLayerActive,
//   mapRef,
//   wmsWmtsLayersRef,
//   currentProjectionCode,
// }) {
//   const panelRef = useRef(null);
//   const [showOnlyActive, setShowOnlyActive] = useState(false);
//   const [filterQuery, setFilterQuery] = useState("");
//   const [loadingLayers, setLoadingLayers] = useState({});

//   // ----------------------------
//   // Close panel on outside click
//   // ----------------------------
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (panelRef.current && !panelRef.current.contains(e.target)) {
//         setActivePanel(null);
//       }
//     };
//     if (isOpen) document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isOpen, setActivePanel]);

//   // ----------------------------
//   // Toggle layer
//   // ----------------------------
//   // const onToggleLayer = async (groupId, layerId, inputType) => {
//   //   if (!setLayerActive || !mapRef?.current) return;

//   //   const layerKey = `${groupId}:${layerId}`;

//   //   // Start spinner
//   //   setLoadingLayers((prev) => ({ ...prev, [layerKey]: true }));

//   //   try {
//   //     // This is async, so the spinner shows until it resolves
//   //     await setLayerActive(mapRef.current, groupId, layerId, inputType);
//   //   } finally {
//   //     // Stop spinner
//   //     setLoadingLayers((prev) => ({ ...prev, [layerKey]: false }));
//   //   }
//   // };

//   const onToggleLayer = async (groupId, layerId, inputType) => {
//     if (!setLayerActive || !mapRef?.current) return;

//     const layer = findLayerById(groupId, layerId, dataLayers); // from flattened data
//     if (!layer) return;

//     // Spinner
//     setLoadingLayers((prev) => ({ ...prev, [layer.key]: true }));

//     try {
//       // Pass OL/WMS layerName for addMapLayer
//       await setLayerActive(
//         mapRef.current,
//         groupId,
//         layer.id, // OL identity
//         inputType,
//         layer.wmsLayerName // WMS name
//       );
//     } finally {
//       setLoadingLayers((prev) => ({ ...prev, [layer.key]: false }));
//     }
//   };

//   // ----------------------------
//   // Filter layers recursively
//   // ----------------------------
//   const filterGroup = (group) => {
//     const filteredChildren = (group.children || [])
//       .map((child) => filterGroup(child))
//       .filter(Boolean);

//     const matchesGroupTitle = group.title
//       ?.toLowerCase()
//       .includes(filterQuery.toLowerCase());

//     if (showOnlyActive) {
//       return filteredChildren.length > 0 || group.active
//         ? { ...group, children: filteredChildren }
//         : null;
//     }

//     return matchesGroupTitle || filteredChildren.length > 0
//       ? {
//           ...group,
//           children: matchesGroupTitle ? group.children : filteredChildren,
//         }
//       : null;
//   };

//   const filteredDataLayers = (dataLayers || [])
//     .map(filterGroup)
//     .filter(Boolean);

//   // ----------------------------
//   // Recursive render
//   // ----------------------------
//   const renderLayer = (layer, groupId, level = 0) => {
//     const inputId = `input-${layer.key || layer.id}`;

//     return (
//       <div key={inputId} style={{ marginLeft: level * 16, marginBottom: 6 }}>
//         <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
//           <input
//             id={inputId}
//             type={layer.inputType || "checkbox"}
//             checked={!!layer.active}
//             disabled={!!loadingLayers[`${groupId}:${layer.id}`]}
//             onChange={() => onToggleLayer(groupId, layer.id, layer.inputType)}
//           />
//           {layer.title || "Untitled"}
//           {loadingLayers[`${groupId}:${layer.id}`] && <Spinner size={14} />}
//         </label>

//         {layer.active &&
//           layer.children &&
//           layer.children.map((child) => renderLayer(child, groupId, level + 1))}
//       </div>
//     );
//   };

//   return (
//     <DataLaagSelectContainer>
//       <DataLaagSelectPanel ref={panelRef} $isOpen={isOpen}>
//         <Header>
//           <TopRow>
//             <TitleGroup>
//               <FiLayers size={20} />
//               <h1>Data Layers</h1>
//             </TitleGroup>

//             <SwitchGroup>
//               <Switch
//                 checked={showOnlyActive}
//                 onChange={() => setShowOnlyActive(!showOnlyActive)}
//               />
//               <span>Show active only</span>
//             </SwitchGroup>
//           </TopRow>

//           <FilterInput
//             type="text"
//             placeholder="Filter layers..."
//             value={filterQuery}
//             onChange={(e) => setFilterQuery(e.target.value)}
//           />
//         </Header>

//         <Content>
//           {filteredDataLayers.length > 0 ? (
//             filteredDataLayers.map((group) => (
//               <Accordion key={group.id} title={group.title}>
//                 {group.children.map((layer) => renderLayer(layer, group.id))}
//               </Accordion>
//             ))
//           ) : (
//             <NoResults>No results found</NoResults>
//           )}
//         </Content>
//         <BottomSpacer />
//       </DataLaagSelectPanel>
//     </DataLaagSelectContainer>
//   );
// }

import React, { useEffect, useRef, useState } from "react";
import { FiLayers } from "react-icons/fi";
import { Switch } from "../style_components/FormStyles";
import Accordion from "../style_components/Accordion";
import { renderLayer } from "../style_components/RenderLayerStyle";

import {
  DataLaagSelectContainer,
  DataLaagSelectPanel,
  Header,
  TopRow,
  TitleGroup,
  SwitchGroup,
  FilterInput,
  Content,
  BottomSpacer,
  NoResults,
} from "../style_components/DataLaagSelectContainerStyle";

import Spinner from "../style_components/Spinner";

function findLayerById(groupId, layerId, dataLayers) {
  const group = dataLayers.find((g) => g.id === groupId);
  if (!group) return null;

  const search = (layers) => {
    for (const layer of layers) {
      if (layer.id === layerId) return layer;
      if (layer.children?.length) {
        const found = search(layer.children);
        if (found) return found;
      }
    }
    return null;
  };

  return search(group.children || []);
}

export default function DataLaagSelect({
  isOpen,
  setActivePanel,
  dataLayers,
  setDataLayers,
  setLayerActive,
  mapRef,
  wmsWmtsLayersRef,
  currentProjectionCode,
}) {
  const panelRef = useRef(null);
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [loadingLayers, setLoadingLayers] = useState({});

  //-----------------------------
  // active layer style
  //-----------------------------
  const [activeStyles, setActiveStyles] = useState({});

  // ----------------------------
  // Close panel on outside click
  // ----------------------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setActivePanel(null);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setActivePanel]);

  // ----------------------------
  // Toggle layer (with optional style)
  // ----------------------------
  // const onToggleLayer = async (groupId, layerId, inputType, style = null) => {
  //   if (!setLayerActive || !mapRef?.current) return;

  //   const layer = findLayerById(groupId, layerId, dataLayers);
  //   if (!layer) return;

  //   // Spinner
  //   setLoadingLayers((prev) => ({ ...prev, [layer.key]: true }));

  //   try {
  //     // Pass style if provided
  //     await setLayerActive(
  //       mapRef.current,
  //       groupId,
  //       layer.id,
  //       inputType,
  //       layer.wmsLayerName,
  //       style
  //     );
  //   } finally {
  //     setLoadingLayers((prev) => ({ ...prev, [layer.key]: false }));
  //   }
  // };

  // const onToggleLayer = async (groupId, layerId, inputType, style = null) => {
  //   console.log("[onToggleLayer] called", {
  //     groupId,
  //     layerId,
  //     inputType,
  //     style,
  //   });
  //   if (!setLayerActive || !mapRef?.current) return;

  //   const layer = findLayerById(groupId, layerId, dataLayers);
  //   if (!layer) {
  //     console.warn("[onToggleLayer] layer not found", { groupId, layerId });
  //     return;
  //   }

  //   console.log("[onToggleLayer] layer found", layer);

  //   setLoadingLayers((prev) => ({ ...prev, [`${groupId}:${layer.id}`]: true }));

  //   try {
  //     await setLayerActive(
  //       mapRef.current,
  //       groupId,
  //       layerId,
  //       inputType,
  //       layer.wmsLayerName,
  //       style
  //     );
  //     console.log("[onToggleLayer] setLayerActive done");
  //   } finally {
  //     setLoadingLayers((prev) => ({
  //       ...prev,
  //       [`${groupId}:${layer.id}`]: false,
  //     }));
  //     console.log("[onToggleLayer] spinner cleared");
  //   }
  // };

  // const onToggleLayer = async (groupId, layerId, inputType, style = null) => {
  //   console.log("[onToggleLayer] called", {
  //     groupId,
  //     layerId,
  //     inputType,
  //     style,
  //   });

  //   if (!setLayerActive || !mapRef?.current) return;

  //   const layer = findLayerById(groupId, layerId, dataLayers);
  //   if (!layer) {
  //     console.warn("[onToggleLayer] layer not found", { groupId, layerId });
  //     return;
  //   }

  //   console.log("[onToggleLayer] layer found", layer);

  //   // If this layer is a "style child", update the parent layer ID
  //   const actualLayerId = layer.parentId || layer.id;

  //   setLoadingLayers((prev) => ({
  //     ...prev,
  //     [`${groupId}:${actualLayerId}`]: true,
  //   }));

  //   try {
  //     await setLayerActive(
  //       mapRef.current,
  //       groupId,
  //       actualLayerId,
  //       inputType,
  //       layer.wmsLayerName,
  //       style
  //     );
  //     console.log("[onToggleLayer] setLayerActive done");
  //   } finally {
  //     setLoadingLayers((prev) => ({
  //       ...prev,
  //       [`${groupId}:${actualLayerId}`]: false,
  //     }));
  //     console.log("[onToggleLayer] spinner cleared");
  //   }
  // };

  //Working version
  // const onToggleLayer = async (groupId, layerId, inputType, style = null) => {
  //   if (!setLayerActive || !mapRef?.current) return;

  //   const layer = findLayerById(groupId, layerId, dataLayers);
  //   if (!layer) return;

  //   if (inputType === "radio" && style) {
  //     setActiveStyles((prev) => ({ ...prev, [layer.id]: style }));
  //   }

  //   setLoadingLayers((prev) => ({
  //     ...prev,
  //     [`${groupId}:${layerId}`]: true,
  //   }));

  //   try {
  //     await setLayerActive(mapRef.current, groupId, layerId, inputType, style);
  //   } finally {
  //     setLoadingLayers((prev) => ({
  //       ...prev,
  //       [`${groupId}:${layerId}`]: false,
  //     }));
  //   }
  // };

  // const onToggleLayer = (groupId, layerId, type, styleName) => {
  //   setDataLayers((prev) =>
  //     prev.map((group) =>
  //       group.id === groupId
  //         ? {
  //             ...group,
  //             children: group.children.map((layer) =>
  //               layer.id === layerId
  //                 ? {
  //                     ...layer,
  //                     active:
  //                       type === "checkbox" ? !layer.active : layer.active,
  //                   }
  //                 : layer
  //             ),
  //           }
  //         : group
  //     )
  //   );

  //   if (type === "radio") {
  //     setActiveStyles((prev) => ({
  //       ...prev,
  //       [layerId]: styleName,
  //     }));

  //     // update OL layer style param
  //     const olLayer = mapRef.current
  //       .getLayers()
  //       .getArray()
  //       .find((l) => l.get("id") === layerId);

  //     if (olLayer) {
  //       olLayer.getSource().updateParams({ STYLES: styleName });
  //     }
  //   }

  //   if (type === "checkbox") {
  //     // toggle add/remove layer from map
  //     setLayerActive(mapRef.current, groupId, layerId, type);
  //   }
  // };

  // const onToggleLayer = (groupId, layerId, type, styleName) => {
  //   if (type === "radio") {
  //     setActiveStyles((prev) => ({
  //       ...prev,
  //       [layerId]: styleName,
  //     }));

  //     // update OL layer style param
  //     const olLayer = mapRef.current
  //       .getLayers()
  //       .getArray()
  //       .find((l) => l.get("id") === layerId);

  //     if (olLayer) {
  //       olLayer.getSource().updateParams({ STYLES: styleName });
  //     }
  //   }

  //   if (type === "checkbox") {
  //     // toggle add/remove layer from map AND update active in state
  //     setLayerActive(mapRef.current, groupId, layerId, type);
  //   }
  // };

  // const onToggleLayer = (groupId, layerId, type, styleName) => {
  //   const layer = findLayerById(groupId, layerId, dataLayers);
  //   if (!layer) return;

  //   if (type === "radio") {
  //     // Update state
  //     setActiveStyles((prev) => ({
  //       ...prev,
  //       [layerId]: styleName,
  //     }));

  //     // Only update map if layer is active
  //     if (layer.active) {
  //       setLayerActive(mapRef.current, groupId, layerId, "checkbox", styleName);
  //     }
  //   }

  //   if (type === "checkbox") {
  //     // Toggle parent layer
  //     setLayerActive(mapRef.current, groupId, layerId, "checkbox");

  //     // If turning off, clear activeStyles for this layer
  //     if (layer.active) {
  //       setActiveStyles((prev) => {
  //         const copy = { ...prev };
  //         delete copy[layerId];
  //         return copy;
  //       });
  //     }
  //   }
  // };

  const onToggleLayer = (groupId, layerId, type, styleName) => {
    const layer = findLayerById(groupId, layerId, dataLayers);
    if (!layer) return;

    if (type === "checkbox") {
      // toggle parent layer
      setLayerActive(mapRef.current, groupId, layerId, "checkbox");

      // Clear activeStyles if turning off
      if (layer.active) {
        setActiveStyles((prev) => {
          const copy = { ...prev };
          delete copy[layerId];
          return copy;
        });
      } else {
        // If parent has radio children, keep the first child as default style
        if (layer.children?.length) {
          const firstStyleChild = layer.children.find(
            (c) => c.inputType === "radio"
          );
          if (firstStyleChild) {
            setActiveStyles((prev) => ({
              ...prev,
              [layerId]: firstStyleChild.styleName || firstStyleChild.id,
            }));

            const olLayer = wmsWmtsLayersRef.current[layerId];
            if (olLayer) {
              olLayer.getSource().updateParams({
                STYLES: firstStyleChild.styleName || firstStyleChild.id,
              });
            }

            // mark first child active
            setDataLayers((prev) =>
              prev.map((group) =>
                group.id === groupId
                  ? {
                      ...group,
                      children: group.children.map((l) =>
                        l.id === layerId
                          ? {
                              ...l,
                              children: l.children.map((c) => ({
                                ...c,
                                active: c.id === firstStyleChild.id,
                              })),
                            }
                          : l
                      ),
                    }
                  : group
              )
            );
          }
        }
      }
    }

    if (type === "radio") {
      // Only update style if parent is active
      const parentLayer = layer.parentId
        ? findLayerById(groupId, layer.parentId, dataLayers)
        : layer;

      if (!parentLayer?.active) {
        console.log("[onToggleLayer] parent not active, skipping style change");
        return;
      }

      // update activeStyles
      setActiveStyles((prev) => ({
        ...prev,
        [parentLayer.id]: styleName,
      }));

      // update OL layer STYLES
      const olLayer = wmsWmtsLayersRef.current[parentLayer.id];
      if (olLayer) {
        olLayer.getSource().updateParams({ STYLES: styleName });
      }

      // mark only clicked child as active
      setDataLayers((prev) =>
        prev.map((group) =>
          group.id === groupId
            ? {
                ...group,
                children: group.children.map((l) =>
                  l.id === parentLayer.id
                    ? {
                        ...l,
                        children: l.children.map((c) => ({
                          ...c,
                          active: c.id === layerId,
                        })),
                      }
                    : l
                ),
              }
            : group
        )
      );
    }
  };

  // ----------------------------
  // Filter layers recursively
  // ----------------------------
  const filterGroup = (group) => {
    const filteredChildren = (group.children || [])
      .map((child) => filterGroup(child))
      .filter(Boolean);

    const matchesGroupTitle = group.title
      ?.toLowerCase()
      .includes(filterQuery.toLowerCase());

    if (showOnlyActive) {
      return filteredChildren.length > 0 || group.active
        ? { ...group, children: filteredChildren }
        : null;
    }

    return matchesGroupTitle || filteredChildren.length > 0
      ? {
          ...group,
          children: matchesGroupTitle ? group.children : filteredChildren,
        }
      : null;
  };

  const filteredDataLayers = (dataLayers || [])
    .map(filterGroup)
    .filter(Boolean);

  // ----------------------------
  // Recursive render
  // ----------------------------
  // const renderLayer = (layer, groupId, level = 0, parentActive = true) => {
  //   const inputId = `input-${layer.key || layer.id}`;
  //   const layerEnabled = !!layer.active && parentActive;

  //   return (
  //     <div
  //       key={inputId}
  //       style={{ marginLeft: level * 20, marginBottom: 10, marginTop: 10 }}
  //     >
  //       <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
  //         <input
  //           id={inputId}
  //           type={layer.inputType || "checkbox"}
  //           checked={!!layer.active}
  //           disabled={!!loadingLayers[`${groupId}:${layer.id}`]}
  //           onChange={() => onToggleLayer(groupId, layer.id, layer.inputType)}
  //         />
  //         {layer.title || "Untitled"}
  //         {loadingLayers[`${groupId}:${layer.id}`] && <Spinner size={14} />}
  //       </label>

  //       {/* Render style selector if layer has styles */}
  //       {layer.styles && layer.active && (
  //         <div style={{ marginLeft: 5, marginTop: 4, marginBottom: 10 }}>
  //           {layer.styles.map((s) => (
  //             <label key={s} style={{ marginRight: 8 }}>
  //               <input
  //                 type="radio"
  //                 name={`style-${layer.id}`}
  //                 value={s}
  //                 checked={layer.style === s}
  //                 onChange={() =>
  //                   onToggleLayer(groupId, layer.id, layer.inputType, s)
  //                 }
  //               />
  //               {s}
  //             </label>
  //           ))}
  //         </div>
  //       )}

  //       {/* Render children independently */}
  //       {layer.children &&
  //         layer.children.map((child) =>
  //           renderLayer(child, groupId, level + 1, layerEnabled)
  //         )}
  //     </div>
  //   );
  // };

  // const renderLayer = (layer, groupId, level = 0, parentActive = true) => {
  //   const inputId = `input-${layer.key || layer.id}`;
  //   const layerEnabled = !!layer.active && parentActive;

  //   return (
  //     <div key={inputId} style={{ marginBottom: 10 }}>
  //       {/* Checkbox row (indented) */}
  //       <div
  //         style={{
  //           marginLeft: level * 20,
  //           display: "flex",
  //           alignItems: "center",
  //           gap: 8,
  //         }}
  //       >
  //         <input
  //           id={inputId}
  //           type={layer.inputType || "checkbox"}
  //           checked={!!layer.active}
  //           disabled={!!loadingLayers[`${groupId}:${layer.id}`]}
  //           onChange={() => onToggleLayer(groupId, layer.id, layer.inputType)}
  //         />
  //         <label htmlFor={inputId}>{layer.title || "Untitled"}</label>
  //         {loadingLayers[`${groupId}:${layer.id}`] && <Spinner size={14} />}
  //       </div>

  //       {/* Styles row (extra indent, but independent) */}
  //       {layer.styles && layer.active && (
  //         <div style={{ marginLeft: level * 20 + 20, marginTop: 6 }}>
  //           {layer.styles.map((s) => (
  //             <label key={s} style={{ marginRight: 12 }}>
  //               <input
  //                 type="radio"
  //                 name={`style-${layer.id}`} // group radios per layer
  //                 value={s}
  //                 checked={layer.style === s}
  //                 onChange={
  //                   () => onToggleLayer(groupId, layer.id, "radio", s) // <-- must update layer.style in state
  //                 }
  //               />
  //               {s}
  //             </label>
  //           ))}
  //         </div>
  //       )}

  //       {/* Children */}
  //       {layer.children &&
  //         layer.children.map((child) =>
  //           renderLayer(child, groupId, level + 1, layerEnabled)
  //         )}
  //     </div>
  //   );
  // };

  return (
    <DataLaagSelectContainer>
      <DataLaagSelectPanel ref={panelRef} $isOpen={isOpen}>
        <Header>
          <TopRow>
            <TitleGroup>
              <FiLayers size={20} />
              <h1>Data Layers</h1>
            </TitleGroup>

            <SwitchGroup>
              <Switch
                checked={showOnlyActive}
                onChange={() => setShowOnlyActive(!showOnlyActive)}
              />
              <span>Show active only</span>
            </SwitchGroup>
          </TopRow>

          <FilterInput
            type="text"
            placeholder="Filter layers..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
          />
        </Header>

        <Content>
          {filteredDataLayers.length > 0 ? (
            filteredDataLayers.map((group) => (
              <Accordion key={group.id} title={group.title}>
                {/* {group.children.map((layer) => renderLayer(layer, group.id))} */}
                {group.children.map((layer) =>
                  renderLayer(
                    layer,
                    group.id,
                    0,
                    true,
                    onToggleLayer,
                    loadingLayers,
                    {
                      /* activeStyles */
                    }
                  )
                )}
              </Accordion>
            ))
          ) : (
            <NoResults>No results found</NoResults>
          )}
        </Content>
        <BottomSpacer />
      </DataLaagSelectPanel>
    </DataLaagSelectContainer>
  );
}
