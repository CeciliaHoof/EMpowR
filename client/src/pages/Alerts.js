import { useContext } from "react";
import { Container, Box, Typography, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AlertsContext } from "../context/alerts";
import Alert from "../components/Alert";

function Alerts() {
  const { alerts } = useContext(AlertsContext);

  const theme = useTheme();

  const unacknowledged = alerts
    .filter((alert) => alert.status === "unacknowledged")
    .sort((alertA, alertB) => {
      const timeA = new Date(alertA.health_metric.time_taken);
      const timeB = new Date(alertB.health_metric.time_taken);

      return timeB - timeA;
    })
    .map((alert) => <Alert alert={alert} key={alert.id} />)

  const other = alerts
    .filter((alert) => alert.status !== "unacknowledged")
    .sort((alertA, alertB) => {
      const timeA = new Date(alertA.health_metric.time_taken);
      const timeB = new Date(alertB.health_metric.time_taken);

      return timeB - timeA;
    })
    .map((alert) => <Alert alert={alert} key={alert.id} />)

  return (
    <>
      <Container
        sx={{ display: "flex", flexDirection: "column", width: "100%" }}
      >
        <Container
          sx={{
            textAlign: "center",
            backgroundColor: theme.palette.primary.light,
            padding: "2rem 0.5rem 1rem",
            width: "80%",
            height: "152px",
            margin: "auto",
          }}
        >
          <Typography variant="h6">
            If you have an alert for any vital signs, consider rechecking the
            vital sign and contacting your healthcare provider,{" "}
            <strong>especially</strong> if you are experiencing any unusual
            symptoms.
          </Typography>
          <Typography variant="caption">
            This is not intended to be healthcare advice. Contact your provider
            for further information.
          </Typography>
        </Container>
        <Box
          sx={{
            height: "33rem",
            width: "100%",
            overflowY: "scroll",
            marginTop: "1rem",
          }}
        >
          <Grid container spacing={2}>
            {unacknowledged.length > 0 && (
              <Grid item xs={12} container>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    <strong>Unacknowledged</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} container>
                  {unacknowledged}
                </Grid>
              </Grid>
            )}
            <Grid item xs={12} container>
              <Grid item xs={12}>
                <Typography variant="h6">
                  <strong>Acknowledged</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} container>
                {other}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default Alerts;