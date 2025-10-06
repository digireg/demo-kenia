// import React from "react";
// import styled from "styled-components";
// import Spinner from "../style_components/Spinner";

// // ----------------------------
// // Styled Components
// // ----------------------------
// const LayerWrapper = styled.div`
//   margin-bottom: 10px;
// `;

// const LayerRow = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   margin-left: ${({ $level }) => $level * 20}px;
// `;

// const StylesRow = styled.div`
//   margin-left: ${({ $level }) => $level * 20 + 20}px;
//   margin-top: 6px;
//   display: flex;
//   flex-wrap: wrap;
//   gap: 12px;
// `;

// const StyleLabel = styled.label`
//   cursor: pointer;
//   font-size: 0.9rem;
//   display: flex;
//   align-items: center;
//   gap: 4px;
// `;

// // ----------------------------
// // Pure helper function (NOT async, NOT a component)
// // ----------------------------
// export const renderLayer = (
//   layer,
//   groupId,
//   level = 0,
//   parentActive = true,
//   onToggleLayer,
//   loadingLayers
// ) => {
//   const inputId = `input-${layer.key || layer.id}`;
//   const layerEnabled = !!layer.active && parentActive;

//   return (
//     <LayerWrapper key={inputId}>
//       {/* Layer toggle */}
//       <LayerRow $level={level}>
//         <input
//           id={inputId}
//           type={layer.inputType || "checkbox"}
//           checked={!!layer.active}
//           disabled={!!loadingLayers[`${groupId}:${layer.id}`]}
//           onChange={() =>
//             onToggleLayer(groupId, layer.id, layer.inputType || "checkbox")
//           }
//         />
//         <label htmlFor={inputId}>{layer.title || "Untitled"}</label>
//         {loadingLayers[`${groupId}:${layer.id}`] && <Spinner size={14} />}
//       </LayerRow>

//       {/* Styles as radios */}
//       {layer.styles && layer.active && (
//         <StylesRow $level={level}>
//           {layer.styles.map((s) => (
//             <StyleLabel key={s}>
//               <input
//                 type="radio"
//                 name={`style-${layer.id}`}
//                 value={s}
//                 checked={layer.style === s}
//                 onChange={() => onToggleLayer(groupId, layer.id, "radio", s)}
//               />
//               {s}
//             </StyleLabel>
//           ))}
//         </StylesRow>
//       )}

//       {/* Recursive children */}
//       {layer.children &&
//         layer.children.map((child) =>
//           renderLayer(
//             child,
//             groupId,
//             level + 1,
//             layerEnabled,
//             onToggleLayer,
//             loadingLayers
//           )
//         )}
//     </LayerWrapper>
//   );
// };

// style_components/RenderLayerStyle.js
// import React from "react";
// import Spinner from "./Spinner";

/**
 * Recursive layer renderer
 */
// export const renderLayer = (
//   layer,
//   groupId,
//   level = 0,
//   parentActive = true,
//   onToggleLayer,
//   loadingLayers
// ) => {
//   const inputId = `input-${layer.key || layer.id}`;
//   const layerEnabled = !!layer.active && parentActive;

//   return (
//     <div key={inputId} style={{ marginBottom: 10 }}>
//       {/* Checkbox / Radio row */}
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
//           onChange={() =>
//             onToggleLayer(groupId, layer.id, layer.inputType || "checkbox")
//           }
//         />
//         <label htmlFor={inputId}>{layer.title || "Untitled"}</label>
//         {loadingLayers[`${groupId}:${layer.id}`] && <Spinner size={14} />}
//       </div>

//       {/* Styles row */}
//       {layer.styles && layer.active && (
//         <div style={{ marginLeft: level * 20 + 20, marginTop: 6 }}>
//           {layer.styles.map((s) => (
//             <label key={s} style={{ marginRight: 12 }}>
//               <input
//                 type="radio"
//                 name={`style-${layer.id}`}
//                 value={s}
//                 checked={layer.style === s}
//                 onChange={() => onToggleLayer(groupId, layer.id, "radio", s)}
//               />
//               {s}
//             </label>
//           ))}
//         </div>
//       )}

//       {/* Children */}
//       {layer.children &&
//         layer.children.map((child) =>
//           renderLayer(
//             child,
//             groupId,
//             level + 1,
//             layerEnabled,
//             onToggleLayer,
//             loadingLayers
//           )
//         )}
//     </div>
//   );
// };

// export const renderLayer = (
//   layer,
//   groupId,
//   level = 0,
//   parentActive = true,
//   onToggleLayer,
//   loadingLayers,
//   activeStyles // <-- pass this from DataLaagSelect
// ) => {
//   const inputId = `input-${layer.key || layer.id}`;
//   const layerEnabled = !!layer.active && parentActive;

