// import React, { useState, useEffect } from "react";
// import { MapButton } from "../style_components/Buttons";
// import { FaMapMarkedAlt } from "react-icons/fa";
// import {
//   LaagDataContainer,
//   DataPanel,
//   Label,
//   Data,
//   CustomAccordion,
//   PanelTitle,
// } from "../style_components/LaagDataStyle";

// // List of technical fields to ignore
// const TECHNICAL_FIELDS = ["geometry", "layerName", "typeName", "__id", "__fid"];

// const renderFeatureValue = (val) => {
//   if (val === undefined || val === null) return "-";
//   if (typeof val === "function") return "[Function]";

//   if (typeof val === "object") {
//     if (Array.isArray(val)) {
//       return val.map((item, idx) => (
//         <div key={idx}>{renderFeatureValue(item)}</div>
//       ));
//     } else {
//       return (
//         <div style={{ paddingLeft: "10px" }}>
//           {Object.entries(val).map(([k, v]) => (
//             <div key={k}>
//               <strong>{k}:</strong> {renderFeatureValue(v)}
//             </div>
//           ))}
//         </div>
//       );
//     }
//   }

//   return val;
// };

// // ----------------------------
// // Safe dynamic panel title
// // ----------------------------
// const getDynamicPanelTitle = (feature, dataLayers) => {
//   if (!feature) return "Geselecteerd object";

//   const id = feature.identificatie || "-";
//   const rawType = feature.featureType || "";

//   // Fallback if dataLayers not yet ready
//   if (!Array.isArray(dataLayers)) return `${rawType || "Object"} ${id}`;

//   // Map layer IDs to display names
//   const typeMap = {};
//   dataLayers.forEach((group) => {
//     if (!group.children) return;
//     group.children.forEach((layer) => {
//       typeMap[layer.id.toLowerCase()] = layer.name;
//     });
//   });

//   const typeName = typeMap[rawType.toLowerCase()] || "Object";
//   return `${typeName} ${id}`;
// };

// export default function LaagData({
//   selectedFeature,
//   isOpen,
//   setActivePanel,
//   dataLayers,
// }) {
//   const [featureData, setFeatureData] = useState(null);

//   const toggleData = () => {
//     if (isOpen) setActivePanel(null);
//     else setActivePanel("laagdata");
//   };

//   // useEffect(() => {
//   //   if (!selectedFeature) {
//   //     setFeatureData(null);
//   //     return;
//   //   }

//   //   const panelTitle = getDynamicPanelTitle(selectedFeature, dataLayers);

//   //   const sections = [];
//   //   Object.entries(selectedFeature).forEach(([key, value]) => {
//   //     if (TECHNICAL_FIELDS.includes(key)) return;

//   //     if (value && typeof value === "object") {
//   //       sections.push({
//   //         title: key.charAt(0).toUpperCase() + key.slice(1),
//   //         fields: Object.entries(value)
//   //           .filter(([k]) => !TECHNICAL_FIELDS.includes(k))
//   //           .map(([k, v]) => ({ label: k, value: renderFeatureValue(v) })),
//   //       });
//   //     } else {
//   //       let algemeenSection = sections.find((s) => s.title === "General");
//   //       if (!algemeenSection) {
//   //         algemeenSection = { title: "General", fields: [] };
//   //         sections.push(algemeenSection);
//   //       }
//   //       algemeenSection.fields.push({
//   //         label: key,
//   //         value: renderFeatureValue(value),
//   //       });
//   //     }
//   //   });

//   //   setFeatureData({ title: panelTitle, sections });
//   // }, [selectedFeature, dataLayers]);

//   useEffect(() => {
//     if (!selectedFeature) {
//       setFeatureData(null);
//       return;
//     }

//     // --- Handle multiple layers
//     const resultsArray = Array.isArray(selectedFeature)
//       ? selectedFeature
//       : [{ layer: null, features: [selectedFeature] }];

//     const processed = resultsArray.map((res) => {
//       const { layer, features } = res;
//       const layerTitle = layer?.name || layer?.id || "Onbekende laag";

//       const featureSections = features.map((feature) => {
//         const id = feature.getId?.() || feature.get("identificatie") || "-";
//         const props = feature.getProperties();

//         const sections = [];
//         Object.entries(props).forEach(([key, value]) => {
//           if (TECHNICAL_FIELDS.includes(key)) return;

//           if (value && typeof value === "object") {
//             sections.push({
//               title: key.charAt(0).toUpperCase() + key.slice(1),
//               fields: Object.entries(value)
//                 .filter(([k]) => !TECHNICAL_FIELDS.includes(k))
//                 .map(([k, v]) => ({ label: k, value: renderFeatureValue(v) })),
//             });
//           } else {
//             let algemeen = sections.find((s) => s.title === "Algemeen");
//             if (!algemeen) {
//               algemeen = { title: "Algemeen", fields: [] };
//               sections.push(algemeen);
//             }
//             algemeen.fields.push({
//               label: key,
//               value: renderFeatureValue(value),
//             });
//           }
//         });

