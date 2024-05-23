import { useContext } from "react";
import {
  Grid,
  FormControl,
  TextField,
  OutlinedInput,
  InputLabel,
  FormHelperText,
  Box,
  Select,
  Button,
  MenuItem,
  Chip
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useFormik } from "formik";
import * as yup from "yup";
import moment from "moment";
import { UserContext } from "../context/user";

const initialValuesMap = {
  vitals: {
    BP: "",
    HR: "",
    RR: "",
    SPO2: "",
    temp: "",
    pain: "",
    glucose: "",
    weight: "",
    time_taken: moment(),
    comment: "",
  },
  prescription: {
    medication: [],
    time_taken: moment(),
    comment: "",
  },
  symptoms: {
    symptom: "",
    time_taken: moment(),
  },
};

const validationSchemaMap = {
  vitals: yup.object().shape({
    BP: yup
      .string()
      .matches(
        /\//,
        'Field must contain an SBP and DBP separated by a "/" character'
      ),
    HR: yup.number().positive("Heart Rate must be a positive number"),
    RR: yup.number().positive("Respiratory Rate must be a positive number"),
    temp: yup.string(),
    SPO2: yup.number().positive("Heart Rate must be a positive number"),
    pain: yup.number(),
    glucose: yup.number().positive("Heart Rate must be a positive number"),
    time_taken: yup.date().required("Time taken is required"),
    comment: yup.string(),
  }),
  prescription: yup.object().shape({
    medication: yup.array().required("Medication is required"),
    time_taken: yup.date().required("Time taken is required"),
    comment: yup.string(),
  }),
  symptoms: yup.object().shape({
    symptom: yup.string().required("Symptom is required"),
    time_taken: yup.date().required("Time taken is required"),
  }),
};

