import { useState, useContext } from "react";
import { Form, Input, TextArea, Button } from "semantic-ui-react";
import { useFormik } from "formik";
import * as yup from "yup";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../context/user";

function HealthMetricForm({
  hideForm,
  addMetric,
  method,
  metric,
  onEdit,
  formType,
}) {
  const { user } = useContext(UserContext);

  let initialState;
  if (!metric) {
    if (formType === "vitals") {
      initialState = {
        BP: "",
        HR: "",
        RR: "",
        SPO2: "",
        pain: "",
        temp: "",
        glucose: "",
        time_taken: "",
        comment: "",
      };
    } else if (formType === "prescription") {
      initialState = {
        medication: "",
        time_taken: "",
        comment: "",
      };
    } else if (formType === "symptoms") {
      initialState = {
        symptom: "",
        time_taken: "",
      };
    }
  } else if (metric) {
    initialState = {
      content: metric.content,
      time_taken: metric.time_taken,
      comment: metric.comment ? metric.comment : "",
    };
  }

  let validationSchema;
  if (!metric) {
    if (formType === "vitals") {
      validationSchema = yup.object().shape({
        BP: yup.string().matches(/\//, 'Field must contain "/" character'),
        HR: yup.string(),
        RR: yup.string(),
        temp: yup.string(),
        SPO2: yup.string(),
        pain: yup.string(),
        glucose: yup.string(),
        time_taken: yup.date().required("Time taken is required"),
        comment: yup.string(),
      });
    } else if (formType === "prescription") {
      validationSchema = yup.object().shape({
        medication: yup.string().required("Medication is required"),
        time_taken: yup.date().required("Time taken is required"),
        comment: yup.string(),
      });
    } else if (formType === "symptoms") {
      validationSchema = yup.object().shape({
        symptom: yup.string().required("Symptom is required"),
        time_taken: yup.date().required("Time taken is required"),
      });
    }
  } else {
    if (metric.metric_type_id === 1) {
      validationSchema = yup.object().shape({
        content: yup.string().matches(/\//, 'Field must contain "/" character'),
        time_taken: yup.date().required("Time taken is required"),
        comment: yup.string(),
      });
    } else {
      validationSchema = yup.object().shape({
        content: yup.string().required("Content is required"),
        time_taken: yup.date().required("Time taken is required"),
        comment: yup.string(),
      });
    }
  }

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
      }
      let postData;
      let x = 1;
      let metricsToAdd = [];
      const fetchPromises = [];
      if (formType === "vitals") {
        for (const [key, value] of Object.entries(formik.values).slice(0, 7)) {
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
          formik.resetForm(initialState);
          hideForm(false);
        } catch (error) {
          console.error(error);
          toast.error("Error creating metrics.");
        }
        setSubmitting(false);
      } else {
        if (formType === "prescription") {
          postData = {
            content: formik.values.medication,
            time_taken: formattedDateTime,
            comment: formik.values.comment,
            metric_type_id: 8,
            user_id: user.id,
          };
        } else if (formType === "symptoms") {
          console.log("SYMPTOM");
          postData = {
            content: formik.values.symptom,
            time_taken: formattedDateTime,
            metric_type_id: 9,
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
  });

  const today = moment();
  const valid = function (current) {
    return current.isBefore(today);
  };

  const medications = user.prescriptions.map(
    (prescription) => prescription.medication
  );

  const medicationOptions = medications.map((med) => ({
    key: med.generic_name,
    text: med.generic_name,
    value: med.generic_name,
  }));

  return (
    <Form onSubmit={formik.handleSubmit} style={{ marginTop: "1em" }}>
      <Form.Group widths="equal">
        {formType === "vitals" && !metric && (
          <>
            <Form.Field>
              <label>Blood Pressure</label>
              <Input
                placeholder="SBP/DBP"
                type="text"
                value={formik.values.BP}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="BP"
              />
              {formik.touched.BP && formik.errors.BP && (
                <span style={{ color: "red" }}>{formik.errors.BP}</span>
              )}
            </Form.Field>
            <Form.Field>
              <label>Heart Rate</label>
              <Input
                placeholder="HR"
                type="number"
                min="0"
                max="200"
                value={formik.values.HR}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="HR"
              />
            </Form.Field>
            <Form.Field>
              <label>Respiratory Rate</label>
              <Input
                placeholder="RR"
                type="number"
                min="0"
                max="200"
                value={formik.values.RR}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="RR"
              />
            </Form.Field>
            <Form.Field>
              <label>Blood Oxygen</label>
              <Input
                placeholder="SpO2"
                type="number"
                min="0"
                max="100"
                value={formik.values.SPO2}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="SPO2"
              />
            </Form.Field>
            <Form.Field>
              <label>Temperature</label>
              <Input
                placeholder="°F"
                type="text"
                value={formik.values.temp}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="temp"
              />
            </Form.Field>
            <Form.Field>
              <label>Pain Level</label>
              <Input
                placeholder="0 to 10"
                type="number"
                min="0"
                max="10"
                value={formik.values.pain}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="pain"
              />
            </Form.Field>
            <Form.Field>
              <label>Blood Glucose</label>
              <Form.Input
                placeholder="mg/dL"
                type="number"
                min="0"
                value={formik.values.glucose}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="glucose"
              />
            </Form.Field>
          </>
        )}
        {formType === "prescription" && !metric && (
          <Form.Field>
            <label>Select Medication</label>
            <Form.Select
              options={medicationOptions}
              placeholder="Select Medication"
              value={formik.values.medication}
              onChange={(e, { value }) => {
                formik.setFieldValue("medication", value);
              }}
              name="medication"
            />
            {formik.touched.medication && formik.errors.medication && (
              <span style={{ color: "red" }}>{formik.errors.medication}</span>
            )}
          </Form.Field>
        )}
        {formType === "symptoms" && !metric && (
          <Form.Field>
            <label>Other Symptoms</label>
            <Form.TextArea
              placeholder="lightheaded, fatigue, cough, etc."
              type="number"
              min="0"
              value={formik.values.symptom}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="symptom"
            />
          </Form.Field>
        )}
        {metric && metric.metric_type_id <= 7 && (
          <Form.Field>
            <label>{metric.metric_type.metric_type}</label>
            <Form.Input
              type={
                metric.metric_type_id !== 6 && metric.metric_type_id !== 1
                  ? "number"
                  : "text"
              }
              value={formik.values.content}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="content"
            />
          </Form.Field>
        )}
        {metric && metric.metric_type_id === 8 && (
          <Form.Field>
            <label>{metric.metric_type.metric_type}</label>
            <Form.Select
              options={medicationOptions}
              placeholder="Select Medication"
              value={formik.values.content}
              onChange={(e, { value }) => {
                formik.setFieldValue("content", value);
              }}
              name="content"
            />
          </Form.Field>
        )}
        {metric && metric.metric_type_id === 9 && (
          <Form.Field>
            <label>{metric.metric_type.metric_type}</label>
            <Form.TextArea
              placeholder="lightheaded, fatigue, cough, etc."
              type="number"
              min="0"
              value={formik.values.content}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="content"
            />
          </Form.Field>
        )}
      </Form.Group>
      <Form.Field>
        <Datetime
          inputProps={{
            placeholder: metric ? metric.time_taken : "Select Date and Time",
          }}
          isValidDate={valid}
          value={formik.values.taken_time}
          onChange={(date) => formik.setFieldValue("time_taken", date)}
          onBlur={formik.handleBlur}
          dateFormat="MM-DD-YYYY"
          name="time_taken"
        />
        {formik.touched.time_taken && formik.errors.time_taken && (
          <span style={{ color: "red" }}>
            Date and time are required. They must be in MM-DD-YYYY HH:MM AM/PM
            format.
          </span>
        )}
      </Form.Field>
      {formType !== "symptoms" ||
        (metric && metric.metric_type_id !== 9 && (
          <Form.Field>
            <Form.TextArea
              label="comment"
              placeholder="Enter Additional Comments"
              value={formik.values.comment}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="comment"
            />
          </Form.Field>
        ))}
      {formik.errors && (
        <span style={{ color: "red" }}>{formik.errors.error}</span>
      )}
      <Button type="submit">Submit</Button>
      <Button type="button" onClick={() => hideForm(false)}>
        Cancel
      </Button>
    </Form>
  );
}

export default HealthMetricForm;
