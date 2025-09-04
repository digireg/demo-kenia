import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.5);
  z-index: 999;
  opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  transition: opacity 0.3s ease;
`;

export const Drawer = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 250px;
  height: 100vh;
  background-color: white;
  box-shadow: 2px 0 10px rgba(0,0,0,0.2);
  transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
  transition: transform 0.3s ease;
  z-index: 1000;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const CloseButton = styled.button`
  ${'' /* align-self: flex-end; */}
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #444;

  &:hover {
    color: #000;
  }
`;

export const OverlayMenuHeader= styled.div`
  display: flex;
  flex-direction: row;
  gap: 0px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #d9d9d9;
  padding-bottom:20px;
`

export const OverlayMenuToolsContainer= styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
  border-bottom: 1px solid #d9d9d9;
  padding-bottom:20px;
`

export const OverlayMenuUtilsContainer= styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
  border-bottom: 1px solid #d9d9d9;
  padding-bottom:20px;
`

export const OverlayMenuSettingsContainer= styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
  border-bottom: 1px solid #d9d9d9;
  padding-bottom:20px;
`

export const OverlayMenuDashboardContainer= styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
`