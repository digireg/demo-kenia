import React from 'react';
import styled from 'styled-components';

const SliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;

  &:not(:last-child) {
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 30px;
    margin-bottom: 30px;
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const NumberInput = styled.input`
  width: 50px;
  text-align: right;
`;

const Slider = styled.input.attrs({ type: 'range' })`
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: ${({ value }) =>
    `linear-gradient(to right, #284f97 0%, #284f97 ${value}%, #f0f4fa ${value}%, #f0f4fa 100%)`};
  outline: none;
  margin: 0;
  padding: 0;
  cursor: pointer;
  box-sizing: border-box;
  transition: background 0.3s ease;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #284f97;
    border: none;
    transition: background 0.2s ease;
    position: relative;
    top: 50%;
    transform: translateY(var(--thumb-offset));
  }

  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #284f97;
    border: none;
    transition: background 0.2s ease;
    position: relative;
    top: 50%;
    transform: translateY(var(--thumb-offset));
  }

  &:hover::-webkit-slider-thumb {
    background: #1f3f7c;
  }

  &::-moz-range-track {
    background: transparent;
  }
  &::-moz-range-progress {
    background: #284f97;
    height: 4px;
    border-radius: 2px;
  }

  &:hover::-moz-range-thumb {
    background: #1f3f7c;
  }
`;

export default function OpacitySlider({ label = 'Layer Transparency', value = 100, onChange }) {
  // Handle slider change event and notify parent with new value
  const handleSliderChange = (e) => {
    const newValue = Number(e.target.value);
    onChange?.(newValue);
  };

  // Handle number input change and validate the value before notifying parent
  const handleInputChange = (e) => {
    let newValue = Number(e.target.value);
    if (isNaN(newValue)) return;
    if (newValue > 100) newValue = 100;
    if (newValue < 0) newValue = 0;
    onChange?.(newValue);
  };

  return (
    <SliderWrapper>
      <TopRow>
        <Label>{label}</Label>
        <InputGroup>
          <NumberInput
            type="number"
            min="0"
            max="100"
            value={value}
            onChange={handleInputChange}
          />
          <span>%</span>
        </InputGroup>
      </TopRow>
      <Slider value={value} onChange={handleSliderChange} />
    </SliderWrapper>
  );
}