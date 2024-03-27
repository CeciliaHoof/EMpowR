import React, { useContext, useState } from "react";
import {
  Button,
  Box,
  TextField,
  Grid,
  Typography,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Link,
  Dialog,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";

import { UserContext } from "../context/user";
import { PrescriptionsContext } from "../context/prescriptions";
import { HealthMetricsContext } from "../context/healthMetrics";
import { CurrentPageContext } from "../context/currentPage";
import TermsConditions from "./TermsConditions"

function LoginForm() {
  const { setUser } = useContext(UserContext);
  const { setHealthMetrics } = useContext(HealthMetricsContext);
  const { setPrescriptions } = useContext(PrescriptionsContext);
  const { setCurrentPage } = useContext(CurrentPageContext);
  const [hasAccount, setHasAccount] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openDialog, setOpenDialog] = useState(false)

  const formSchema = yup.object().shape({
    email: yup.string().email("Invalid email.").required("Must enter email"),
    password: yup.string().required("Must enter password"),
    ...(hasAccount
      ? {}
      : {
          first_name: yup
            .string()
            .required("Must enter first name.")
            .max(20, "First name must be shorter than 20 letters.")
            .min(2, "First name must be longer than 2 letters."),
          last_name: yup
            .string()
            .required("Must enter last name.")
            .max(20, "Last name must be shorter than 20 letters.")
            .min(2, "Last name must be longer than 2 letters."),
          terms_conditions: yup
            .boolean()
            .required(
              "Please check the box to acknowledge Terms and Conditions."
            ),
        }),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      terms_conditions: false,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      setSubmitted(true);
      fetch(hasAccount ? "/login" : "/signup", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(values, null, 2),
      }).then((r) => {
        if (r.ok) {
          r.json().then((data) => {
            setUser(data);
            setHealthMetrics(data.health_metrics);
            setPrescriptions(data.prescriptions);
            setCurrentPage("Dashboard");
          });
        } else {
          r.json().then((errors) => {
            formik.setErrors(errors);
          });
        }
      });
    },
  });

  return (
    <>
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      autoComplete="off"
      sx={{
        margin: "1em",
        textAlign: "center",
        backgroundColor: "white",
        padding: "0.5rem",
      }}
    >
      <Typography
        variant="h6"
        component="h1"
        sx={{ color: "#1976d2", marginBottom: "0.75rem" }}
      >
        {hasAccount ? "Login" : "Create Account"}
      </Typography>
      <Grid container justifyContent={"center"} spacing={0.5}>
        {!hasAccount && (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="First Name"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.first_name}
                name="first_name"
                type="text"
              />
              <FormHelperText style={{ color: "red" }}>
                {formik.errors.first_name && formik.touched.first_name
                  ? formik.errors.first_name
                  : " "}
              </FormHelperText>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Last Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.last_name}
                name="last_name"
                type="text"
              />
              <FormHelperText style={{ color: "red" }}>
                {formik.errors.last_name && formik.touched.last_name
                  ? formik.errors.last_name
                  : " "}
              </FormHelperText>
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email Address"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
            name="email"
            type="email"
          />
          <FormHelperText style={{ color: "red" }}>
            {formik.errors.email && formik.touched.email
              ? formik.errors.email
              : " "}
          </FormHelperText>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            name="password"
            type="password"
          />
          <FormHelperText style={{ color: "red" }}>
            {formik.errors.password && formik.touched.password
              ? formik.errors.password
              : " "}
          </FormHelperText>
        </Grid>
        {!hasAccount && (
          <Grid item xs={12}>
            <FormControlLabel
              required
              control={
                <Checkbox
                  checked={formik.values.terms_conditions}
                  onChange={formik.handleChange}
                  name="terms_conditions"
                />
              }
              label={<Link onClick={() => setOpenDialog(true)}>Agree to Terms and Conditions</Link>}
            />
          </Grid>
        )}
        {submitted &&
          formik.errors &&
          Object.values(formik.errors).map((error) => (
            <Typography
              variant="body1"
              component="span"
              key={error}
              style={{ color: "red" }}
            >
              {error}
            </Typography>
          ))}
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            sx={{ marginTop: "0.5rem" }}
          >
            {hasAccount ? "Login" : "Create Account"}
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button onClick={() => setHasAccount(!hasAccount)}>
            {!hasAccount
              ? "Already have an Account? Click Here!"
              : "Don't have account yet? Click here to one."}
          </Button>
        </Grid>
      </Grid>
    </Box>
    <Dialog onClose={() => setOpenDialog(false)} open={openDialog}>
      <TermsConditions />
    </Dialog>
  </>
  );
}

export default LoginForm;
