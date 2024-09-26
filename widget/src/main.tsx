import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { WidgetContainer } from "@lib/container.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WidgetContainer>
      <App />
    </WidgetContainer>
  </StrictMode>
);
