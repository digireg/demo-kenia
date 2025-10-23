import styled from "styled-components";
import logoSrc from "../assets/digireg-seeklogo.png"; // adjust path

const StyledLogo = styled.img`
  width: 140px; /* or any size that fits nicely */
  height: auto;
  object-fit: contain;
  display: block;
`;

export function Logo(props) {
  return <StyledLogo src={logoSrc} alt="Digireg logo" {...props} />;
}

export const theme = {
  colors: {
    primary: "#0077ff",
    secondary: "#ff5500",
    background: "#f5f5f5",
    text: "#333",
  },
  spacing: {
    small: "8px",
    medium: "16px",
    large: "32px",
  },
  borderRadius: "8px",
};
