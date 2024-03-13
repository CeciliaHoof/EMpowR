import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import { createRoot } from "react-dom/client";

import App from "./components/App";
import { UserProvider } from "./context/user";
import { HealthMetricsProvider } from "./context/healthMetrics";
import { PrescriptionsProvider } from "./context/prescriptions";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <Router>
    <PrescriptionsProvider>
      <HealthMetricsProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </HealthMetricsProvider>
    </PrescriptionsProvider>
  </Router>
);
