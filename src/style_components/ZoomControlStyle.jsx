import styled from "styled-components";

export const ZoomControlContainer = styled.div`
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 995;
    display: flex;
    flex-direction: column;
    gap:0;
    box-sizing: border-box;
    border-radius:10px;
    align-items: center;
    justify-content:center;

    &:focus,
    &:focus-visible,
    &:hover,
    &:active {
      border-color: #284F97;
      outline: none;
    }



`

export const ZoomInButton =styled.button`
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding:10px;
    max-width:50px;
    max-height:50px;
    font-size: 16px;
    line-height: 1;
    border: 1px solid transparent;
    cursor: pointer;


    &:hover {
      border-color: #aab9dc;
      background-color: #aab9dc;
      color: #ffffff;
      outline: none;
    }

`

export const ZoomOutButton =styled.button`
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    padding:10px;
    max-width:50px;
    max-height:50px;
    font-size: 16px;
    line-height: 1;
    border: 1px solid transparent;
    cursor: pointer;
    color:#000000;


    &:hover {
      border-color: #aab9dc;
      background-color: #aab9dc;
      color: #ffffff;
      outline: none;

    }

`