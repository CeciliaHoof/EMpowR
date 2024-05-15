import { useState, useContext } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { AlertsContext } from "../context/alerts";

function AlertDialog({ newAlerts, open, setOpen }) {
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const { alerts, setAlerts } = useContext(AlertsContext)

  let currAlert = newAlerts[currentAlertIndex]

  function handleClose(acknowledged) {
    if (currentAlertIndex < newAlerts.length - 1) {
      setCurrentAlertIndex(currentAlertIndex + 1);
    } else {
      setOpen(false);
    }

    if (acknowledged) {
      fetch(`/alerts/${currAlert.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: "acknowledged" }),
      }).then((resp) => {
        if (resp.ok) {
          resp.json().then((data) => {
            handleAcknowledged(data)
          });
        } else {
          resp.json().then((data) => {
            console.error(data)
          });
        }
      })
    }
  }

  function handleAcknowledged(alert){
    const updatedAlerts = alerts.filter((a) => a.id !== alert.id);
    setAlerts([...updatedAlerts, alert]);
  }

  return (
    <>
      <div>
        <Dialog open={open} onClose={() => handleClose(false)}>
          <DialogTitle
            style={{ backgroundColor: currAlert.severity }}
          >
            Health Metric Alert
          </DialogTitle>
          <DialogContent>
            {currAlert.health_metric.metric_type.metric_type}:{" "}
            {currAlert.health_metric.content}{" "}
            {currAlert.health_metric.metric_type.units}
          </DialogContent>
          <DialogContent style={{ marginTop: "-1rem" }}>
            The vital sign you entered appears to be outside of the normal
            range. Please contact your health care provider, especially if you
            are experiencing any abnormal symptoms.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose(true)}>Acknowledge</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

export default AlertDialog;
