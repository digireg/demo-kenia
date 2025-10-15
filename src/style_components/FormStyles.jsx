import React from "react";
import styled from "styled-components";

const SwitchLabel = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #284f97;
  }

  &:checked + span::before {
    transform: translateX(15px);
  }

  &:disabled + span {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Slider = styled.span`
  position: relative;
  width: 26px;
  height: 14px;
  background-color: #ccc;
  border-radius: 34px;
  transition: background-color 0.4s;

  &::before {
    content: "";
    position: absolute;
    height: 14px;
    width: 14px;
    left: 0;
    bottom: 0;
    background-color: white;
    border-radius: 50%;
    border: 1px solid #f5f5f5
    transition: transform 0.4s;
  }
`;

export function Switch({ checked, onChange, disabled /*, label */ }) {
  return (
    <SwitchLabel>
      {/* {label && <span>{label}</span>} */}
      <HiddenCheckbox
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        id="activeLayers"
      />
      <Slider />
    </SwitchLabel>
  );
}

/*------------------------------------------------------------------------------------------------------------------------*/

export const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  column-gap: 150px;
  align-items: start;
  border-bottom: ${(props) => (props.$isLast ? "none" : "1px solid #a3a3a3ff")};
  padding: 15px 10px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #aab9dc; // subtle light gray on hover
    color: #fff;
    border-bottom: ${(props) => (props.$isLast ? "none" : "1px solid #aab9dc")};
  }
`;
