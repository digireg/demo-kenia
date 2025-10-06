import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import GlobalStyle from "./style_components/GlobalStyle.jsx";

createRoot(document.getElementById("root")).render(
  <>
    <GlobalStyle />
    <App />
  </>
);
