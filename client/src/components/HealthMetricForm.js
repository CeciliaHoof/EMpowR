import { useState, useEffect, useContext } from "react";
import { Form, Input, TextArea, Button } from "semantic-ui-react";
import { useFormik } from "formik";
import * as yup from "yup";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
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
  const [selectedMetricType, setSelectedMetricType] = useState(
    metric ? metric.metric_type : {}
  );
  const [metricTypes, setMetricTypes] = useState([]);
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [medication, setMedication] = useState("");

  useEffect(() => {
    fetch("/metric_types")
      .then((r) => r.json())
      .then((data) => setMetricTypes(data));
  }, []);

  let initialState;

  if (metric) {
    initialState = {
      content: metric.content,
      comment: metric.comment,
      metric_type_id: metric.metric_type_id,
      time_taken: metric.time_taken,
      user_id: metric.user_id,
    };
  } else {
    initialState = {
      content: "",
      comment: "",
      metric_type_id: "",
      time_taken: "",
      user_id: user.id,
    };
  }

  const handleChangeMetricType = (event, { value }) => {
    setSelectedMetricType(metricTypes.find((metric) => metric.id === value));
    formik.values.metric_type_id = value;
  };

  const today = moment();
  const valid = function (current) {
    return current.isBefore(today);
  };

  const validationSchema = yup.object().shape({
    content: yup.string().required("Content is required"),
    time_taken: yup.date().required("Time taken is required"),
    metric_type_id: yup.string().required("Metric type is required."),
  });

  const formik = useFormik({
    initialValues: initialState,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      const formattedDateTime = moment(values.time_taken).format(
        "MM-DD-YYYY HH:mm"
      );
      let postData;
      if (selectedMetricType.id === 1) {
        postData = {
          ...values,
          content: `${systolic}/${diastolic}`,
          time_taken: formattedDateTime,
        };
      } else if (selectedMetricType.id === 6) {
        postData = {
          ...values,
          content: medication,
          time_taken: formattedDateTime,
        };
      } else {
        postData = {
          ...values,
          time_taken: formattedDateTime,
          content: values.content.toString(),
        };
      }
      if (method === "POST") {
        fetch("/health_metrics", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(postData),
        })
          .then((resp) => {
            if (resp.ok) {
              resp.json().then((data) => {
                addMetric(data);
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
        fetch(`/health_metrics/${metric.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(postData),
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
    },
  });

  const metric_options = metricTypes
    .filter((metric) => {
      if (formType === "vitals") {
        return metric.id <= 5;
      } else if (formType === "prescription") {
        return metric.id === 6;
      } else {
        return metric.id > 6;
      }
    })
    .map((metric) => ({
      key: metric.id,
      text: metric.metric_type,
      value: metric.id,
    }));

  const medications = user.prescriptions.map(
    (prescription) => prescription.medication
  );
  
  const medicationOptions = medications.map((med) => ({
    key: med.generic_name,
    text: med.generic_name,
    value: med.generic_name,
  }));

  return (
      <Form onSubmit={formik.handleSubmit} style={{ marginTop: "2em" }}>
        <Form.Group inline>
          <Form.Select
            label="Metric Type"
            options={metric_options}
            placeholder={
              metric ? metric.metric_type.metric_type : "Select Metric Type"
            }
            onChange={handleChangeMetricType}
          />
          <span style={{ color: "red" }}>{formik.errors.metric_type_id}</span>
          {selectedMetricType.id === 1 && (
            <>
              <Input
                placeholder="SBP"
                type="number"
                min="0"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value.toString())}
                onBlur={formik.handleBlur}
                name="systolic"
                style={{ width: "5em" }}
              />
              <span>/</span>
              <Input
                placeholder={"DBP"}
                type="number"
                min="0"
                value={diastolic}
                onChange={(e) => {
                  setDiastolic(e.target.value.toString());
                  formik.values.content = `${systolic}/${diastolic}`;
                }}
                onBlur={formik.handleBlur}
                name="diastolic"
                style={{ width: "5em" }}
              />
              <span style={{ color: "red" }}>{formik.errors.content}</span>
            </>
          )}
          {selectedMetricType.id === 6 && (
            <>
              <Form.Select
                label="Medication"
                options={medicationOptions}
                placeholder="Select Medication"
                value={medication}
                onChange={(e, { value }) => {
                  setMedication(value);
                  formik.setFieldValue("content", value);
                }}
                onBlur={formik.handleBlur}
                name="content"
              />
              <span style={{ color: "red" }}>{formik.errors.content}</span>
            </>
          )}
          {selectedMetricType.id !== 1 && selectedMetricType.id !== 6 && (
            <Form.Field>
              <Input
                type={selectedMetricType.id < 6 ? "number" : "text"}
                min="0"
                max={selectedMetricType.id === 4 ? "10" : null}
                placeholder="Enter Value"
                value={formik.values.content}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="content"
              />
              <span style={{ color: "red" }}>{formik.errors.content}</span>
            </Form.Field>
          )}
        </Form.Group>
        <Form.Field>
          <Datetime
            inputProps={{
              placeholder: metric ? metric.time_taken : "Select Time",
            }}
            isValidDate={valid}
            value={formik.values.taken_time}
            onChange={(date) => formik.setFieldValue("time_taken", date)}
            onBlur={formik.handleBlur}
            dateFormat="MM-DD-YYYY"
          />
          <span style={{ color: "red" }}>{formik.errors.time_taken}</span>
        </Form.Field>
        <Form.Field>
          <TextArea
            label="comment"
            placeholder="Enter Additional Comments"
            value={formik.values.comment}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="comment"
          />
        </Form.Field>
        {formik.errors && (
          <span style={{ color: "red" }}>{formik.errors.error}</span>
        )}
        <Button type="submit">Submit</Button>
        <Button onClick={() => hideForm(false)}>Cancel</Button>
      </Form>

  );
}

export default HealthMetricForm;
