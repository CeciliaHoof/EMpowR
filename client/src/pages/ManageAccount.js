import { useContext, useState } from "react";
import {
  Grid,
  Typography,
  Paper,
  TextField,
  Box,
  Button,
  IconButton,
  Divider,
  Dialog,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useTheme } from "@mui/material/styles";

import { UserContext } from "../context/user";
import UserEditForm from "../components/UserEditForm";

function ManageAccount() {
  const { user } = useContext(UserContext);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [errors, setErrors] = useState(null);
  const [formType, setFormType] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const theme = useTheme();

  function authenticateUser(e) {
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

  function handleClick(string) {
    setFormType(string);
    setOpenDialog(true);
  }

  return (
    <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
      {!authenticated ? (
          <Box
            component="form"
            onSubmit={authenticateUser}
            sx={{ width: "40%" }}
          >
            <Paper elevation={6} sx={{ textAlign: "center", padding: "2rem" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Please Enter Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
                {errors && (
                  <Grid item xs={12}>
                    <Typography
                      variant="body1"
                      component="span"
                      style={{ color: "red" }}
                    >
                      {errors.error}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Button type="submit" variant="contained">
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Box>
      ) : (
        <>
            <Paper>
              <Typography variant="h5" component="h1" sx={{ margin: "0.5rem" }}>
                Manage Account
              </Typography>
              <Divider sx={{ marginBottom: "1rem" }} />
              <Box sx={{ width: "80%", margin: "auto" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} alignItems="center">
                  <Typography variant="h6" component="p">
                    Change Password
                    <IconButton
                      onClick={() => handleClick("password")}
                      sx={{ float: "right", color: theme.palette.primary.dark }}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </Typography>
                  <Divider />
                </Grid>
                <Grid item xs={12} alignItems="center">
                  <Typography variant="h6" component="p">
                    Account Details
                    <IconButton
                      onClick={() => handleClick("details")}
                      sx={{ float: "right", color: theme.palette.primary.dark }}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </Typography>
                  <Divider />
                </Grid>
                <Grid item xs={12} alignItems="center">
                  <Typography variant="h6" component="p">
                    Delete Account
                    <IconButton
                      onClick={() => handleClick("delete")}
                      sx={{ float: "right", color: theme.palette.primary.dark }}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </Typography>
                  <Divider sx={{ marginBottom: '2rem'}}/>
                </Grid>
              </Grid>
              </Box>
            </Paper>
          <Dialog onClose={() => setOpenDialog(false)} open={openDialog}>
            <UserEditForm type={formType} handleDialog={setOpenDialog}/>
          </Dialog>
          </>
      )}
    </div>
  );
}

export default ManageAccount;
