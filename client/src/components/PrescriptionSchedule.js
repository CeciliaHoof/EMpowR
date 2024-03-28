import { useContext } from "react";

import {
  Typography,
  Grid,
  Paper,
  Divider,
  Box,
  List,
  ListItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import BedtimeIcon from "@mui/icons-material/Bedtime";

import { PrescriptionsContext } from "../context/prescriptions";

function DailySchedule() {
  const { prescriptions } = useContext(PrescriptionsContext);
  const theme = useTheme();

  const morningFrequencies = [
    "Once daily, AM",
    "Twice daily",
    "Three times daily",
    "With Meals",
  ];
  const morningMeds = prescriptions.filter((prescription) =>
    morningFrequencies.includes(prescription.frequency)
  );
  const morningDisplay = morningMeds.map((med) => (
    <ListItem
      key={med.id}
    >{`${med.medication.generic_name}: ${med.dosage}`}</ListItem>
  ));

  const afternoonFrequencies = ["Three times daily", "With Meals"];
  const afternoonMeds = prescriptions.filter((prescription) =>
    afternoonFrequencies.includes(prescription.frequency)
  );
  const afternoonDisplay = afternoonMeds.map((med) => (
    <ListItem
      key={med.id}
    >{`${med.medication.generic_name}: ${med.dosage}`}</ListItem>
  ));

  const eveningFrequencies = [
    "Once daily, PM",
    "Twice daily",
    "Three times daily",
    "With Meals",
  ];
  const eveningMeds = prescriptions.filter((prescription) =>
    eveningFrequencies.includes(prescription.frequency)
  );
  const eveningDisplay = eveningMeds.map((med) => (
    <ListItem
      key={med.id}
    >{`${med.medication.generic_name}: ${med.dosage}`}</ListItem>
  ));

  const asNeeded = prescriptions.filter(
    (prescription) => prescription.frequency === "As needed(PRN)"
  );
  const prnDisplay = asNeeded.map((med) => (
    <ListItem
      key={med.id}
    >{`${med.medication.generic_name}: ${med.dosage}`}</ListItem>
  ));

  return (
    <>
      <Typography component="h5" variant="h5">
        Daily Prescription Schedule
      </Typography>
      <Divider sx={{ marginBottom: "0.5rem" }} />
      <Box
        sx={{
          margin: "0.5rem",
          padding: "0.2rem",
          height: "35rem",
          overflowY: "scroll",
        }}
      >
        <Grid container direction="column" spacing={2}>
          <Grid item xs={3}>
            <Paper sx={{ padding: "0.5rem" }}>
              <Typography variant="h6">
                Morning Medications
                <WbTwilightIcon
                  sx={{ float: "right", color: theme.palette.primary.dark }}
                />
              </Typography>
              <Divider sx={{ margin: "0.5rem -0.5rem" }} />
              {morningDisplay.length > 0 ? (
                <List dense>{morningDisplay}</List>
              ) : (
                <Typography variant="caption">
                  No medications due at this time.
                </Typography>
              )}
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper sx={{ padding: "0.5rem" }}>
              <Typography variant="h6">
                Afternoon Medications
                <WbSunnyIcon
                  sx={{ float: "right", color: theme.palette.primary.dark }}
                />
              </Typography>
              <Divider sx={{ margin: "0.5rem -0.5rem" }} />
              {afternoonDisplay.length > 0 ? (
                <List dense>{afternoonDisplay}</List>
              ) : (
                <Typography variant="body2">
                  No medications due at this time.
                </Typography>
              )}
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper sx={{ padding: "0.5rem" }}>
              <Typography variant="h6">
                Evening Medications
                <BedtimeIcon
                  sx={{ float: "right", color: theme.palette.primary.dark }}
                />
              </Typography>
              <Divider sx={{ margin: "0.5rem -0.5rem" }} />
              {eveningDisplay.length > 0 ? (
                <List dense>{eveningDisplay}</List>
              ) : (
                <Typography variant="body2">
                  No medications due at this time.
                </Typography>
              )}
            </Paper>
          </Grid>
          {asNeeded.length > 0 && (
            <Grid item xs={1.5}>
              <Paper sx={{ padding: "0.5rem" }}>
                <Typography variant="h6">As Needed</Typography>
                <Divider sx={{ margin: "0.5rem -0.5rem" }} />
                <List dense>{prnDisplay}</List>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
}

export default DailySchedule;
