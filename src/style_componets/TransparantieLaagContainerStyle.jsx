import styled from "styled-components"


export const TransparantieLaagContainer = styled.div`
    position: absolute;
    top: 80px;
    left: 90px;
    z-index: 999;
    display: flex;
    box-sizing: border-box;
    border-radius:10px;
    align-items: flex-end;
    justify-content:center;

    &:focus,
    &:focus-visible,
    &:hover,
    &:active {
      border-color: #284F97;
      outline: none;
    }
    `

    export const TransparantieLaagPanel = styled.div`
  max-height: ${({ $isOpen }) => ($isOpen ? '575px' : '0')};
  height:fit-content;
  
  overflow-y: auto;
  background-color: white;
  border-radius: 10px;
  max-width: 550px;
  display:flex;
  flex-direction: column;
  gap:20px;
  min-width:370px;
  width: 550px; /* or whatever fits your design */
  padding: ${({ $isOpen }) => ($isOpen ? '20px 20px 40px' : '0')};
  box-shadow: ${({ $isOpen }) => ($isOpen ? '0px 4px 4px rgba(0, 0, 0, 0.25)' : '0')};
`;

export const FilterInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #284F97;
  }
`;

export const NoResults = styled.div`
  padding: 10px;
  color: #999;
  font-size: 14px;
  text-align: center;
`;