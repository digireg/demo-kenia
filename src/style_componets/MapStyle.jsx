import styled, { keyframes } from 'styled-components';

export const MapContainer = styled.main`
  ${'' /* grid-area: map; */}
  width: 100%;
  height: 100%;
`
export const MapStyleContainer = styled.main`
  ${'' /* grid-area: map; */}
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5; /* or any light color */

`

export const FloatingSearch = styled.div`
  position: absolute;
  top: 20px;
  left: 90px;
  z-index: 998;
  border-radius: 4px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);


  form {
    display: flex;
    align-items: center;
  }

  &:hover input,
  &:hover button,
  &:focus-within input,
  &:focus-within button {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }

  input {
    box-sizing: border-box;
    padding: 10px 15px;
    font-size: 16px;
    line-height: 1;
    width: 400px;
    border: 1px solid transparent;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    transition: border-color 0.3s ease;

    &:focus,
    &:focus-visible,
    &:hover,
    &:active {
      border-color: transparent;
      outline: none;
    }

    &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px white inset !important;
    -webkit-text-fill-color: #000 !important;
    }
  }

  button {
    appearance: none;
    vertical-align: middle;
    box-sizing: border-box;
    padding: 10px 15px;
    font-size: 16px;
    line-height: 1;
    border: 1px solid transparent;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    transition: border-color 0.3s ease;
    background-color: #ffffff;
    cursor: pointer;



    &:active {
      border-color: #284F97;
      background-color: #284F97;
      color: #ffffff;
      outline: none;
    }

  &:hover{
      border-color: transparent;
      background-color: #aab9dc;
      color: #ffffff;
  }

  }
`;


// Fade/slide-down animatie
const fadeSlideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const SearchWrapper = styled.div`
  position: relative;
  width: fit-content;
`;

// Laadanimatie
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(40, 79, 151, 0.3);
  border-top-color: #284f97;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin-left: 8px;
`;

export const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  margin: 0;
  padding: 0;
  list-style: none;
  animation: ${fadeSlideDown} 0.15s ease;
`;

export const SuggestionItem = styled.li`
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.15s ease;
  background-color: ${({ $isHighlighted }) => ($isHighlighted ? '#f0f4fa' : 'transparent')};

  &:hover {
    background-color: #f0f4fa;
  }
`;

