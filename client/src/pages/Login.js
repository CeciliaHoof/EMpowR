import { CssBaseline, AppBar, Typography, Grid, Paper } from "@mui/material";
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
          alignContent: "center"
        }}
      >
        <Typography variant="h5" component="div" noWrap>
          EMpowR
        </Typography>
      </AppBar>
      <Grid container spacing={2} justifyContent="center" sx={{width: '100%', marginTop: '6rem', marginLeft: 0, marginRight:'2rem'}}>
        <Grid item xs={8} sx={{padding: '2rem'}}>
          <Paper sx={{padding: '2rem', textAlign: 'center'}}>
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
            <Typography
              variant="subtitle1"
              sx={{ fontSize: "1.5rem", marginBottom: "1rem" }}
              gutterBottom
            >
              Effortlessly Manage Your Medications, Track Your Health Data, and
              Stay Healthy with Our Easy-to-Use App
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
              Create an Account and Get Started Today
            </Typography>
          </Paper>
          </Grid>
          <Grid item xs={4} sx={{padding: '2rem', backgroundColor:"#42a5f5"}}>
            <LoginForm />
          </Grid>
        

      </Grid>
      {/* <Grid
        container
        spacing={4}
      >
        <Grid item xs={6}>
          <Paper sx={{padding: '2rem', textAlign: 'center', justifyContent:'center', alignItems:'center'}}>
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
            <Typography
              variant="subtitle1"
              sx={{ fontSize: "1.5rem", marginBottom: "1rem" }}
              gutterBottom
            >
              Effortlessly Manage Your Medications, Track Your Health Data, and
              Stay Healthy with Our Easy-to-Use App
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
              Create an Account and Get Started Today
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4} sx={{ backgroundColor: "#42a5f5", padding: '1rem' }}>
            <LoginForm />
        </Grid>
      </Grid> */}
    </>
  );
}

export default LandingPage;