//         return { id, sections };
//       });

//       return { layerTitle, featureSections };
//     });

//     setFeatureData(processed);
//   }, [selectedFeature, dataLayers]);

//   return (
//     <LaagDataContainer>
//       <MapButton
//         icon={<FaMapMarkedAlt />}
//         $active={isOpen}
//         onClick={toggleData}
//         hideText
//         aria-expanded={isOpen}
//         aria-controls="laagdata-panel"
//         aria-label="Toggle laag data panel"
//       >
//         Layer data
//       </MapButton>

//       <DataPanel
//         id="laagdata-panel"
//         $isOpen={isOpen}
//         role="region"
//         aria-live="polite"
//       >
//         {/* {featureData ? (
//           <>
//             <PanelTitle>{featureData.title}</PanelTitle>
//             {featureData.sections.map((section, idx) => (
//               <CustomAccordion key={idx} title={section.title}>
//                 {section.fields.map(({ label, value }, i) => (
//                   <div
//                     key={i}
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       marginBottom: "6px",
//                     }}
//                   >
//                     <Label>{label}</Label>
//                     <Data>{value}</Data>
//                   </div>
//                 ))}
//               </CustomAccordion>
//             ))}
//           </>
//         ) : (
//           <p>Select an object on the map</p>
//         )} */}

//         {featureData ? (
//           featureData.map((group, gi) => (
//             <div key={gi}>
//               <PanelTitle>{group.layerTitle}</PanelTitle>
//               {group.featureSections.map((feat, fi) => (
//                 <CustomAccordion key={fi} title={`Feature ${feat.id}`}>
//                   {feat.sections.map((section, si) => (
//                     <CustomAccordion key={si} title={section.title}>
//                       {section.fields.map(({ label, value }, i) => (
//                         <div
//                           key={i}
//                           style={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             marginBottom: "6px",
//                           }}
//                         >
//                           <Label>{label}</Label>
//                           <Data>{value}</Data>
//                         </div>
//                       ))}
//                     </CustomAccordion>
//                   ))}
//                 </CustomAccordion>
//               ))}
//             </div>
//           ))
//         ) : (
//           <p>Select an object on the map</p>
//         )}
//       </DataPanel>
//     </LaagDataContainer>
//   );
// }

//v2

import React, { useState, useEffect } from "react";
import { MapButton } from "../style_components/Buttons";
import { FaMapMarkedAlt } from "react-icons/fa";
import {
  LaagDataContainer,
  DataPanel,
  Label,
  Data,
  CustomAccordion,
  PanelTitle,
} from "../style_components/LaagDataStyle";
import { FieldRow } from "../style_components/FormStyles";

// Add optional tab styling
const TabsContainer = ({ children }) => (
  <div
    style={{
      display: "flex",
      borderBottom: "1px solid #444",
      marginBottom: "10px",
      overflowX: "auto",
    }}
  >
    {children}
  </div>
);

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      background: active ? "#284F97" : "transparent",
      color: active ? "white" : "#ccc",
      border: "none",
      borderBottom: active ? "2px solid #284F97" : "2px solid transparent",
      padding: "8px 14px",
      cursor: "pointer",
      fontWeight: active ? 600 : 400,
      transition: "all 0.15s ease",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </button>
);

const TECHNICAL_FIELDS = ["geometry", "layerName", "typeName", "__id", "__fid"];

const renderFeatureValue = (val) => {
  if (val === undefined || val === null) return "-";
  if (typeof val === "function") return "[Function]";
  if (typeof val === "object") {
    if (Array.isArray(val)) {
      return val.map((item, idx) => (
        <div key={idx}>{renderFeatureValue(item)}</div>
      ));
    } else {
      return (
        <div style={{ paddingLeft: "10px" }}>
          {Object.entries(val).map(([k, v]) => (
            <div key={k}>
              <strong>{k}:</strong> {renderFeatureValue(v)}
            </div>
          ))}
        </div>
      );
    }
  }
  return val;
};

