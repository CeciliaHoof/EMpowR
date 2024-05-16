import { useState, useContext } from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  alpha,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import CheckIcon from "@mui/icons-material/Check";
import { AlertsContext } from "../context/alerts";

export default function Alert({ alert }) {
  const { alerts, setAlerts } = useContext(AlertsContext);

  const { status, health_metric, severity } = alert;
  const { metric_type, content, time_taken } = health_metric;

  let color;
  severity === "yellow" ? (color = "#ffea00") : (color = "#ff1744");
  const theme = useTheme();

  const moment = require("moment");
  const formattedDate = moment(time_taken).format("MM-DD-YYYY hh:mm A");

  function handleAcknowledged() {
    const updatedAlerts = alerts.filter((a) => a.id !== alert.id);
    fetch(`/alerts/${alert.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "acknowledged" }),
    }).then((resp) => {
      if (resp.ok) {
        resp.json().then((data) => {
          setAlerts([data, ...updatedAlerts]);
        });
      } else {
        resp.json().then((data) => {
          console.error(data);
        });
      }
    });
  }

  return (
    <Grid item xs={12}>
      <Card
        variant="outlined"
        sx={{ width: "100%", backgroundColor: alpha(color, 0.5) }}
      >
        <CardContent>
          <Grid container alignItems={"flex-start"} spacing={1}>
            <Grid item>
              <AddAlertIcon
                sx={{
                  color: theme.palette.primary.light,
                  display: "block",
                  margin: "auto",
                  maxWidth: "100%",
                  maxHeight: "100%",
                  float: "left",
                }}
              />
            </Grid>
            <Grid container direction="column" item xs>
              <Grid item>
                <Typography variant="body1" component="span">
                  {metric_type.units ? (
                    <strong>
                      {metric_type.metric_type}: {content} {metric_type.units}
                    </strong>
                  ) : (
                    <strong>
                      {metric_type.metric_type}: {content}
                    </strong>
                  )}
                </Typography>
                <Typography
                  variant="caption"
                  component="span"
                  sx={{ marginLeft: "0.5rem" }}
                >
                  {formattedDate}
                </Typography>

                {/* {comment && (
                  <Typography variant="body2">
                    <strong>Comment: </strong>
                    {comment}
                  </Typography>
                )} */}
              </Grid>
              <Grid item>
                {status === "unacknowledged" && (
                  <Tooltip title="Acknowledge Alert">
                    <IconButton
                      onClick={handleAcknowledged}
                      aria-label="Edit Prescription"
                      size="small"
                    >
                      <CheckIcon fontSize="medium" />
                    </IconButton>
                  </Tooltip>
                )}

                {/* <IconButton
                  floated="right"
                  onClick={handleClick}
                  aria-label="Delete Prescription"
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton> */}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
}
