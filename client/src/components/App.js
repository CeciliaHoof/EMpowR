import React, { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import styled from "styled-components";
import NavMenu from "./NavMenu";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ErrorPage from "../pages/ErrorPage";
import Medications from "../pages/Medications";
import Prescriptions from "../pages/Prescriptions";
import MedicationDetails from "./MedicationDetails";
import PrescriptionDetails from "./PrescriptionDetails";
import { UserContext } from "../context/user";
import { HealthMetricsContext } from "../context/healthMetrics";
import { PrescriptionsContext } from "../context/prescriptions";
import { ToastContainer } from "react-toastify";

function App() {
  const { user, setUser } = useContext(UserContext);
  const { setHealthMetrics } = useContext(HealthMetricsContext);
  const { setPrescriptions } = useContext(PrescriptionsContext);

  useEffect(() => {
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((data) => {
          setUser(data);
          setHealthMetrics(data.health_metrics);
          setPrescriptions(data.prescriptions);
        });
      } else {
        setUser(null);
      }
    });
  }, [setHealthMetrics, setPrescriptions, setUser]);

  if (!user) {
    return <Login />;
  }

  return (
    <>
    <Container>
      <Sidebar>
        <h1>HealthSync</h1>
        <h3>{`Welcome, ${user.first_name}`}</h3>
        <NavMenu />
      </Sidebar>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/medications" element={<Medications />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/medications/:id" element={<MedicationDetails />} />
        <Route path="/prescriptions/:id" element={<PrescriptionDetails />} />
      </Routes>
    </Container>
    <ToastContainer />
    </>
  );
}

export default App;

const Container = styled.div`
  height: 100vh;
  display: flex;
  gap: 1vw;
`;

const Sidebar = styled.div`
  height: 100%;
  background-color: #7e93a8;
  padding: 0.5%;
`;
