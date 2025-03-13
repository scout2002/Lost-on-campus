import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider, CssBaseline } from "@mui/material";
import darkTheme from "./theme/theme.ts";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <StrictMode>
      <App />
    </StrictMode>
  </ThemeProvider>
);
