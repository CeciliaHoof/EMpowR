import { useContext, useState, useEffect } from "react";
import { Container, IconButton, Tooltip, Snackbar, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import HealthMetricContainer from "../components/HealthMetricContainer";
import HealthMetricForm from "../components/HealthMetricForm";
import HealthMetricFilter from "../components/HealthMetricFilter";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import HealingIcon from '@mui/icons-material/Healing';
import { HealthMetricsContext } from "../context/healthMetrics";

function HealthMetrics() {
  const { healthMetrics, setHealthMetrics } = useContext(HealthMetricsContext);
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState("");
  const [selectedMetricType, setSelectedMetricType] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(moment());
  const [openSnackBar, setOpenSnackBar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  const theme = useTheme();

  useEffect(() => {
    if (healthMetrics.length > 0) {
      setSelectedDate(moment(healthMetrics[0].time_taken));
    } else {
      setSelectedDate(moment());
    }
  }, [healthMetrics]);

  function onAddMetric(metricsList) {
    setHealthMetrics([...healthMetrics, ...metricsList]);
    metricsList.forEach((metric) =>
      setOpenSnackBar(true)
    );
  }

  function handleClick(string) {
    setOpen(true);
    setFormType(string);
  }

  function handleClose(event, reason){
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackBar(false);
  };

  function handleSnackBar(){
    setOpenSnackBar(true)
  }

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <>
    <Container sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Container
        sx={{
          textAlign: "center",
          backgroundColor: theme.palette.primary.light,
          padding: "1rem 0.5rem 2rem",
          width: "80%",
        }}
      >
        <HealthMetricFilter
          filterMetric={selectedMetricType}
          onMetricChange={setSelectedMetricType}
          filterDate={selectedDate}
          onDateChange={setSelectedDate}
          filterPrescription={selectedPrescription}
          onPrescriptionChange={setSelectedPrescription}
        />
      </Container>
      <Container
        sx={{ width: "100%", margin: "1rem -2rem -1.4rem 2rem"}}
      >
        <Tooltip title="Record Other Symptoms">
          <IconButton
            onClick={() => handleClick("symptoms")}
            sx={{ float: "right" }}
          >
            <HealingIcon fontSize="large" sx={{color: theme.palette.primary.light}}/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Record taking a Prescription">
          <IconButton
            onClick={() => handleClick("prescription")}
            sx={{ float: "right" }}
          >
            <LocalPharmacyIcon fontSize="large" sx={{color: theme.palette.primary.main}}/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Record Vital Signs, Pain Level, Blood Glucose and Weight">
          <IconButton
            onClick={() => handleClick("vitals")}
            sx={{ float: "right" }}
          >
            <MonitorHeartIcon fontSize="large" sx={{color: theme.palette.primary.dark}}/>
          </IconButton>
        </Tooltip>
      </Container>
      {open && (
        <HealthMetricForm
          hideForm={setOpen}
          addMetric={onAddMetric}
          method={"POST"}
          formType={formType}
          successMessage={setSnackbarMessage}
          showSnackBar={handleSnackBar}
        />
      )}
      <HealthMetricContainer
        filterMetricType={selectedMetricType}
        filterDate={selectedDate}
        filterPrescription={selectedPrescription}
        successMessage={setSnackbarMessage}
        showSnackBar={handleSnackBar}
      />
    </Container>
    <Snackbar
    open={openSnackBar}
    autoHideDuration={5000}
    onClose={handleClose}
    action={action}
  >
    <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
      {snackbarMessage}
    </Alert>
  </Snackbar>
  </>
  );
}

export default HealthMetrics;
