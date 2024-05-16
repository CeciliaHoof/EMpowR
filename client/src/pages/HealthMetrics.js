import { useContext, useState, useEffect } from "react";
import { Container, IconButton, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import HealthMetricContainer from "../components/HealthMetricContainer";
import HealthMetricForm from "../components/HealthMetricForm";
import HealthMetricFilter from "../components/HealthMetricFilter";
import AlertDialog from "../components/AlertDialog";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import HealingIcon from "@mui/icons-material/Healing";
import { HealthMetricsContext } from "../context/healthMetrics";
import { AlertsContext } from "../context/alerts"

function HealthMetrics({ setSnackbar }) {
  const { healthMetrics, setHealthMetrics } = useContext(HealthMetricsContext);
  const { alerts, setAlerts } = useContext(AlertsContext)

  const [openForm, setOpenForm] = useState(false);
  const [formType, setFormType] = useState("");
  const [selectedMetricType, setSelectedMetricType] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(moment());
  const [newAlerts, setNewAlerts] = useState([]);
  const [dialogueOpen, setDialogueOpen] = useState(false);

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
  }

  function handleClick(string) {
    setOpenForm(true);
    setFormType(string);
  }

  function handleNewAlert(alertArray) {
    setAlerts([...alerts, ...alertArray]);
    setNewAlerts(alertArray);
    setDialogueOpen(true);
  }

  return (
    <>
      <Container
        sx={{ display: "flex", flexDirection: "column", width: "100%" }}
      >
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
        <Container sx={{ width: "100%", marginBottom: "-0.5rem" }}>
          <Tooltip title="Record Other Symptoms">
            <IconButton
              onClick={() => handleClick("symptoms")}
              sx={{ float: "right" }}
            >
              <HealingIcon
                fontSize="large"
                sx={{ color: theme.palette.primary.light }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Record taking a Prescription">
            <IconButton
              onClick={() => handleClick("prescription")}
              sx={{ float: "right" }}
            >
              <LocalPharmacyIcon
                fontSize="large"
                sx={{ color: theme.palette.primary.main }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Record Vital Signs, Pain Level, Blood Glucose and Weight">
            <IconButton
              onClick={() => handleClick("vitals")}
              sx={{ float: "right" }}
            >
              <MonitorHeartIcon
                fontSize="large"
                sx={{ color: theme.palette.primary.dark }}
              />
            </IconButton>
          </Tooltip>
        </Container>
        {openForm && (
          <HealthMetricForm
            hideForm={setOpenForm}
            addMetric={onAddMetric}
            method={"POST"}
            formType={formType}
            setSnackbar={setSnackbar}
            createAlert={handleNewAlert}
          />
        )}
        <HealthMetricContainer
          filterMetricType={selectedMetricType}
          filterDate={selectedDate}
          filterPrescription={selectedPrescription}
          setSnackbar={setSnackbar}
        />
      </Container>
      {dialogueOpen && <AlertDialog
        newAlerts={newAlerts}
        open={dialogueOpen}
        setOpen={setDialogueOpen}
      />}
    </>
  );
}

export default HealthMetrics;
