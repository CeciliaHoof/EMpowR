import React, { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import NavMenu from "./NavMenu"
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"
import ErrorPage from "../pages/ErrorPage"
import Medications from "../pages/Medications"
import Prescriptions from "../pages/Prescriptions"

import { UserContext } from "../context/user";
import { HealthMetricsContext } from "../context/healthMetrics";
import { PrescriptionsContext } from "../context/prescriptions";

function App() {
  const { user, setUser } = useContext(UserContext)
  const { healthMetrics, setHealthMetrics } = useContext(HealthMetricsContext)
  const { prescriptions, setPrescriptions } = useContext(PrescriptionsContext)

  useEffect(() => {
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((data) => {
          setUser(data);
        });
      } else {
        setUser(null);
      }
    });
  }, [setUser]);

  useEffect(() => {
    fetch("/health_metrics")
      .then((r) => r.json())
      .then((data) => setHealthMetrics(data));
    
    fetch("/prescriptions")
      .then((r) => r.json())
      .then((data) => setPrescriptions(data));
  }, [user]);

  if (!user){
    return (
      <Login />
    )
  }
  return (
    <>
      <NavMenu />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/medications" element={<Medications />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </>
  )

}

export default App;
