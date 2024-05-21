import { useContext, useEffect, useState } from "react";
import {
  Button,
  Container,
  TextField,
  MenuItem,
  Grid,
  Box,
  Autocomplete,
} from "@mui/material";
import { UserContext } from "../context/user";
import { PrescriptionsContext } from "../context/prescriptions";
import { MedicationsContext } from "../context/medications";

export default function PrescriptionForm({
  close,
  method,
  prescription,
  onEdit,
  setSnackbar,
}) {
  const { user } = useContext(UserContext);
  const { prescriptions, setPrescriptions } = useContext(PrescriptionsContext);
  const { medications } = useContext(MedicationsContext);
  const [initialState, setInitialState] = useState({});

  useEffect(() => {
    prescription
      ? (setInitialState({
          dosage: prescription.dosage,
          frequency: prescription.frequency,
          route: prescription.route,
          time_of_day: prescription.time_of_day,
          user_id: user.id,
          medication_id: prescription.medication.generic_name,
        }))
      : (setInitialState({
          dosage: "",
          frequency: "",
          route: "",
          time_of_day: "",
          user_id: user.id,
          medication_id: "",
        }));
  }, [prescription]);

  const frequencies = [
    "Once daily, AM",
    "Once daily, PM",
    "Twice daily",
    "Three times daily",
    "As needed(PRN)",
    "With Meals",
  ];

  let userMedications;

  if (!prescription) {
    userMedications = prescriptions.map(
      (prescription) => prescription.medication_id
    );
  }

  const medicationOptions = medications
    .filter((medication) => !userMedications.includes(medication.id))
    .map((medication) => ({
      value: medication.generic_name,
      label: `${medication.generic_name}: ${
        medication.brand_names.split(", ")[0]
      }`,
    }));

  const frequencyOptions = frequencies.map((frequency) => ({
    value: frequency,
    label: frequency,
  }));

  function handleChange(value){
    console.log(value)
  }

  return (
    <Container sx={{ margin: "2rem 0 2rem 0" }}>
      <Box component="form" autoComplete="off">
        <Grid container spacing={2} rowSpacing={1}>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              id="medication_id"
              name="medication_id"
              label="Medication"
              options={medicationOptions}
              getOptionLabel={(option) => option.label}
              onChange={(e, value) => handleChange(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  //   error={Boolean(
                  //     formik.touched.contact && formik.errors.contact
                  //   )}
                  fullWidth
                  //   helperText={formik.touched.contact && formik.errors.contact}
                  label="Medication"
                  name="medication_id"
                  variant="outlined"
                />
              )}
            />
          </Grid>
          {/* <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Dosage"
              variant="outlined"
              margin="normal"
              name="dosage"
              value={formik.values.dosage}
              onChange={formik.handleChange}
              error={formik.touched.dosage && Boolean(formik.errors.dosage)}
              helperText={formik.touched.dosage && formik.errors.dosage}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Route"
              variant="outlined"
              margin="normal"
              name="route"
              value={formik.values.route}
              onChange={formik.handleChange}
              error={formik.touched.route && Boolean(formik.errors.route)}
              helperText={formik.touched.route && formik.errors.route}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              label="Frequency"
              variant="outlined"
              margin="normal"
              name="frequency"
              value={formik.values.frequency}
              onChange={formik.handleChange}
              error={
                formik.touched.frequency && Boolean(formik.errors.frequency)
              }
              helperText={formik.touched.frequency && formik.errors.frequency}
            >
              {frequencyOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid> */}
        </Grid>
        <Grid item xs={12}>
          <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              type="submit"
              sx={{ marginRight: "1rem" }}
            >
              Submit
            </Button>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => close(false)}
            >
              Cancel
            </Button>
          </div>
        </Grid>
      </Box>
    </Container>
  );
}
