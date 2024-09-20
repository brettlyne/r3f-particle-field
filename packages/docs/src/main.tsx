import React from "react";
import ReactDOM from "react-dom/client";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";

import MobileApp from "./MobileApp.tsx";

import { themeOptions } from "./utils/muiTheme";
import "./index.css";

const theme = createTheme(themeOptions);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <MobileApp />
    </ThemeProvider>
  </React.StrictMode>
);
