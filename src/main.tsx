import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/events.css"; //
import { SETTINGS } from "./config/settings";

const eventClass =
  SETTINGS.eventStyle !== "default"
    ? `event-${SETTINGS.eventStyle}`
    : "event-default";
document.body.classList.add(eventClass);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
