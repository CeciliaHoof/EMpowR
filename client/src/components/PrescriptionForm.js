import { useContext } from "react";
import { Button, Container, TextField, MenuItem, Grid, Box } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { UserContext } from "../context/user";
import { PrescriptionsContext } from "../context/prescriptions";
import { MedicationsContext } from "../context/medications";

function PrescriptionForm({ close, method, prescription, onEdit, setSnackbar }) {
  const { user } = useContext(UserContext);
  const { prescriptions, setPrescriptions } = useContext(PrescriptionsContext);
  const { medications } = useContext(MedicationsContext);

  let initialState;

  prescription
    ? (initialState = {
        dosage: prescription.dosage,
        frequency: prescription.frequency,
        route: prescription.route,
        time_of_day: prescription.time_of_day,
        user_id: user.id,
        medication_id: prescription.medication.generic_name,
      })
    : (initialState = {
        dosage: "",
        frequency: "",
        route: "",
        time_of_day: "",
        user_id: user.id,
        medication_id: "",
      });

  const frequencies = [
    "Once daily, AM",
    "Once daily, PM",
    "Twice daily",
    "Three times daily",
    "As needed(PRN)",
    "With Meals",
  ];

  let userMedications;

  !prescription
    ? (userMedications = prescriptions.map(
        (prescription) => prescription.medication_id
      ))
    : (userMedications = []);

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

  const validationSchema = yup.object().shape({
    medication_id: yup.string().required("Medication is required"),
    dosage: yup.string().required("Dosage is required"),
    frequency: yup.string().required("Frequency is required"),
    route: yup.string().required("Route is required"),
  });

  const formik = useFormik({
    initialValues: initialState,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      const selectedMedication = medications.find(
        (medication) => medication.generic_name === formik.values.medication_id
      );
      const requestData = { ...values, medication_id: selectedMedication.id };
      if (method === "POST") {
        fetch("/prescriptions", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(requestData),
        })
          .then((resp) => {
            if (resp.ok) {
              resp.json().then((data) => {
                setPrescriptions([...prescriptions, data]);
                formik.resetForm();
                close(false);
                setSnackbar("Prescription Successfully Added.");
              });
            } else {
              resp.json().then((data) => {
                formik.setErrors(data);
              });
            }
          })
          .finally(() => {
            setSubmitting(false);
          });
      } else {
        fetch(`/prescriptions/${prescription.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(requestData),
        })
          .then((resp) => {
            if (resp.ok) {
              resp.json().then((data) => {
                onEdit(data);
                formik.resetForm();
                close(false);
              });
            } else {
              resp.json().then((data) => {
                formik.setErrors(data);
              });
            }
          })
          .finally(() => {
            setSubmitting(false);
          });
      }
    },
  });

  return (
    <Container sx={{ margin: "2rem 0 2rem 0" }}>
      <Box component="form" autoComplete="off" onSubmit={formik.handleSubmit}>
        <Grid container spacing={2} rowSpacing={1}>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              label="Medication"
              variant="outlined"
              margin="normal"
              name="medication_id"
              value={formik.values.medication_id}
              onChange={formik.handleChange}
              error={
                formik.touched.medication_id &&
                Boolean(formik.errors.medication_id)
              }
              helperText={
                formik.touched.medication_id && formik.errors.medication_id
              }
            >
              {medicationOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
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
          </Grid>
        </Grid>
        <Grid item xs={12}>
        <div style={{ textAlign: "center", marginTop: '0.5rem' }}>
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

export default PrescriptionForm;
