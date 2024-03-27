import { useContext, useState, useEffect } from "react";

import { Grid, Paper, Box, Container } from "@mui/material";

import Snapshot from "../components/Snapshot";
import HealthMetricChart from "../components/HealthMetricChart";

import { HealthMetricsContext } from "../context/healthMetrics";
import { PrescriptionsContext } from "../context/prescriptions";
import DailySchedule from "../components/DailySchedule";

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
    <Container sx={{ marginTop: "1rem" }}>
      <Box sx={{ height: "100%" }}>
        <Grid container spacing={3}>
          <Grid item xs={8} container direction="column" spacing={2}>
            <Grid item>
              <Paper
                square
                sx={{
                  p: "0.5rem",
                  alignItems: "center",
                }}
              >
                <Box sx={{ height: "100%", width: "auto" }}>
                  <HealthMetricChart />
                </Box>
              </Paper>
            </Grid>
            <Grid item>
              <Paper
                square
                sx={{
                  p: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Snapshot num={numPrescriptions} type={"Prescriptions"} />
                <Snapshot num={numMetrics} type={"Health Metrics"} />
              </Paper>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Paper
              square
              sx={{
                p: "0.5rem",
                height: "100%",
              }}
            >
              <DailySchedule />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Dashboard;
