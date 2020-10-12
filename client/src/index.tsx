import ReactDOM from "react-dom";
import React from "react";

import App from "./components/app";

import "./index.scss";

document.addEventListener("DOMContentLoaded", () => {
  const div = document.createElement("div");
  document.body.appendChild(div);

  ReactDOM.render(<App />, div);
});