function HealthMetricForm({
  hideForm,
  addMetric,
  formType,
  setSnackbar,
  createAlert,
}) {
  const { user } = useContext(UserContext);

  const theme = useTheme();

  const initialState = initialValuesMap[formType];

  const validationSchema = validationSchemaMap[formType];

  const formik = useFormik({
    initialValues: initialState,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const formattedDateTime = moment(values.time_taken).format(
        "MM-DD-YYYY HH:mm"
      );
      let postData;
      let x = 1;
      let metricsToAdd = [];
      let alerts = [];
      const fetchPromises = [];
      if (formType === "vitals" || formType === "prescription") {
        if (formType === "vitals") {
          for (const [key, value] of Object.entries(formik.values).slice(
            0,
            8
          )) {
            const valueStr = value.toString();
            if (valueStr) {
              postData = {
                content: value,
                metric_type_id: x,
                comment: formik.values.comment,
                time_taken: formattedDateTime,
                user_id: user.id,
              };

              fetchPromises.push(
                fetch("/health_metrics", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify(postData),
                }).then((resp) => {
                  if (resp.ok) {
                    return resp.json();
                  } else {
                    resp.json().then((data) => {
                      formik.setErrors(data);
                    });
                  }
                })
              );
            }
            x++;
          }
        } else {
          for (let i = 0; i < formik.values.medication.length; i++) {
            postData = {
              content: formik.values.medication[i],
              time_taken: formattedDateTime,
              comment: formik.values.comment,
              metric_type_id: 9,
              user_id: user.id,
            };

            fetchPromises.push(
              fetch("/health_metrics", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(postData),
              }).then((resp) => {
                if (resp.ok) {
                  return resp.json();
                } else {
                  resp.json().then((data) => {
                    formik.setErrors(data);
                  });
                }
              })
            );
          }
        }
        try {
          const responses = await Promise.all(fetchPromises);
          responses.forEach((data) => {
            if (data.alert) {
              metricsToAdd.push(data.metric);
              alerts.push(data.alert);
            } else {
              metricsToAdd.push(data);
            }
          });
          addMetric(metricsToAdd);
          if (alerts.length > 0) {
            createAlert(alerts);
          }
          setSnackbar("Metric Successfully Added");
          formik.resetForm(initialState);
          hideForm(false);
        } catch (error) {
          console.error(error);
        }
        setSubmitting(false);
      } else {
        postData = {
          content: formik.values.symptom,
          time_taken: formattedDateTime,
          metric_type_id: 10,
          user_id: user.id,
        };

        fetch("/health_metrics", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(postData),
        })
          .then((resp) => {
            if (resp.ok) {
              resp.json().then((data) => {
                addMetric([data]);
                setSnackbar("Metric Successfully Added");
                formik.resetForm();
                hideForm(false);
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
    // },
  });

  const medications = user.prescriptions.map(
    (prescription) => prescription.medication
  );

  const medicationOptions = medications.map((med) => (
    <MenuItem key={med.generic_name} value={med.generic_name}>
      {med.generic_name}
    </MenuItem>
  ));

  function getFieldError(fieldName) {
    return formik.touched[fieldName] && formik.errors[fieldName]
      ? formik.errors[fieldName]
      : "";
  }

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      autoComplete="off"
      style={{ marginTop: "1em" }}
    >
      <Grid container spacing={2}>
        {formType === "vitals" && (
          <>
            <Grid item xs={2.4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="BP-input">Blood Pressure</InputLabel>
                <OutlinedInput
                  id="BP-input"
                  label="Blood Pressure"
                  placeholder="SBP/DBP"
                  type="text"
                  value={formik.values.BP}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="BP"
                  error={formik.touched.BP && formik.errors.BP ? true : false}
                />
                <FormHelperText
                  id="BP-error-text"
                  sx={{ color: theme.palette.error.main }}
                >
                  {getFieldError("BP")}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={2.4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="HR-input">Heart Rate</InputLabel>
                <OutlinedInput
                  id="HR-input"
                  label="Heart Rate"
                  placeholder="HR"
                  type="number"
                  min="0"
                  max="200"
                  value={formik.values.HR}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="HR"
                />
              </FormControl>
            </Grid>
            <Grid item xs={2.4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="RR-input">Respiratory Rate</InputLabel>
                <OutlinedInput
                  id="RR-input"
                  label="Respiratory Rate"
                  placeholder="RR"
                  type="number"
                  min="0"
                  max="200"
                  value={formik.values.RR}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="RR"
                />
              </FormControl>
            </Grid>
            <Grid item xs={2.4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="spo-input">Blood Oxygen</InputLabel>
                <OutlinedInput
                  id="spo-input"
                  label="Blood Oxygen"
                  placeholder="SpO2"
                  type="number"
                  min="0"
                  max="100"
                  value={formik.values.SPO2}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="SPO2"
                />
              </FormControl>
            </Grid>
            <Grid item xs={2.4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="temp-input">Temperature</InputLabel>
                <OutlinedInput
                  id="temp-input"
                  label="Temperature"
                  placeholder="°F"
                  type="number"
                  min="90.0"
                  value={formik.values.temp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="temp"
                />
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel htmlFor="pain-input">Pain Level</InputLabel>
                <OutlinedInput
                  id="pain-input"
                  label="Pain Level"
                  placeholder="0 to 10"
                  type="number"
                  min="0"
                  max="10"
                  value={formik.values.pain}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="pain"
                />
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel htmlFor="bg-input">Blood Glucose</InputLabel>
                <OutlinedInput
                  id="bg-input"
                  label="Blood Glucose"
                  placeholder="mg/dL"
                  type="number"
                  min="0"
                  value={formik.values.glucose}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="glucose"
                />
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel htmlFor="weight-input">Weight</InputLabel>
                <OutlinedInput
                  id="weight-input"
                  label="Weight"
                  placeholder="lbs"
                  type="number"
                  min="0"
                  value={formik.values.weight}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="weight"
                />
              </FormControl>
            </Grid>
          </>
        )}
        {formType === "prescription" && (
          <Grid item xs={9}>
            <FormControl fullWidth>
              <InputLabel htmlFor="med-input">Select Medication</InputLabel>
              <Select
                multiple
                id="med-input"
                label="Select Medication"
                placeholder="Select Medication"
                value={formik.values.medication}
                onChange={(e) => {
                  formik.setFieldValue("medication", e.target.value);
                }}
                name="medication"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {medicationOptions}
              </Select>
              {formik.touched.medication && formik.errors.medication && (
                <span style={{ color: "red" }}>{formik.errors.medication}</span>
              )}
            </FormControl>
          </Grid>
        )}
        {formType === "symptoms" && (
          <Grid item xs={9}>
            <FormControl fullWidth>
              <TextField
                id="symptom-input"
                label="Symptom"
                placeholder="lightheaded, fatigue, cough, etc."
                value={formik.values.symptom}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="symptom"
              />
            </FormControl>
          </Grid>
        )}
        <Grid item xs={3}>
          <FormControl fullWidth>
            <DateTimePicker
              label="Select Date and Time"
              value={formik.values.time_taken}
              onChange={(date) => formik.setFieldValue("time_taken", date)}
              textField={(params) => (
                <input {...params} placeholder="Select Date and Time" />
              )}
              name="time_taken"
              maxDateTime={moment()}
            />
            {formik.touched.time_taken && formik.errors.time_taken && (
              <span style={{ color: "red" }}>Date and time are required.</span>
            )}
          </FormControl>
        </Grid>
        {formType !== "symptoms" && (
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                id="comment-input"
                label="Comment"
                placeholder="Enter Additional Details. Did you have to take a different dose of your medication? Did you do anything in response to a certain vital sign?"
                value={formik.values.comment}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="comment"
              />
            </FormControl>
          </Grid>
        )}
        {formik.errors && (
          <span style={{ color: "red" }}>{formik.errors.error}</span>
        )}
        <Grid item xs={12}>
          <div style={{ textAlign: "center" }}>
            <Button type="submit">Submit</Button>
            <Button type="button" onClick={() => hideForm(false)}>
              Cancel
            </Button>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}

export default HealthMetricForm;
