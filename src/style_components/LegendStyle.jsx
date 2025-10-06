import styled from "styled-components";

/**
 * Container for the legend toggle button and panel
 */
export const LegendButtonContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 90px;
  z-index: 995;
  display: flex;
  flex-direction: column;
`;

/**
 * Collapsible legend panel
 * - $isOpen controls visibility and max height
 * - Smooth transition for opening/closing
 */
export const LegendaPanel = styled.div`
  max-height: ${({ $isOpen }) => ($isOpen ? '300px' : '0')};
  overflow-y: ${({ $isOpen }) => ($isOpen ? 'auto' : 'hidden')};
  background-color: white;
  margin-top: 10px;
  border-radius: 10px;
  width: 600px; /* adjust width as needed */
  padding: ${({ $isOpen }) => ($isOpen ? '20px' : '0')};
  box-shadow: ${({ $isOpen }) => ($isOpen ? '0px 4px 4px rgba(0, 0, 0, 0.25)' : '0')};
  transition: padding 0.3s ease, max-height 0.3s ease, max-width 0.3s ease;
`;
