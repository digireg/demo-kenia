import React, { useEffect, useRef, useState } from "react";
import { FiEye } from "react-icons/fi";
import {
  TransparantieLaagContainer,
  TransparantieLaagPanel,
  TextInput,
  NoResults,
  OpacitySlider,
} from "../style_components";
import { flattenDataLayers } from "./flattenDataLayers";

export default function TransparantieLaagSelect({
  isOpen,
  setActivePanel,
  dataLayers,
  setLayerOpacity,
}) {
  const panelRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  const flattenedLayers = flattenDataLayers(dataLayers);

  const filteredLayers = flattenedLayers.filter(
    (layer) =>
      (layer.label || "").toLowerCase().includes(searchQuery.toLowerCase()) &&
      layer.active
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setActivePanel(null);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setActivePanel]);

  return (
    <TransparantieLaagContainer>
      <TransparantieLaagPanel ref={panelRef} $isOpen={isOpen}>
        <header
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            justifyContent: "flex-start",
            position: "sticky",
            top: "0",
            backgroundColor: "#ffffff",
            paddingTop: "20px",
            paddingBottom: "20px",
            zIndex: "2",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "5px",
              alignItems: "center",
            }}
          >
            <FiEye style={{ fontSize: "20px" }} />
            <h1>Layer opacity</h1>
          </div>
          <TextInput
            id="filterTransparatieLagen"
            type="text"
            placeholder="Filter layers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </header>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {filteredLayers.length > 0 ? (
            filteredLayers.map(({ groupId, id, label, key }) => {
              const group = dataLayers.find((g) => g.id === groupId);
              if (!group) return null;

              const layer = group.children.find((l) => l.id === id);
              if (!layer) return null;

              return (
                <OpacitySlider
                  key={key} // ✅ guaranteed unique
                  label={label || layer.title || "Unnamed Layer"}
                  value={layer.opacity}
                  onChange={(newOpacity) =>
                    setLayerOpacity(groupId, layer.id, newOpacity)
                  }
                />
              );
            })
          ) : (
            <NoResults>No layers found.</NoResults>
          )}
        </div>
      </TransparantieLaagPanel>
    </TransparantieLaagContainer>
  );
}
