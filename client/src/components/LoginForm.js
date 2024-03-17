import React, { useContext, useState } from "react";
import { Form } from "semantic-ui-react";
import { useFormik } from "formik";
import * as yup from "yup";

import { UserContext } from "../context/user";

function LoginForm() {
  const { setUser } = useContext(UserContext);
  const [hasAccount, setHasAccount] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
        }),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
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
          r.json().then((user) => {
            setUser(user);
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
    <Form onSubmit={formik.handleSubmit}>
      <h3 className="centered_text">
        {hasAccount ? "Login" : "Create Account"}
      </h3>
      {!hasAccount && (
        <>
          <Form.Field>
            <Form.Input
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.first_name}
              name="first_name"
              type="text"
              label="First Name"
            />
            {formik.errors.first_name && formik.touched.first_name && (
              <span style={{ color: "red" }}>{formik.errors.first_name}</span>
            )}
          </Form.Field>
          <Form.Field>
            <Form.Input
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.last_name}
              name="last_name"
              type="text"
              label="Last Name"
            />
            {formik.errors.last_name && formik.touched.last_name && (
              <span style={{ color: "red" }}>{formik.errors.last_name}</span>
            )}
          </Form.Field>
        </>
      )}
      <Form.Field>
        <Form.Input
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
          label="Email Address"
          name="email"
          type="email"       
        ></Form.Input>
        {formik.errors.email && formik.touched.email && (
          <span style={{ color: "red" }}>{formik.errors.email}</span>
        )}
      </Form.Field>
      <Form.Field>
        <Form.Input
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          name="password"
          type="password"
          label="Password"         
        />
        {formik.errors.password && formik.touched.password && (
          <span style={{ color: "red" }}>{formik.errors.password}</span>
        )}
      </Form.Field>
      <Form.Field>
        {submitted &&
          formik.errors &&
          Object.values(formik.errors).map((error) => (
            <span key={error} style={{ color: "red" }}>
              {error}
            </span>
          ))}
        <div className="centered_text">
          <Form.Button  type="submit">
            {hasAccount ? "Login" : "Create Account"}
          </Form.Button>
          <span
            onClick={() => setHasAccount(!hasAccount)}
          >
            {!hasAccount
              ? "Already have an Account? Click Here!"
              : "Don't have account yet? Click here to create an account."}
          </span>
        </div>
      </Form.Field>
    </Form>
  );
}

export default LoginForm;