export default function LaagData({
  selectedFeature, // array of { layer, features }
  isOpen,
  setActivePanel,
}) {
  const [featureData, setFeatureData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  const toggleData = () => {
    if (isOpen) setActivePanel(null);
    else setActivePanel("laagdata");
  };

  // Build structured data for each layer
  // useEffect(() => {
  //   if (!Array.isArray(selectedFeature) || selectedFeature.length === 0) {
  //     setFeatureData([]);
  //     return;
  //   }

  //   const processed = selectedFeature.map((res) => {
  //     const { layer, features } = res;
  //     const layerTitle =
  //       layer?.title || layer?.name || layer?.id || "Onbekende laag";

  //     const featureSections = features.map((feature) => {
  //       const props = feature.getProperties();
  //       const id = feature.getId?.() || props.identificatie || props.id || "-";

  //       const sections = [];

  //       Object.entries(props).forEach(([key, value]) => {
  //         if (TECHNICAL_FIELDS.includes(key)) return;

  //         if (value && typeof value === "object") {
  //           sections.push({
  //             title: key.charAt(0).toUpperCase() + key.slice(1),
  //             fields: Object.entries(value)
  //               .filter(([k]) => !TECHNICAL_FIELDS.includes(k))
  //               .map(([k, v]) => ({ label: k, value: renderFeatureValue(v) })),
  //           });
  //         } else {
  //           // 👇 Use feature ID or identification as section title
  //           const sectionTitle =
  //             id !== "-" ? `${layerTitle} ${id}` : layerTitle;

  //           let mainSection = sections.find((s) => s.title === sectionTitle);
  //           if (!mainSection) {
  //             mainSection = { title: sectionTitle, fields: [] };
  //             sections.push(mainSection);
  //           }

  //           mainSection.fields.push({
  //             label: key,
  //             value: renderFeatureValue(value),
  //           });
  //         }
  //       });

  //       return { id, sections };
  //     });

  //     return { layerTitle, featureSections };
  //   });

  //   setFeatureData(processed);
  //   setActiveTab(0); // reset to first tab on new selection
  // }, [selectedFeature]);

  useEffect(() => {
    if (!Array.isArray(selectedFeature) || selectedFeature.length === 0) {
      setFeatureData([]);
      return;
    }

    const processed = selectedFeature.map((res) => {
      const { layer, features } = res;
      const layerTitle =
        layer?.title || layer?.name || layer?.id || "Onbekende laag";

      const featureSections = features.map((feature, fi) => {
        const props = feature.getProperties();
        const id = feature.getId?.() || props.identificatie || props.id || "-";

        // pick a human-friendly property if available
        const displayName =
          props.naam || props.label || props.adres || props.identificatie || id;

        // truncate long names
        const shortName =
          displayName && displayName.length > 20
            ? displayName.slice(0, 18) + "…"
            : displayName;

        const sections = [];

        Object.entries(props).forEach(([key, value]) => {
          if (TECHNICAL_FIELDS.includes(key)) return;

          if (value && typeof value === "object") {
            sections.push({
              title: key.charAt(0).toUpperCase() + key.slice(1),
              fields: Object.entries(value)
                .filter(([k]) => !TECHNICAL_FIELDS.includes(k))
                .map(([k, v]) => ({ label: k, value: renderFeatureValue(v) })),
            });
          } else {
            // use the readable name for the section title
            const sectionTitle = `${layerTitle} (${shortName})`;

            let mainSection = sections.find((s) => s.title === sectionTitle);
            if (!mainSection) {
              mainSection = { title: sectionTitle, fields: [] };
              sections.push(mainSection);
            }

            mainSection.fields.push({
              label: key,
              value: renderFeatureValue(value),
            });
          }
        });

        return { id, sections };
      });

      return { layerTitle, featureSections };
    });

    setFeatureData(processed);
    setActiveTab(0); // reset to first tab on new selection
  }, [selectedFeature]);

  const activeLayer = featureData[activeTab];

  return (
    <LaagDataContainer>
      <MapButton
        icon={<FaMapMarkedAlt />}
        $active={isOpen}
        onClick={toggleData}
        hideText
        aria-expanded={isOpen}
        aria-controls="laagdata-panel"
        aria-label="Toggle laag data panel"
      >
        Layer data
      </MapButton>

      <DataPanel
        id="laagdata-panel"
        $isOpen={isOpen}
        role="region"
        aria-live="polite"
      >
        {featureData.length > 0 ? (
          <>
            {/* Tabs */}
            <TabsContainer>
              {featureData.map((group, idx) => (
                <TabButton
                  key={idx}
                  active={activeTab === idx}
                  onClick={() => setActiveTab(idx)}
                >
                  {group.layerTitle}
                </TabButton>
              ))}
            </TabsContainer>

            {activeLayer && (
              <>
                <PanelTitle>{activeLayer.layerTitle}</PanelTitle>

                {activeLayer.featureSections.map((feat, fi) => (
                  <div key={fi} style={{ marginBottom: "12px" }}>
                    {feat.sections.map((section, si) => (
                      <CustomAccordion
                        key={si}
                        title={section.title}
                        // First section of the first feature open, rest closed
                        defaultOpen={fi === 0 && si === 0}
                      >
                        {section.fields.map(({ label, value }, i) => (
                          <FieldRow
                            key={i}
                            $isLast={i === section.fields.length - 1}
                          >
                            <Label>{label}</Label>
                            <Data
                              style={{
                                textAlign: "right",
                                wordBreak: "break-word",
                              }}
                            >
                              {value}
                            </Data>
                          </FieldRow>
                        ))}
                      </CustomAccordion>
                    ))}
                  </div>
                ))}
              </>
            )}
          </>
        ) : (
          <p>Select an object on the map</p>
        )}
      </DataPanel>
    </LaagDataContainer>
  );
}
