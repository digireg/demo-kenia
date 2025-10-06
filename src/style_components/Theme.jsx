import styled from "styled-components";
import logoSrc from '../assets/digireg-seeklogo.png'; // adjust path

const StyledLogo = styled.img`
  width: 140px;       /* or any size that fits nicely */
  height: auto;
  object-fit: contain;
  display: block;
`;

export function Logo(props) {
  return <StyledLogo src={logoSrc} alt="Digireg logo" {...props} />;
}

