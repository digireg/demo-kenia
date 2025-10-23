import styled, { css } from "styled-components";
import { tokens, components } from "../themes/light";

export const PreviewTile = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[3]};
  width: 100%;
  max-width: 150px;
  height: auto;
  padding: ${tokens.space[3]};
  border-radius: 5px;
  border: 1px solid
    ${({ $active }) =>
      $active ? tokens.colors.Company.Primary : tokens.colors.grays[300]};
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    ${({ $active }) =>
      !$active &&
      css`
        border-color: ${tokens.colors.Company.PrimaryLight};
      `}
  }

  &:hover::before {
    ${({ $active }) =>
      !$active &&
      css`
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 5px;
        background-color: ${tokens.colors.Company.PrimaryLight};
        pointer-events: none;
        z-index: 1;
      `}
  }

  & > * {
    position: relative;
    z-index: 2;
  }
`;
