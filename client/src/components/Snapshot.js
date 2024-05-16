import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Divider,
  Typography,
  Grid,
  Badge,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import { CurrentPageContext } from "../context/currentPage";

function Snapshot({ num, type, badge }) {
  const { setCurrentPage } = useContext(CurrentPageContext);
  const navigate = useNavigate();
  const theme = useTheme();

  function handleClick() {
    if(type === "Prescriptions")
      {navigate(`/prescriptions`)} else if (type === "Alerts"){navigate(`/alerts`)}
      else {navigate(`/health_metrics`)};
    setCurrentPage(type);
  }
  return (
    <Card sx={{ width: "100%", height: "100%" }}>
      <CardContent style={{ textAlign: "center" }}>
        <Grid container direction="column" spacing={2}>
          <Grid item xs={6}>
            {type === "Prescriptions" && (
              <LocalPharmacyIcon
                fontSize="large"
                sx={{ color: theme.palette.primary.light }}
              />
            )}{" "}
            {type === "Health Metrics" && (
              <MonitorHeartIcon
                fontSize="large"
                sx={{ color: theme.palette.primary.light }}
              />
            )}
            {type === "Alerts" && (
              <Badge badgeContent={badge.length} color="primary">
                <AddAlertIcon
                  fontSize="large"
                  sx={{ color: theme.palette.primary.light }}
                />
              </Badge>
            )}
          </Grid>
          <Grid item xs={3}>
            <Typography
              variant="h6"
              component="div"
            >{`${num} ${type}`}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Divider sx={{ marginBottom: "0.3rem" }} />
            <Typography
              variant="body2"
              onClick={handleClick}
              style={{ cursor: "pointer" }}
            >
              {`View ${type}`}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default Snapshot;
