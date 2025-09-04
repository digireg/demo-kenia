import React, { useEffect, useRef, useState } from "react";
import { FiLayers } from "react-icons/fi";
import { Switch } from "../style_componets/FormStyles";
import Accordion from "../style_componets/Accordion";

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
} from "../style_componets/DataLaagSelectContainerStyle";

/**
 * DataLaagSelect
 * - Supports nested children recursively.
 * - Nested children only visible when parent is active.
 * - First nested child can be selected by default.
 * - Checkboxes/radio buttons remain clickable.
 */
export default function DataLaagSelect({
  isOpen,
  setActivePanel,
  dataLayers,
  setLayerActive,
}) {
  const panelRef = useRef(null);
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");

  const safeDataLayers = Array.isArray(dataLayers) ? dataLayers : [];

  // ----------------------------
  // Filter groups/children safely
  // ----------------------------
  const filteredDataLayers = safeDataLayers
    .map((group) => {
      const filteredChildren = showOnlyActive
        ? group.children.filter((child) => child.active)
        : group.children.filter(
            (child) =>
              child.name &&
              child.name.toLowerCase().includes(filterQuery.toLowerCase())
          );

      const groupTitleMatches =
        group.title &&
        group.title.toLowerCase().includes(filterQuery.toLowerCase());

      if (showOnlyActive) {
        if (filteredChildren.length > 0)
          return { ...group, children: filteredChildren };
        return null;
      } else {
        if (groupTitleMatches || filteredChildren.length > 0) {
          return {
            ...group,
            children: groupTitleMatches ? group.children : filteredChildren,
          };
        }
        return null;
      }
    })
    .filter(Boolean);

  // ----------------------------
  // Close panel on outside click
  // ----------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setActivePanel(null);
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setActivePanel]);

  // ----------------------------
  // Toggle layer active state
  // ----------------------------
  const onToggleLayer = (groupId, layerId, inputType) => {
    setLayerActive(groupId, layerId, inputType);
  };

  // ----------------------------
  // Recursive rendering of layers
  // - parentId is passed down so radio `name` is unique per parent
  // ----------------------------
  const renderLayer = (
    layer,
    groupId,
    groupIndex,
    level = 0,
    parentId = null
  ) => {
    const inputId = `layer-${groupId}-${layer.id}-${groupIndex}-${level}`;
    const radioName =
      layer.inputType === "radio" ? `${groupId}-${parentId}` : undefined;

    return (
      <div
        key={inputId}
        style={{ marginLeft: level * 16, marginBottom: "6px" }}
      >
        <label
          htmlFor={inputId}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
          }}
        >
          <input
            id={inputId}
            type={layer.inputType || "checkbox"}
            name={radioName}
            checked={!!layer.active}
            onChange={() => onToggleLayer(groupId, layer.id, layer.inputType)}
          />
          {layer.title}
        </label>

        {/* Render children only when parent is active */}
        {layer.active &&
          layer.children &&
          layer.children.length > 0 &&
          layer.children
            .filter((child) => {
              if (child.inputType !== "radio") return true; // always show checkboxes
              // show radios only if 2 or more exist
              const radios = layer.children.filter(
                (c) => c.inputType === "radio"
              );
              return radios.length > 1;
            })
            .map((child) =>
              renderLayer(child, groupId, groupIndex, level + 1, layer.id)
            )}
      </div>
    );
  };

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
            id="DataLaagFilter"
            type="text"
            placeholder="Filter layers..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
          />
        </Header>

        <Content>
          {filteredDataLayers.length > 0 ? (
            filteredDataLayers.map((group, groupIndex) => {
              // count only visible layers
              const visibleCount = group.children.filter((child) => {
                if (child.inputType !== "radio") return true;
                const radios = group.children.filter(
                  (c) => c.inputType === "radio"
                );
                return radios.length > 1; // only show if there are 2 or more radios
              }).length;

              return (
                <Accordion
                  key={group.id}
                  title={group.title}
                  count={visibleCount}
                  startIcon={FiLayers}
                >
                  {group.children.map((layer) =>
                    renderLayer(layer, group.id, groupIndex)
                  )}
                </Accordion>
              );
            })
          ) : (
            <NoResults>No results found.</NoResults>
          )}
        </Content>

        <BottomSpacer />
      </DataLaagSelectPanel>
    </DataLaagSelectContainer>
  );
}
