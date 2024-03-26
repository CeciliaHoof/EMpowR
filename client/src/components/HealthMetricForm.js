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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useFormik } from "formik";
import * as yup from "yup";
import moment from "moment";
import { UserContext } from "../context/user";

const FieldTypes = {
  VITALS: "vitals",
  PRESCRIPTION: "prescription",
  SYMPTOMS: "symptoms",
};

const initialValuesMap = {
  [FieldTypes.VITALS]: {
    BP: "",
    HR: "",
    RR: "",
    SPO2: "",
    pain: "",
    temp: "",
    glucose: "",
    weight: "",
    time_taken: moment(),
    comment: "",
  },
  [FieldTypes.PRESCRIPTION]: {
    medication: "",
    time_taken: moment(),
    comment: "",
  },
  [FieldTypes.SYMPTOMS]: {
    symptom: "",
    time_taken: moment(),
  },
};

const validationSchemaMap = {
  [FieldTypes.VITALS]: yup.object().shape({
    BP: yup.string().matches(/\//, 'Field must contain an SBP and DBP separated by a "/" character'),
    HR: yup.number().positive("Heart Rate must be a positive number"),
    RR: yup.string(),
    temp: yup.string(),
    SPO2: yup.string(),
    pain: yup.string(),
    glucose: yup.string(),
    time_taken: yup.date().required("Time taken is required"),
    comment: yup.string(),
  }),
  [FieldTypes.PRESCRIPTION]: yup.object().shape({
    medication: yup.string().required("Medication is required"),
    time_taken: yup.date().required("Time taken is required"),
    comment: yup.string(),
  }),
  [FieldTypes.SYMPTOMS]: yup.object().shape({
    symptom: yup.string().required("Symptom is required"),
    time_taken: yup.date().required("Time taken is required"),
  }),
};

function HealthMetricForm({
  hideForm,
  addMetric,
  method,
  metric,
  onEdit,
  formType,
  successMessage,
  showSnackBar
}) {
  const { user } = useContext(UserContext);

  const theme = useTheme()

  const initialState = metric
    ? {
        content: metric.content,
        time_taken: moment(metric.time_taken),
        comment: metric.comment ? metric.comment : "",
      }
    : initialValuesMap[formType];

  const validationSchema = metric
    ? yup.object().shape({
        content:
          metric.metric_type_id === 1
            ? yup.string().matches(/\//, 'Field must contain an SBP and DBP separated by a "/" character')
            : yup.string().required("Content is required"),
        time_taken: yup.date().required("Time taken is required"),
        comment: yup.string(),
      })
    : validationSchemaMap[formType];

  const formik = useFormik({
    initialValues: initialState,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const formattedDateTime = moment(values.time_taken).format(
        "MM-DD-YYYY HH:mm"
      );
      if (method === "PATCH") {
        const patchData = {
          ...values,
          time_taken: formattedDateTime,
        };
        fetch(`/health_metrics/${metric.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(patchData),
        })
          .then((resp) => {
            if (resp.ok) {
              resp.json().then((data) => {
                onEdit(data);
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
      } else {
        let postData;
        let x = 1;
        let metricsToAdd = [];
        const fetchPromises = [];
        if (formType === "vitals") {
          for (const [key, value] of Object.entries(formik.values).slice(
            0,
            8
          )) {
            if (value) {
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
          try {
            const responses = await Promise.all(fetchPromises);
            responses.forEach((data) => {
              metricsToAdd.push(data);
            });
            addMetric(metricsToAdd);
            successMessage("Metric Successfully Added")
            showSnackBar(true)
            formik.resetForm(initialState);
            hideForm(false);
          } catch (error) {
            console.error(error);
          }
          setSubmitting(false);
        } else {
          if (formType === "prescription") {
            postData = {
              content: formik.values.medication,
              time_taken: formattedDateTime,
              comment: formik.values.comment,
              metric_type_id: 9,
              user_id: user.id,
            };
          } else if (formType === "symptoms") {
            postData = {
              content: formik.values.symptom,
              time_taken: formattedDateTime,
              metric_type_id: 10,
              user_id: user.id,
            };
          }

          fetch("/health_metrics", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(postData),
          })
            .then((resp) => {
              if (resp.ok) {
                resp.json().then((data) => {
                  addMetric([data]);
                  successMessage("Metric Successfully Added")
                  showSnackBar(true)
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
      }
    },
  });

  const medications = user.prescriptions.map(
    (prescription) => prescription.medication
  );

  const medicationOptions = medications.map((med) => (
    <MenuItem key={med.generic_name} value={med.generic_name}>{med.generic_name}</MenuItem>
  ));

  const getFieldError = (fieldName) => {
    return formik.touched[fieldName] && formik.errors[fieldName]
      ? formik.errors[fieldName]
      : "";
  };

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      autoComplete="off"
      style={{ marginTop: "1em" }}
    >
      <Grid container spacing={2}>
        {formType === FieldTypes.VITALS && (
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
                  error={(formik.touched.BP && formik.errors.BP) ? true : false}
                />
                <FormHelperText id="BP-error-text" sx={{color: theme.palette.error.main}}>{getFieldError("BP")}</FormHelperText>
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
                <InputLabel htmlFor="spo-input">Blood Oxygen</InputLabel>
                <OutlinedInput
                  id="spo-input"
                  label="Blood Oxygen"
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
                <InputLabel htmlFor="bg-input">Blood Glucose</InputLabel>
                <OutlinedInput
                  id="bg-input"
                  label="Blood Glucose"
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
        {formType === FieldTypes.PRESCRIPTION && (
          <Grid item xs={9}>
            <FormControl fullWidth>
              <InputLabel htmlFor="med-input">Select Medication</InputLabel>
              <Select
                id="med-input"
                label="Select Medication"
                placeholder="Select Medication"
                value={formik.values.medication}
                onChange={(e) => {
                  formik.setFieldValue("medication", e.target.value);
                }}
                name="medication"
              >
                {medicationOptions}
              </Select>
              {formik.touched.medication && formik.errors.medication && (
                <span style={{ color: "red" }}>{formik.errors.medication}</span>
              )}
            </FormControl>
          </Grid>
        )}
        {formType === FieldTypes.SYMPTOMS && (
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
        {metric && metric.metric_type_id <= 8 && (
          <Grid item xs={9}>
          <FormControl fullWidth>
          <InputLabel htmlFor="vs-input">{metric.metric_type.metric_type}</InputLabel>
            <OutlinedInput
              id="vs-input"
              label={metric.metric_type.metric_type}
              type={
                metric.metric_type_id !== 1
                  ? "number"
                  : "text"
              }
              value={formik.values.content}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="content"
            />
            {formik.touched.content && formik.errors.content && (
              <span style={{ color: "red" }}>{formik.errors.content}</span>
            )}
          </FormControl>
          </Grid>
        )}
        {metric && metric.metric_type_id === 9 && (
          <Grid item xs={9}>
          <FormControl fullWidth>
            <InputLabel htmlFor="med-input">{metric.metric_type.metric_type}</InputLabel>
            <Select
              id="med-input"
              label="Select Medication"
              placeholder="Select Medication"
              value={formik.values.content}
              onChange={(e) => {
                formik.setFieldValue("content", e.target.value);
              }}
              name="content"
            >
              {medicationOptions}
            </Select>
            {formik.touched.medication && formik.errors.medication && (
              <span style={{ color: "red" }}>{formik.errors.medication}</span>
            )}
          </FormControl>
        </Grid>
        )}
        {metric && metric.metric_type_id === 10 && (
          <Grid item xs={9}>
          <FormControl fullWidth>
            <TextField
              id="comment-input"
              label={metric.metric_type.metric_type}
              placeholder="lightheaded, fatigue, cough, etc."
              value={formik.values.content}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="content"
            />
          </FormControl></Grid>
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
              <span style={{ color: "red" }}>
                Date and time are required.
              </span>
            )}
          </FormControl>
        </Grid>
        {((formType && formType !== "symptoms") ||
          (metric && metric.metric_type_id < 10)) && (
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
