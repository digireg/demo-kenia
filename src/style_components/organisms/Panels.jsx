import styled from "styled-components";
import { Panel } from "../atoms/Panel";

export const AchtergrondLaagPanel = styled(Panel).attrs({
  $maxHeight: "575px",
  //   $maxWidth: "550px",
  //   $minWidth: "400px",
  $width: "510px",
  $padding: "20px",
})``;

export const DataPanel = styled(Panel).attrs({
  $maxHeight: "550px",
  $width: "600px",
  $padding: "20px",
  $gap: "0", // optional if no internal gap
})`
  margin-top: 10px;
`;

export const DataLaagSelectPanel = styled(Panel).attrs({
  $maxHeight: "575px",
  $width: "510px",
  $padding: "20px",
})`
  overflow: hidden;
`;

export const MeasurementPanel = styled(Panel).attrs({
  $maxHeight: "575px",
  $width: "510px",
  $padding: "20px",
})``;

export const LegendaPanel = styled(Panel).attrs({
  $maxHeight: "300px",
  $width: "450px",
  $padding: "20px",
  $transition: "padding 0.3s ease, max-height 0.3s ease, max-width 0.3s ease",
})`
  margin-top: 10px;
`;

export const TransparantieLaagPanel = styled(Panel).attrs({
  $maxHeight: "575px",
  $width: "510px",
  $minWidth: "450px",
  $padding: "20px 20px 40px",
})``;
