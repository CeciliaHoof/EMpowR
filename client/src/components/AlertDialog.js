import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

function AlertDialog({ alerts, open, setOpen }) {
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);

  console.log(alerts[currentAlertIndex].severity);

  const handleClose = () => {
    if (currentAlertIndex < alerts.length - 1) {
      setCurrentAlertIndex(currentAlertIndex + 1);
    } else {
      setOpen(false);
    }
  };

  //   const handleOpen = () => {
  //     setOpen(true);
  //   };

  return (
    <>
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle style={{ backgroundColor: alerts[currentAlertIndex].severity }}>
            Health Metric Alert
          </DialogTitle>
          <DialogContent>
            {alerts[currentAlertIndex].health_metric.metric_type.metric_type}: {alerts[currentAlertIndex].health_metric.content} {alerts[currentAlertIndex].health_metric.metric_type.units}
          </DialogContent>
          <DialogContent style={{ marginTop: '-1rem'}}>
            The vital sign you entered appears to be outside of the
            normal range. Please contact your health care provider, especially
            if you are experiencing any abnormal symptoms.
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Acknowledge</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

export default AlertDialog;
