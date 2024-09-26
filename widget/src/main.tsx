import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import styles from "@lib/index.css?inline";
// import App from "./App.tsx";
import { WidgetContainer } from "@lib/container.tsx";
import { WidgetPopup } from "@lib/widget.tsx";

// TODO: fix me
// This configuration can come from window object when the html/dom is loaded.
// can also be http request, or something else.
const widgetConfig = {
  widgetId: "wd-1234",
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WidgetContainer config={widgetConfig}>
      <style>{styles}</style>
      <WidgetPopup />
    </WidgetContainer>
  </StrictMode>
);