//   return (
//     <LayerWrapper key={inputId}>
//       {/* Parent checkbox */}
//       <LayerRow $level={level}>
//         <input
//           id={inputId}
//           type="checkbox"
//           checked={!!layer.active}
//           disabled={!!loadingLayers[`${groupId}:${layer.id}`]}
//           onChange={() => onToggleLayer(groupId, layer.id, "checkbox")}
//         />
//         <label htmlFor={inputId}>{layer.title || "Untitled"}</label>
//         {loadingLayers[`${groupId}:${layer.id}`] && <Spinner size={14} />}
//       </LayerRow>

//       {/* Styles radios */}
//       {layer.styles?.length > 0 && layer.active && (
//         <StylesRow $level={level}>
//           {layer.styles.map((styleName) => (
//             <StyleLabel key={styleName}>
//               <input
//                 type="radio"
//                 name={`style-${layer.id}`}
//                 value={styleName}
//                 checked={layer.activeStyle === styleName} // ✅ now bound
//                 disabled={!layer.active}
//                 onChange={() =>
//                   onToggleLayer(groupId, layer.id, "radio", styleName)
//                 }
//               />
//               {styleName}
//             </StyleLabel>
//           ))}
//         </StylesRow>
//       )}

//       {/* Children */}
//       {layer.children?.length > 0 &&
//         layer.children.map((child) =>
//           renderLayer(
//             child,
//             groupId,
//             level + 1,
//             layerEnabled,
//             onToggleLayer,
//             loadingLayers,
//             activeStyles
//           )
//         )}
//     </LayerWrapper>
//   );
// };

import React from "react";
import styled from "styled-components";
import Spinner from "../style_components/Spinner";

const LayerWrapper = styled.div`
  margin-bottom: 10px;
`;
const LayerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: ${({ $level }) => $level * 20}px;
`;
const StylesRow = styled.div`
  margin-left: ${({ $level }) => $level * 20 + 20}px;
  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;
const StyleLabel = styled.label`
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const renderLayer = (
  layer,
  groupId,
  level = 0,
  parentActive = true,
  onToggleLayer,
  loadingLayers,
  parentId = null // <-- pass parent id for grouping radio children
) => {
  const inputId = `input-${layer.key || layer.id}`;
  const layerEnabled = !!layer.active && parentActive;
  const isRadioInput = layer.inputType === "radio";
  const radioName = isRadioInput
    ? `style-${parentId || layer.parentId || layer.id}`
    : undefined;
  const radioValue = isRadioInput
    ? layer.wmsLayerName || layer.name || layer.id
    : undefined;

  return (
    <LayerWrapper key={inputId}>
      {/* Parent / own row (checkbox or radio if the layer itself is radio-type) */}
      <LayerRow $level={level}>
        <input
          id={inputId}
          type={isRadioInput ? "radio" : "checkbox"}
          name={isRadioInput ? radioName : undefined}
          value={isRadioInput ? radioValue : undefined}
          checked={!!layer.active}
          disabled={!!loadingLayers[`${groupId}:${layer.id}`]}
          onChange={() =>
            onToggleLayer(
              groupId,
              layer.id,
              isRadioInput ? "radio" : "checkbox",
              isRadioInput ? radioValue : null
            )
          }
        />
        <label htmlFor={inputId}>{layer.title || "Untitled"}</label>
        {loadingLayers[`${groupId}:${layer.id}`] && <Spinner size={14} />}
      </LayerRow>

      {/* If this layer has style names array (legacy 'styles' on parent), render those as normal radios */}
      {/* {layer.styles?.length > 0 && layer.active && (
        <StylesRow $level={level}>
          {layer.styles.map((styleName) => (
            <StyleLabel key={styleName}>
              <input
                type="radio"
                id={`input-${layer.id}-${styleName}`}
                name={`style-${layer.id}`} // group by this parent
                value={styleName}
                checked={layer.activeStyle === styleName}
                disabled={!layer.active}
                onChange={() =>
                  onToggleLayer(groupId, layer.id, "radio", styleName)
                }
              />
              {styleName}
            </StyleLabel>
          ))}
        </StylesRow>
      )} */}
      {layer.styles && layer.active && (
        <div style={{ marginLeft: level * 20 + 20, marginTop: 6 }}>
          {layer.styles.map((s) => (
            <label key={s} style={{ marginRight: 12 }}>
              <input
                type="radio"
                name={`style-${layer.id}`}
                value={s}
                checked={activeStyles[layer.id] === s} // <-- use activeStyles
                onChange={() => onToggleLayer(groupId, layer.id, "radio", s)}
              />
              {s}
            </label>
          ))}
        </div>
      )}

      {/* Children (pass this layer.id as parentId so child radios will be grouped properly) */}
      {layer.children?.length > 0 &&
        layer.children.map((child) =>
          renderLayer(
            child,
            groupId,
            level + 1,
            layerEnabled,
            onToggleLayer,
            loadingLayers,
            layer.id
          )
        )}
    </LayerWrapper>
  );
};
