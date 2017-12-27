import "../css/popup.css";
import Authorize from "./components/Authorize";
import React from "react";
import { render } from "react-dom";

render(
  <Authorize/>,
  window.document.getElementById("root")
);
