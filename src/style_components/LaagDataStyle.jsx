// LaagDataStyle.jsx
import styled from "styled-components";
import Accordion from "./Accordion";

export const LaagDataContainer = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 995;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const DataPanel = styled.div`
  max-height: ${({ $isOpen }) => ($isOpen ? '550px' : '0')};
  overflow-y: auto;
  background-color: white;
  margin-top: 10px;
  border-radius: 10px;
  width: 600px;
  padding: ${({ $isOpen }) => ($isOpen ? '20px' : '0')};
  box-shadow: ${({ $isOpen }) => ($isOpen ? '0px 4px 4px rgba(0, 0, 0, 0.25)' : '0')};
  transition: max-height 0.2s ease, padding 0.2s ease;
`;

export const PanelTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 20px;
`;

export const Label = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
`;

export const Data = styled.div`
  font-size: 0.95rem;
  word-break: break-word;
  
  a {
    color: #284F97;
    text-decoration: underline;
  }
`;

export const CustomAccordion = styled(Accordion)`
  /* Override the title and hide the icon */
  button {
    background: transparent !important;
    padding: 8px 0 !important;
    color: #333 !important;
    font-weight: 600 !important;
    font-size: 1.05rem !important;
    box-shadow: none !important;
    border: none !important;
  }

  svg:last-child { /* This targets the chevron icon */
    display: none;
  }

  /* Optional: remove folder icon too */
  svg:first-child {
    display: none;
  }

  /* Optional: tweak paragraph spacing */
  p {
    margin: 0;
  }

  /* Override content styling if needed */
  div[role="region"] {
    padding: 0 !important;
    background: none !important;
  }
`;
