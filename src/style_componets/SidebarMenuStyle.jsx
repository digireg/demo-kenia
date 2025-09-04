import styled from 'styled-components';

export const SideMenu = styled.aside`
  background-color: #ffffff;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 70px;
  padding: 30px 10px;
  align-items: center;
  z-index: 10;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

`;

export const SideBarIconContainer = styled.div`
  border-bottom: 1px solid #284F97;
  padding: 0 0 20px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const SideBarMenuIconContainer = styled.div`
  padding: 20px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  align-items: center;
`;