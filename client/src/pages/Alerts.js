import { useContext } from "react";
import { Container, Box, Typography, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AlertsContext } from "../context/alerts";
import Alert from "../components/Alert"

function Alerts() {
  const { alerts, setAlerts } = useContext(AlertsContext);

  const theme = useTheme()

  const alertsDisplay = alerts.map((alert) => <Alert alert={alert} key={alert.id} />)

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
            height: '152px',
            margin: "auto",
          }}
        >
          <Typography variant="h6">If you have an alert for any vital signs, consider rechecking the vital sign and contacting your healthcare provider, <strong>especially</strong> if you are experiencing any unusual symptoms.</Typography>
          <Typography variant="caption">This is not intended to be healthcare advice. Contact your provider for further information.</Typography>
        </Container>
        <Box sx={{ height: "33rem", width: "100%", overflowY: "scroll", marginTop: '1rem' }}>
          <Grid container>{alertsDisplay}</Grid>
        </Box>
      </Container>
    </>
  );
}

export default Alerts;

// On this page a user will:
// see a disclaimer message: Alerts are meant to help you better determine if you should contact your healthcare provider. They are not intended to be healthcare advice.
// see all of their alerts -- unacknowledged first, then acknowledged
// acknowledge alerts
// add a comment if they have contacted their healthcare provider or if an alert is not applicable
