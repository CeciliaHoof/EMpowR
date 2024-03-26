import { CssBaseline, AppBar, Typography, Grid, Paper, Box, Container } from "@mui/material";
import LoginForm from "../components/LoginForm";

function LandingPage() {
  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          paddingLeft: "1rem",
          height: "4rem",
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <Typography variant="h5" component="div" noWrap>
          EMpowR
        </Typography>
      </AppBar>
      <Box component="main" sx={{marginTop: '6rem', marginLeft: '3rem', marginRight: '3rem'}}>
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={7.5} container direction="column" spacing={2}>
            <Grid item xs={12}>
            <Paper sx={{ padding: "2rem", textAlign: "center" }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                color="primary.dark"
                sx={{
                  fontWeight: "bold",
                  marginBottom: "1rem",
                }}
              >
                Revolutionize Your Health Management
              </Typography>
              </Paper>
              </Grid>
              <Grid item xs={12}>
              <Paper sx={{ padding: "2rem", textAlign: "center" }}>
              <Typography
                variant="subtitle1"
                sx={{ fontSize: "1.5rem", marginBottom: "1rem" }}
                gutterBottom
              >
                Effortlessly Manage Your Prescriptions, Track Your Health Data,
                and Stay Healthy with Our Easy-to-Use App
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}
              >
                Take Control of Your Health Journey with EMpowR: Our at Home
                Electronic Medical Record Streamlines Medication Management,
                Providing Peace of Mind and Better Health Outcomes.
              </Typography>
              
              <Typography
                variant="h6"
                color="primary"
                sx={{ marginTop: "1rem" }}
              >
                Create an Account to Get Started Today
              </Typography>
            </Paper>
            </Grid>
          </Grid>
          <Grid item xs={4.5}>
            <Container sx={{ backgroundColor: "#42a5f5", padding: "2rem" }}>
              <LoginForm />
            </Container>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default LandingPage;
