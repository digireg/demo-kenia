//v2

import React, { useState, useEffect } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import {
  MapButton,
  LaagDataContainer,
  DataPanel,
  Label,
  Data,
  CustomAccordion,
  PanelTitle,
  FieldRow,
} from "../style_components";
import { tokens, components } from "../style_components/themes/light";

// Add optional tab styling
const TabsContainer = ({ children }) => (
  <div
    style={{
      display: "flex",
      borderBottom: `1px solid ${tokens.colors.Company.Secondary}`,
      marginBottom: "10px",
      // overflowX: "auto",
      height: "fit-content",
    }}
  >
    {children}
  </div>
);

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      background: active ? tokens.colors.Company.Primary : "transparent",
      color: active ? "white" : "#ccc",
      border: "none",
      borderBottom: active
        ? `2px solid tokens.colors.Company.Primary`
        : "2px solid transparent",
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
    <LaagDataContainer className={isOpen ? "active" : null}>
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
        style={{
          display: isOpen ? "block" : "none",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateY(0)" : "translateY(120%)",
          transition: "transform 0.3s ease, opacity 0.3s ease",
        }}
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
