import { useState, useContext } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import HealingIcon from "@mui/icons-material/Healing";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { HealthMetricsContext } from "../context/healthMetrics";
import HealthMetricForm from "./HealthMetricForm";

function HealthMetric({ metric, handleSnackBar }) {
  const { healthMetrics, setHealthMetrics } = useContext(HealthMetricsContext);
  const { comment, metric_type, time_taken, content } = metric;
  const [isEditing, setIsEditing] = useState(false);
  const theme = useTheme();

  function handleEdit(metric) {
    const updatedMetrics = healthMetrics.filter((hm) => hm.id !== metric.id);
    setHealthMetrics([...updatedMetrics, metric]);
    handleSnackBar('edit')
  }

  function handleDelete(metric) {
    const updatedMetrics = healthMetrics.filter((hm) => hm.id !== metric.id);
    setHealthMetrics(updatedMetrics);
    handleSnackBar('delete')
  }

  function handleClick() {
    fetch(`/health_metrics/${metric.id}`, {
      method: "DELETE",
    })
      .then((resp) => {
        if (resp.ok) {
          handleDelete(metric);
        } else {
          console.error("Failed to delete care.");
        }
      })
      .catch((error) => {
        console.error("error while deleting care", error);
      });
  }

  const moment = require("moment");
  const formattedDate = moment(time_taken).format("MM-DD-YYYY hh:mm A");

  let metricIcon;
  if (metric_type.id <= 8) {
    metricIcon = (
      <MonitorHeartIcon
        fontSize="large"
        sx={{
          color: theme.palette.primary.dark,
          display: "block",
          margin: "auto",
          maxWidth: "100%",
          maxHeight: "100%",
          float: "left",
        }}
      />
    );
  } else if (metric_type.id === 9) {
    metricIcon = (
      <LocalPharmacyIcon
        fontSize="large"
        sx={{
          color: theme.palette.primary.main,
          display: "block",
          margin: "auto",
          maxWidth: "100%",
          maxHeight: "100%",
          float: "left",
        }}
      />
    );
  } else {
    metricIcon = (
      <HealingIcon
        fontSize="large"
        sx={{
          color: theme.palette.primary.light,
          display: "block",
          margin: "auto",
          maxWidth: "100%",
          maxHeight: "100%",
          float: "left",
        }}
      />
    );
  }

  return (
    <>
      <Grid
        container
        spacing={2}
        alignContent={"center"}
        justifyContent={"flex-start"}
      >
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container alignItems={"flex-start"} spacing={1}>
                <Grid item>{metricIcon}</Grid>
                {!isEditing ? (
                  <Grid container direction="column" item xs>
                    <Grid item xs>
                      <Typography variant="h6" component="span">
                        {metric_type.units
                          ? `${metric_type.metric_type}: ${content} ${metric_type.units}.`
                          : `${metric_type.metric_type}: ${content}`}
                      </Typography>
                      <Typography
                        variant="body1"
                        component="span"
                        sx={{ marginLeft: "1rem" }}
                      >
                        {formattedDate}
                      </Typography>

                      {comment && (
                        <Typography variant="body1">
                          <strong>Comment: </strong>
                          {comment}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item>
                      <IconButton
                        size="small"
                        onClick={() => setIsEditing(true)}
                        aria-label="Edit Prescription"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        floated="right"
                        onClick={handleClick}
                        aria-label="Delete Prescription"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid item xs={12}>
                    <HealthMetricForm
                      hideForm={setIsEditing}
                      onEdit={handleEdit}
                      metric={metric}
                      method="PATCH"
                      data-html2canvas-ignore="true"
                    />
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default HealthMetric;
