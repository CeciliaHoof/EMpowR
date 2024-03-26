import { useContext, useState, useEffect } from "react";

import { Grid, Paper } from "@mui/material";

import Snapshot from "../components/Snapshot";
import HealthMetricChart from "../components/HealthMetricChart";

import { HealthMetricsContext } from "../context/healthMetrics";
import { PrescriptionsContext } from "../context/prescriptions";

function Dashboard() {
  const { healthMetrics } = useContext(HealthMetricsContext);
  const { prescriptions } = useContext(PrescriptionsContext);
  const [metricTypes, setMetricTypes] = useState("");

  useEffect(() => {
    fetch("/metric_types")
      .then((r) => r.json())
      .then((data) => setMetricTypes(data));
  }, []);

  const numPrescriptions = prescriptions.length;
  const numMetrics = healthMetrics.length;

  if (!metricTypes) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <Grid container spacing={4} rowSpacing={2}>
        <Grid item xs={8}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "40rem",
              gap: "0.5rem",
            }}
          >
            <HealthMetricChart />
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2rem",
              height: "40rem",
            }}
          >
            <Snapshot num={numPrescriptions} type={"Prescriptions"} />
            <Snapshot num={numMetrics} type={"Health Metrics"} />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default Dashboard;
