import React, { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import BiomarkerApp from "./BiomarkerApp";
import { createTheme } from "@mui/material/styles";
import ReactGA from "react-ga4";
import { GLYGEN_ENV, GLYGEN_BUILD } from "./envVariables.js";

function initializeReactGA() {
  if (GLYGEN_ENV === "prod" || GLYGEN_ENV === "beta" || GLYGEN_ENV === "biom_prod") {
    ReactGA.initialize("G-5BHHHQ044D");
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }
}


const theme = createTheme({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      "Oxygen",
      "Ubuntu",
      "Cantarell",
      '"Fira Sans"',
      '"Droid Sans"',
      '"Helvetica Neue"',
      "sans-serif",
    ].join(","),
  },
});

/**
 * Glygen App component.
 */
function App() {
  initializeReactGA();
  const [userTrackingBannerState, setUserTrackingBannerState] = useState("none");

  return (
    <div className="App">

      {GLYGEN_BUILD === "biomarker" && 
        <BiomarkerApp 
          theme={theme} 
          userTrackingBannerState={userTrackingBannerState} 
          setUserTrackingBannerState={setUserTrackingBannerState}
      />}

    </div>
  );
}

export default App;
