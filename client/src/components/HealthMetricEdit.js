import { useContext } from "react";
import {
  Grid,
  FormControl,
  TextField,
  OutlinedInput,
  InputLabel,
  Box,
  Select,
  Button,
  MenuItem,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useFormik } from "formik";
import * as yup from "yup";
import moment from "moment";
import { UserContext } from "../context/user";

export default function HealthMetricEdit({ hideForm, metric, onEdit }) {
  const { user } = useContext(UserContext);

  const initialState = {
    content: metric.content,
    time_taken: moment(metric.time_taken),
    comment: metric.comment ? metric.comment : "",
  };

  const validationSchema = yup.object().shape({
    content:
      metric.metric_type_id === 1
        ? yup
            .string()
            .matches(
              /\//,
              'Field must contain an SBP and DBP separated by a "/" character'
            )
        : yup.string().required("Content is required"),
    time_taken: yup.date().required("Time taken is required"),
    comment: yup.string(),
  });

  const formik = useFormik({
    initialValues: initialState,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formattedDateTime = moment(values.time_taken).format(
        "MM-DD-YYYY HH:mm"
      );
      const patchData = {
        ...values,
        time_taken: formattedDateTime,
      };
      fetch(`/health_metrics/${metric.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(patchData),
      }).then((resp) => {
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
      });
    },
  });

  const medications = user.prescriptions.map(
    (prescription) => prescription.medication
  );

  const medicationOptions = medications.map((med) => (
    <MenuItem key={med.generic_name} value={med.generic_name}>
      {med.generic_name}
    </MenuItem>
  ));

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      autoComplete="off"
      style={{ marginTop: "1em" }}
    >
      <Grid container spacing={2}>
        {metric && metric.metric_type_id <= 8 && (
          <Grid item xs={9}>
            <FormControl fullWidth>
              <InputLabel htmlFor="vs-input">
                {metric.metric_type.metric_type}
              </InputLabel>
              <OutlinedInput
                id="vs-input"
                label={metric.metric_type.metric_type}
                type={metric.metric_type_id !== 1 ? "number" : "text"}
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
              <InputLabel htmlFor="med-input">
                {metric.metric_type.metric_type}
              </InputLabel>
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
        {metric.metric_type_id < 10 && (
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
