import styled from 'styled-components';
export { MapContainer } from './MapStyle';
export { SideMenu } from './SidebarMenuStyle'

export const Layout = styled.div`
  ${'' /* display: grid; */}
   /* grid-template-columns: 70px 1fr; */  
  /* sidebar fixed width, map takes the rest */ 
   /* grid-template-areas: "sidebar map"; */
  position: relative;
  height: 100vh;
  width: 100%;

`