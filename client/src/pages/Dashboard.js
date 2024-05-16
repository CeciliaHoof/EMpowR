import { useContext, useState, useEffect } from "react";

import { Grid, Paper, Box, Container } from "@mui/material";

import Snapshot from "../components/Snapshot";
import HealthMetricChart from "../components/HealthMetricChart";
import PrescriptionSchedule from "../components/PrescriptionSchedule";

import { HealthMetricsContext } from "../context/healthMetrics";
import { PrescriptionsContext } from "../context/prescriptions";
import { AlertsContext } from "../context/alerts";

function Dashboard() {
  const { healthMetrics } = useContext(HealthMetricsContext);
  const { prescriptions } = useContext(PrescriptionsContext);
  const { alerts } = useContext(AlertsContext)
  const [metricTypes, setMetricTypes] = useState("");

  useEffect(() => {
    fetch("/metric_types")
      .then((r) => r.json())
      .then((data) => setMetricTypes(data));
  }, []);

  if (!metricTypes) {
    return <h1>Loading...</h1>;
  }

  const unacknowledged = alerts.filter((alert) => alert.status === "unacknowledged")
  
  return (
    <Container sx={{ marginTop: "1rem" }}>
      <Box sx={{ height: "100%" }}>
        <Grid container spacing={3}>
          <Grid item xs={8} container direction="column" spacing={3}>
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
            <Grid item container direction="row" spacing={2}>
              <Grid item xs={4}>
                <Snapshot num={prescriptions.length} type={"Prescriptions"} />
              </Grid>
              <Grid item xs={4}>
                <Snapshot num={healthMetrics.length} type={"Health Metrics"} />
              </Grid>
              <Grid item xs={4}>
                <Snapshot num={alerts.length} badge={unacknowledged} type={"Alerts"} />
              </Grid>
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
              <PrescriptionSchedule />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Dashboard;
