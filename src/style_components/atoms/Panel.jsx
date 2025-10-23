import styled from "styled-components";

export const Panel = styled.div`
  max-height: ${({ $isOpen, $maxHeight }) =>
    $isOpen ? $maxHeight || "500px" : "0"};
  height: fit-content;
  overflow-y: ${({ $isOpen }) => ($isOpen ? "auto" : "hidden")};
  background-color: white;
  border-radius: ${({ $radius }) => $radius || "10px"};
  width: ${({ $width }) => $width || "fit-content"};
  ${"" /* max-width: ${({ $maxWidth }) => $maxWidth || "fit-content"}; */}
  min-width: ${({ $minWidth }) => $minWidth || "0"};
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => $gap || "20px"};
  padding: ${({ $isOpen, $padding }) => ($isOpen ? $padding || "20px" : "0")};
  box-shadow: ${({ $isOpen, $shadow }) =>
    $isOpen ? $shadow || "0px 4px 4px rgba(0, 0, 0, 0.25)" : "0"};
  ${
    "" /* transition: ${({ $transition }) =>
    $transition ||
    "padding 0.2s ease, max-height 0.2s ease, max-width 0.2s ease"}; */
  }

  /* Optional scrollable content container (like DataLaagSelectPanel) */
  #dataContent {
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
    }
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
  }
`;
