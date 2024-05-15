import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { createRoot } from "react-dom/client";

import App from "./components/App";
import { UserProvider } from "./context/user";
import { CurrentPageProvider } from "./context/currentPage";
import { HealthMetricsProvider } from "./context/healthMetrics";
import { PrescriptionsProvider } from "./context/prescriptions";
import { MedicationsProvider } from "./context/medications";
import { AlertsProvider } from "./context/alerts";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <Router>
    <CurrentPageProvider>
      <AlertsProvider>
        <MedicationsProvider>
          <PrescriptionsProvider>
            <HealthMetricsProvider>
              <UserProvider>
                <App />
              </UserProvider>
            </HealthMetricsProvider>
          </PrescriptionsProvider>
        </MedicationsProvider>
      </AlertsProvider>
    </CurrentPageProvider>
  </Router>
);
