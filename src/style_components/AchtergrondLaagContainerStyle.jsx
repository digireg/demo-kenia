import styled, { css } from 'styled-components';

// Container for the entire background layer selector panel
export const AchtergrondLaagContainer = styled.div`
  position: absolute;     // position panel absolutely on the page
  top: 80px;              // distance from top
  left: 90px;             // distance from left
  z-index: 999;           // layer above most other UI elements
  display: flex;          // flex container for layout
  box-sizing: border-box; // include padding/border in size calculations
  border-radius: 10px;    // rounded corners
  align-items: flex-end;  // align items at bottom vertically
  justify-content: center; // center items horizontally

  // Visual focus & hover states for accessibility & UX
  &:focus,
  &:focus-visible,
  &:hover,
  &:active {
    border-color: #284F97;
    outline: none;
  }
`;

// The panel that expands/collapses with background layer options
export const AchtergrondLaagPanel = styled.div`
  max-height: ${({ $isOpen }) => ($isOpen ? '575px' : '0')}; // collapses or expands panel height
  height: fit-content;   // height adapts to content size
  overflow-y: ${({ $isOpen }) => ($isOpen ? 'auto' : 'hidden')}; // show scrollbar only when open
  background-color: white; // panel background color
  border-radius: 10px;    // rounded corners matching container
  max-width: 538px;       // max width constraint
  display: flex;          // flexbox layout
  flex-direction: column; // stack children vertically
  gap: 20px;              // spacing between children
  min-width: 370px;       // minimum width constraint
  width: fit-content;           // fixed width (adjust as needed)
  padding: ${({ $isOpen }) => ($isOpen ? '20px' : '0')}; // padding only when open
  box-shadow: ${({ $isOpen }) => ($isOpen ? '0px 4px 4px rgba(0, 0, 0, 0.25)' : '0')}; // shadow when open
  transition: padding 0.1s ease, max-height 0.1s ease, max-width 0.1s ease; // smooth transition on open/close
`;

// Header inside the panel, typically for titles or controls
export const PanelHeader = styled.header`
  display: flex;          // flex row for layout
  flex-direction: row;    // horizontal stacking
  gap: 5px;               // small gap between items
  align-items: center;    // vertically center items
`;

// Container grid for showing preview tiles of background layers
export const PreviewGrid = styled.div`
  display: flex;          // flexbox container
  flex-direction: row;    // horizontal flow
  flex-wrap: wrap;        // allow wrapping to multiple rows
  ${'' /* justify-content: space-between; // space tiles evenly horizontally */}
  gap: 40px;              // large gap between tiles
  width: fit-content;     // shrink to fit content width
`;

// Individual preview tile for one background layer option
export const PreviewTile = styled.div`
  position: relative;                        /* Needed so ::before overlay is positioned relative */
  display: flex;                             /* Vertical stack */
  flex-direction: column;
  gap: 10px;                                 /* Space between thumbnail and label */
  width: fit-content;
  max-width: 150px;
  height: fit-content;
  padding: 10px 15px;                        /* Inner spacing */
  border-radius: 5px;                        /* Rounded corners */
  border: 1px solid ${({ $active }) => ($active ? '#284F97' : '#E0E0E0')};  /* Active border or default */
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: border-color 0.2s;             /* Smooth border transition */

  /* Hover effect: only if tile is NOT active */
  &:hover {
    ${({ $active }) =>
      !$active &&
      css`
        border-color: #aab9dc;               /* Lighter border on hover */
      `}
  }

  /* Semi-transparent overlay across entire tile on hover (only if NOT active) */
  &:hover::before {
    ${({ $active }) =>
      !$active &&
      css`
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 5px;                  /* Match parent radius */
        background-color: rgba(170, 185, 220, 0.25);  /* 25% overlay */
        pointer-events: none;                 /* Let clicks pass through */
        z-index: 1;                           /* Place under content, above background */
      `}
  }

  /* Ensure children always appear above the overlay */
  & > * {
    position: relative;
    z-index: 2;
  }
`;

// The thumbnail box inside each preview tile, e.g. a small color or image preview
export const TileThumbnail = styled.div`
  height: 75px;           // fixed height for thumbnail
  width: 100px;           // fixed width for thumbnail
  background-color: #f5f5f5; // light grey background as placeholder
  border-radius: 3px;     // slightly rounded corners
`;
