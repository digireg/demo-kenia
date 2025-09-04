import React, { useEffect, useRef, useState } from 'react';
import { FiEye } from 'react-icons/fi';
import {
  TransparantieLaagContainer,
  TransparantieLaagPanel,
  FilterInput,
  NoResults
} from "../style_componets/TransparantieLaagContainerStyle";
import OpacitySlider from '../style_componets/Slider';
import { flattenDataLayers } from './flattenDataLayers';


export default function TransparantieLaagSelect({ isOpen, setActivePanel, dataLayers, setLayerOpacity }) {
  const panelRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter layers based on search query and active state (only active layers shown)
  const flattenedLayers = flattenDataLayers(dataLayers);
const filteredLayers = flattenedLayers.filter(layer =>
  layer.label.toLowerCase().includes(searchQuery.toLowerCase())
);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setActivePanel(null);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setActivePanel]);

  return (
    <TransparantieLaagContainer>
      <TransparantieLaagPanel ref={panelRef} $isOpen={isOpen}>
        <header style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          justifyContent: 'flex-start',
          position: 'sticky',
          top: '0',
          backgroundColor: '#ffffff',
          paddingTop: '20px',
          paddingBottom: '20px',
          zIndex: '2'
        }}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '5px', alignItems: 'center' }}>
            <FiEye style={{ fontSize: '20px' }} />
            <h1>Layer opacity</h1>
          </div>

          {/* Filter input */}
          <FilterInput
            id='filterTransparatieLagen'
            type="text"
            placeholder="Filter layers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </header>

        {/* Show sliders for active filtered layers */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
        {filteredLayers.length > 0 ? (
          filteredLayers.map(({ groupId, layerId, label }) => {
            const layer = dataLayers
              .find(g => g.id === groupId)
              ?.children.find(l => l.id === layerId);

            if (!layer || !layer.active) return null;

            return (
              <OpacitySlider
                key={`${groupId}:${layerId}`}
                label={label}
                value={layer.opacity}
                onChange={(newOpacity) => setLayerOpacity(groupId, layerId, newOpacity)}
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