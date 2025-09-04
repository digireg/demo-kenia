import React, { useState } from 'react';
import { MapButton } from "../style_componets/Buttons"; // Styled button component
import { MdLegendToggle } from "react-icons/md"; // Icon for legend toggle
import { LegendButtonContainer, LegendaPanel } from "../style_componets/LegendStyle"; // Legend container styles
import Accordion from '../style_componets/Accordion'; // Accordion component for grouped layers

/**
 * Legend component
 * Shows a toggleable panel of active layers with their legend symbols
 * @param {Array} activeLayers - Array of active layers from useMapLayers
 */
export default function Legend({ activeLayers = [] }) {
  // State: whether the legend panel is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // Toggle visibility of the legend panel
  const toggleLegenda = () => setIsOpen(prev => !prev);

  // Total count of active layers (used in button)
  const totalCount = activeLayers.length;

  // Group layers by their groupTitle
  const groupedLayers = activeLayers.reduce((acc, layer) => {
    const groupTitle = layer.groupTitle|| "MombasaData"; // no fallback
    if (!groupTitle) return acc; // skip layers without a groupTitle
    if (!acc[groupTitle]) acc[groupTitle] = [];
    acc[groupTitle].push(layer);
    return acc;
  }, {});

  return (
    <LegendButtonContainer>
      {/* Button to toggle legend */}
      <MapButton
        icon={<MdLegendToggle />}
        $active={isOpen}
        onClick={toggleLegenda}
        aria-expanded={isOpen}
        aria-controls="legend-panel"
      >
        Legend ({totalCount})
      </MapButton>

      {/* Collapsible legend panel */}
      <LegendaPanel $isOpen={isOpen} id="legend-panel" role="region" aria-hidden={!isOpen}>
        {Object.keys(groupedLayers).length > 0 ? (
          Object.entries(groupedLayers).map(([groupTitle, layers]) => (
            <Accordion key={groupTitle} title={groupTitle} count={layers.length}>
              {layers.map(layer => (
                <div
                  key={layer.id}
                  style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}
                >
                  {/* Display legend image if available, else display layer name in placeholder */}
                  {layer.legendUrl ? (
                    <img
                      src={layer.legendUrl}
                      alt={layer.name}
                      style={{ width: 'auto', height: 'auto', marginRight: 6 }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        marginRight: 6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        textAlign: 'center',
                        backgroundColor: '#eee',
                        borderRadius: 4,
                      }}
                    >
                      {layer.name}
                    </div>
                  )}
                </div>
              ))}
            </Accordion>
          ))
        ) : (
          <div>
            <p><em>No legend available</em></p>
          </div>
        )}
      </LegendaPanel>
    </LegendButtonContainer>
  );
}
