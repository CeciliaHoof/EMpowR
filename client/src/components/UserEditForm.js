import { useContext, useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Box,
  Button,
  Divider,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { UserContext } from "../context/user";

function UserEditForm({ type, handleDialog }) {
  const { user, setUser } = useContext(UserContext);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState("");

  const navigate = useNavigate();

  const initialState =
    type === "password"
      ? {
          first_name: user.first_name,
          last_name: user.last_name,
          password: "",
          email: user.email,
        }
      : {
          first_name: user.first_name,
          last_name: user.last_name,
          password: user.password,
          email: user.email,
        };

  const formSchema = yup.object().shape({
    first_name: yup
      .string()
      .required("First name is required.")
      .max(20, "First name must be shorter than 20 letters.")
      .min(2, "First name must be longer than 2 letters."),
    last_name: yup
      .string()
      .required("Last name is required")
      .max(20, "Last name must be shorter than 20 letters.")
      .min(2, "Last name must be longer than 2 letters."),
    email: yup
      .string()
      .email("Please enter valid email")
      .required("Email is required."),
    password: yup.string(),
  });

  const formik = useFormik({
    initialValues: initialState,
    validationSchema: formSchema,
    onSubmit: (values) => {
      setSubmitted(true);
      fetch(`/users/${user.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values, null, 2),
      }).then((r) => {
        if (r.ok) {
          r.json().then((data) => {
            setUser(data);
            handleDialog(false);
          });
        } else {
          r.json().then((errors) => {
            if (errors.error.includes("UNIQUE")) {
              formik.setErrors("Email already in use.");
            } else {
              formik.setErrors(errors);
            }
          });
        }
      });
    },
  });

  function handleDelete() {
    fetch(`/users/${user.id}`, {
      method: "DELETE",
    }).then((resp) => {
      if (resp.ok) {
        setUser(null);
        navigate("/");
      } else {
        resp.json().then((data) => {
          setErrors(data);
        });
      }
    });
  }
  return (
    <>
      {(type === "password" || type === "details") && (
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          autoComplete="off"
          sx={{ width: "80%", margin: "1rem auto" }}
        >
          <Grid container spacing={1}>
            {type === "password" && (
              <>
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    component="h1"
                    sx={{ margin: "0.5rem" }}
                  >
                    Enter New Password
                  </Typography>
                  <Divider sx={{ marginBottom: "0.5rem" }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    name="password"
                    type="password"
                  />
                </Grid>
              </>
            )}
            {type === "details" && (
              <>
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    component="h1"
                    sx={{ margin: "0.5rem" }}
                  >
                    Account Details
                  </Typography>
                  <Divider sx={{ marginBottom: "0.5rem" }} />
                </Grid>
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
                    helperText={
                      formik.touched.first_name && formik.errors.first_name
                        ? formik.errors.first_name
                        : " "
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    variant="outlined"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.last_name}
                    name="last_name"
                    type="text"
                    helperText={
                      formik.touched.last_name && formik.errors.last_name
                        ? formik.errors.last_name
                        : " "
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    name="email"
                    type="text"
                    helperText={
                      formik.touched.email && formik.errors.email
                        ? formik.errors.email
                        : " "
                    }
                  />
                </Grid>
              </>
            )}
            {submitted && formik.errors && (
              <Grid item xs={12}>
                {Object.values(formik.errors).map((error) => (
                  <Typography
                    variant="body1"
                    component="span"
                    key={error}
                    sx={{ color: "red", textAlign: "center" }}
                  >
                    {error}
                  </Typography>
                ))}
              </Grid>
            )}
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ marginBottom: "1rem" }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
      {type === "delete" && (
        <Box sx={{ width: "80%", margin: "1rem auto" }}>
          <Grid item xs={12}>
            <Typography variant="h6" component="h1" sx={{ margin: "0.5rem" }}>
              Delete Account
            </Typography>
            <Divider sx={{ marginBottom: "0.5rem" }} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" component="p" sx={{ margin: "0.5rem" }}>
              Deleting your account will delete all of your stored prescriptions
              and health metrics. Are you sure you wish to continue?
            </Typography>
          </Grid>
          {errors && (
            <Grid item xs={12}>
              {Object.values(formik.errors).map((error) => (
                <Typography
                  variant="body1"
                  component="span"
                  key={error}
                  sx={{ color: "red", textAlign: "center" }}
                >
                  {error}
                </Typography>
              ))}
            </Grid>
          )}
          <Grid item xs={12} container spacing={2} justifyContent="center">
            <Grid item>
              <Button onClick={handleDelete}>Yes, Delete Account</Button>
            </Grid>
            <Grid item>
              <Button onClick={() => handleDialog(false)}>
                No, Keep Account
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
}

export default UserEditForm;
