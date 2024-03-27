import { useContext, useState } from "react";
import { Grid, Typography, Paper, TextField, Box, Button } from "@mui/material";

import { UserContext } from "../context/user";

function ManageAccount() {
  const { user } = useContext(UserContext);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [errors, setErrors] = useState(null)

  function authenticateUser(e){
    e.preventDefault();
    fetch("/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        password: password,
      }),
    }).then((r) => {
      if (r.ok) {
        r.json().then((user) => {
          setAuthenticated(true);
        });
      } else {
        r.json().then(() => setErrors({ error: "Invalid password" }));
      }
    });
  }

  return (
    <>
      {!authenticated ? (
        <Box
            component="form"
            onSubmit={authenticateUser}
        >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              type="password"
              label="Please Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          {errors && <Grid item xs={12}><Typography variant="body1" component={"span"} style={{color: 'red'}}>{errors.error}</Typography></Grid>}
          <Grid item xs={12}>
            <Button type="submit" variant="contained">Submit</Button>
          </Grid>
        </Grid>
        </Box>
      ):(
        <h1>Manage Account</h1>
      )}

    </>
  );
}

export default ManageAccount;
