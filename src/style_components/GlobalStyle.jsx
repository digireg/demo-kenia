import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`

  * {
    box-sizing: border-box;
  }

  html,body{
    height:100%;
    margin:0;
    padding:0;
      box-sizing: border-box;
      font-size:16px;
  }

  body {
    margin: 0;
    font-family: Inter, sans-serif;
    background-color: #282726;
    max-width:100vw;
    height:100vh;
    ${'' /* padding:20px 30px; */}
  }


.map {
  width: 100%;
  height: 400px;
}

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    padding: 0;
    font-size: inherit;
    font-weight: inherit;
  }

  h1{
    font-family: Inter, sans-serif;
    font-size: 1.25rem;
    font-weight: 600;
  }

  p{
    font-size:14px;
  }



.ol-scale-bar {
  position: absolute !important;
  left: 50% !important;
  bottom: 10px !important;
  transform: translate(-50%, -10px);
  color: #000;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  z-index: 1000;
  pointer-events: none;
}


`;



export default GlobalStyle;