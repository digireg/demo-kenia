import styled from "styled-components";

export const DataLaagSelectContainer = styled.div`
  position: absolute;
  top: 80px;
  left: 90px;
  z-index: 999;
  display: flex;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  &:focus,
  &:focus-visible,
  &:hover,
  &:active {
    border-color: #284F97;
    outline: none;
  }
`;

export const DataLaagSelectPanel = styled.div`
  max-height: ${({ $isOpen }) => ($isOpen ? '575px' : '0')};
  height: fit-content;
  background-color: white;
  border-radius: 10px;
  max-width: 550px;
  width: 550px;
  padding: ${({ $isOpen }) => ($isOpen ? '0 20px' : '0')};
  box-shadow: ${({ $isOpen }) => ($isOpen ? '0px 4px 4px rgba(0, 0, 0, 0.25)' : '0')};
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden; /* hide scroll when closed */

  #dataContent {
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(0,0,0,0.3);
      border-radius: 4px;
    }

    scrollbar-width: thin;
    scrollbar-color: rgba(0,0,0,0.3) transparent;
  }
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: sticky;
  top: 0;
  background-color: #ffffff;
  padding: 20px 0;
  z-index: 1; /* stay above scrolling content */
`;

export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  h1 {
    ${'' /* font-size: 1.75rem; */}
    margin: 0;
  }
`;

export const SwitchGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  span {
    font-size: 12px;
    font-weight: 600;
  }
`;

export const FilterInput = styled.input`
  width: 100%;
  padding: 6px 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
`;

export const BottomSpacer = styled.div`
  height: 20px;
`;

export const NoResults = styled.div`
  padding: 10px;
  color: #999;
  font-size: 14px;
  text-align: left;
`;