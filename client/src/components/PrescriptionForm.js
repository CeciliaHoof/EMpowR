import { useContext } from "react";
import { Form, Button } from "semantic-ui-react";
import { useFormik } from "formik";
import * as yup from "yup";
import { UserContext } from "../context/user";
import { PrescriptionsContext } from "../context/prescriptions"

function PrescriptionForm({ close, method, prescription, onEdit, medId }) {
  const { user } = useContext(UserContext);
  const { prescriptions, setPrescriptions } = useContext(PrescriptionsContext)
  let initialState;

  prescription
    ? (initialState = {
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      route: prescription.route,
      time_of_day: prescription.time_of_day,
      user_id: user.id,
      medication_id: medId,
    })
    : (initialState = {
        dosage: "",
        frequency: "",
        route: "",
        time_of_day: "",
        user_id: user.id,
        medication_id: medId,
      });

  const validationSchema = yup.object().shape({
    dosage: yup.string().required("Dosage is required"),
    frequency: yup.string().required("Frequency is required"),
    route: yup.string().required("Route is required"),
    time_of_day: yup.string().required("Dosage is required"),
  });

  const formik = useFormik({
    initialValues: initialState,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      if (method === "POST") {
        fetch("/prescriptions", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(values, null, 2),
        })
          .then((resp) => {
            if (resp.ok) {
              resp.json().then((data) => {
                setPrescriptions([...prescriptions, data]);
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
      else {
        fetch(`/prescriptions/${prescription.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(values, null, 2),
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
    <Form onSubmit={formik.handleSubmit}>
      <Form.Group inline>
        <Form.Field>
          <Form.Input
            label="Dosage"
            value={formik.values.dosage}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="dosage"
          />
          <span style={{ color: "red" }}>{formik.errors.dosage}</span>
        </Form.Field>
        <Form.Field>
          <Form.Input
            label="Route"
            value={formik.values.route}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="route"
          />
          <span style={{ color: "red" }}>{formik.errors.route}</span>
        </Form.Field>
      </Form.Group>
      <Form.Group inline>
        <Form.Field>
          <Form.Input
            label="Frequency"
            value={formik.values.frequency}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="frequency"
          />
          <span style={{ color: "red" }}>{formik.errors.frequency}</span>
        </Form.Field>
        <Form.Field>
          <Form.Input
            label="Time of Day"
            value={formik.values.time_of_day}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="time_of_day"
          />
          <span style={{ color: "red" }}>{formik.errors.time_of_day}</span>
        </Form.Field>
      </Form.Group>
      {formik.errors && (
        <span style={{ color: "red" }}>{formik.errors.error}</span>
      )}
      <Button type="submit">Submit</Button>
    </Form>
  );
}

export default PrescriptionForm;
