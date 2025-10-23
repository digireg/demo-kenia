import styled from "styled-components";
import { Container } from "../atoms/Container";

// Top-left panels
export const AchtergrondLaagContainer = styled(Container).attrs({
  $focusable: true,
  $align: "flex-end",
  $justify: "center",
  $radius: "10px",
  $zIndex: 999,
})`
  top: 80px;
  left: 90px;
`;

export const DataLaagSelectContainer = styled(Container).attrs({
  $focusable: true,
  $align: "center",
  $justify: "center",
  $radius: "10px",
  $zIndex: 999,
})`
  top: 80px;
  left: 90px;
`;

export const MeasurementContainer = styled(Container).attrs({
  $focusable: true,
  $align: "flex-end",
  $justify: "center",
  $radius: "10px",
  $zIndex: 999,
})`
  top: 80px;
  left: 90px;
`;

export const TransparantieLaagContainer = styled(Container).attrs({
  $focusable: true,
  $align: "flex-end",
  $justify: "center",
  $radius: "10px",
  $zIndex: 999,
})`
  top: 80px;
  left: 90px;
`;

//Top-right
export const ZoomControlContainer = styled(Container).attrs({
  $focusable: true,
  $align: "center",
  $justify: "center",
  $radius: "10px",
  $zIndex: 995,
})`
  top: 20px;
  right: 20px;
  flex-direction: column;
  gap: 0;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

// Bottom-right
export const LaagDataContainer = styled(Container).attrs({
  $align: "flex-end",
  $justify: "flex-end",
  $radius: "0px",
  $zIndex: 995,
})`
  bottom: 20px;
  right: 20px;
  flex-direction: column;
`;

// Bottom-left
export const LegendButtonContainer = styled(Container).attrs({
  $align: "flex-start",
  $justify: "flex-start",
  $radius: "0px",
  $zIndex: 995,
})`
  bottom: 20px;
  left: 90px;
  flex-direction: column;
`;
