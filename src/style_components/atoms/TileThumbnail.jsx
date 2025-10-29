import styled from "styled-components";
import { tokens, components } from "../themes/light";

export const TileThumbnail = styled.div`
  height: 75px;
  width: 100px;
  background-color: ${tokens.colors.grays[100]};
  border-radius: ${tokens.radii[2]};
`;
