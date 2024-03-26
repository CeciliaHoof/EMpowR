import { useContext } from "react";
import { Typography, Grid, Card, CardContent } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { CurrentPageContext } from "../context/currentPage";

function Medication({ generic_name, brand_names, prescription, id }) {
  const { setCurrentPage } = useContext(CurrentPageContext);
  const navigate = useNavigate();
  const theme = useTheme();

  function handleClick() {
    if (prescription) {
      navigate(`/prescriptions/${id}`);
      setCurrentPage("Prescription Details");
    } else {
      navigate(`/medications/${id}`);
      setCurrentPage("Medication Details");
    }
  }

  return (
    <Grid item xs={12}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6">{generic_name}</Typography>
          <Typography variant="body2" color="textSecondary">
            {brand_names}
          </Typography>
          <div style={{ textAlign: "right", cursor: "pointer" }}>
            <Typography
              variant="body2"
              onClick={handleClick}
              sx={{ color: theme.palette.primary.dark }}
            >
              View Details
            </Typography>
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default Medication;
