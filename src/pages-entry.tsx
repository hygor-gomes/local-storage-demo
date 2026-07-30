import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RegistrationFlow } from "@/components/flow/registration-flow";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RegistrationFlow />
  </StrictMode>,
);
