import { useContext } from "react";
import { Form, Button } from "semantic-ui-react";
import { useFormik } from "formik";
import * as yup from "yup";
import styled from "styled-components";
import { toast } from "react-toastify";
import { UserContext } from "../context/user";
import { PrescriptionsContext } from "../context/prescriptions";
import { MedicationsContext } from "../context/medications";

function PrescriptionForm({ close, method, prescription, onEdit }) {
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
        medication_id: prescription.medication_id,
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
    "Every other day",
    "Every 4 hours",
    "Every 6 hours",
    "As needed(PRN)",
    "With Meals",
  ];
  const userMedications = prescriptions.map(
    (prescription) => prescription.medication_id
  );

  const medicationOptions = medications
    .filter((medication) => !userMedications.includes(medication.id))
    .map((medication) => {
      let brand_name = medication.brand_names.split(", ")[0];
      return {
        key: medication.id,
        text: `${medication.generic_name}: ${brand_name}`,
        value: medication.id,
      };
    });

  const frequency_options = frequencies.map((frequency) => ({
    key: frequency,
    text: frequency,
    value: frequency,
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
                toast.success('Prescription Successfully Added.')
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
          body: JSON.stringify(values, null, 2),
        })
          .then((resp) => {
            if (resp.ok) {
              resp.json().then((data) => {
                onEdit(data);
                formik.resetForm();
                close(false);
                toast.success('Prescription Successfully Updated')
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
    <FormContainer>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group widths="equal">
          <Form.Field>
            <label>Medication</label>
            <Form.Dropdown
              search
              selection
              fluid
              placeholder={
                prescription
                  ? `${prescription.medication.generic_name}: ${
                      prescription.medication.brand_names.split(", ")[0]
                    }`
                  : null
              }
              options={medicationOptions}
              value={formik.values.medication_id}
              onChange={(e, { value }) => {
                formik.setFieldValue("medication_id", value);
              }}
              onBlur={(e, { name }) => formik.handleBlur(name)}
              name="medication"
            />
            {formik.touched.medication_id && formik.errors.medication_id && (
              <span style={{ color: "red" }}>
                {formik.errors.medication_id}
              </span>
            )}
          </Form.Field>
          <Form.Field>
            <label>Dosage</label>
            <Form.Input
              fluid
              value={formik.values.dosage}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="dosage"
            />
            {formik.touched.dosage && formik.errors.dosage && (
              <span style={{ color: "red" }}>{formik.errors.dosage}</span>
            )}
          </Form.Field>
          <Form.Field>
            <label>Route</label>
            <Form.Input
              fluid
              value={formik.values.route}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="route"
            />
            {formik.touched.route && formik.errors.route && (
              <span style={{ color: "red" }}>{formik.errors.route}</span>
            )}
          </Form.Field>
          <Form.Field>
            <label>Frequency</label>
            <Form.Dropdown
              fluid
              selection
              options={frequency_options}
              value={formik.values.frequency}
              onChange={(e, { value }) => {
                formik.setFieldValue("frequency", value);
              }}
              onBlur={(e, { name }) => formik.handleBlur(name)}
              name="frequency"
            />
            {formik.touched.frequency && formik.errors.frequency && (
              <span style={{ color: "red" }}>{formik.errors.frequency}</span>
            )}
          </Form.Field>
        </Form.Group>
        {formik.errors && (
          <span style={{ color: "red" }}>{formik.errors.error}</span>
        )}
        <div style={{ textAlign: "center" }}>
          <Button size="small" type="submit">
            Submit
          </Button>
          <Button size="small" onClick={() => close(false)}>
            Cancel
          </Button>
        </div>
      </Form>
    </FormContainer>
  );
}

export default PrescriptionForm;

const FormContainer = styled.div`
  margin: 0 1rem 1rem 1rem;
  padding: 0 0.5rem 0 0.5rem;
`;
