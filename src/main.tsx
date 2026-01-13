import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

if (import.meta.env.DEV) {
  import("./lib/filters/debugQuickCheck").then(({ debugQuickCheck }) => {
    debugQuickCheck();
  });

  import("./lib/details/debugDetailsQuickCheck").then(({ debugDetailsQuickCheck }) => {
    debugDetailsQuickCheck();
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
