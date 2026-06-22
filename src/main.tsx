import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "@fontsource-variable/lora";
import "@fontsource/zen-old-mincho/latin-400.css";
import "@fontsource/zen-old-mincho/latin-700.css";
import "@fontsource/zen-old-mincho/latin-900.css";
import "@fontsource/yuji-syuku/latin-400.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
