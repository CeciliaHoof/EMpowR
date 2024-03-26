import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Card, CardContent, IconButton, Container, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from "@mui/material/styles";
import { PrescriptionsContext } from "../context/prescriptions";
import HealthMetricContainer from "./HealthMetricContainer";
import PrescriptionForm from "./PrescriptionForm";

function PrescriptionDetails({ setSnackbar }) {
  const { id } = useParams();
  const { prescriptions, setPrescriptions } = useContext(PrescriptionsContext);

  const [prescription, setPrescription] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  const { medication, route, dosage, frequency } = prescription;

  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    fetch(`/prescriptions/${id}`)
      .then((resp) => resp.json())
      .then((data) => {
        setPrescription(data);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  function handleEdit(updatedScript){
    setPrescription(updatedScript)
    setSnackbar("Prescription Successfully Updated")
  }

  function handleDelete() {
    const updatedPrescriptions = prescriptions.filter(
      (script) => script.id !== prescription.id
    );
    setPrescriptions(updatedPrescriptions);
    setSnackbar("Prescription Successfully Deleted.");
  }

  function handleClick() {
    fetch(`/prescriptions/${id}`, {
      method: "DELETE",
    })
      .then((resp) => {
        if (resp.ok) {
          handleDelete();
          navigate("/prescriptions");
          console.log("Deleted Prescription Successfully");
        } else {
          console.error("Failed to delete care.");
        }
      })
      .catch((error) => {
        console.error("error while deleting care", error);
      });
  }

  return (
    <Container sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Container
        sx={{
          width: '80%',
          marginBottom: '2rem'
        }}
      >
        <Card sx={{ backgroundColor: theme.palette.primary.light, borderRadius: 0 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {medication.generic_name}
            </Typography>
            <Typography color="textSecondary">
              {medication.brand_names}
            </Typography>
            <div style={{ display: "flex", gap: theme.spacing(1), justifyContent: "right"}}>
            <IconButton
              size="small"
              floated='right'
              onClick={() => setFormOpen(true)}
              aria-label="Edit Prescription"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              floated='right'
              onClick={handleClick}
              aria-label="Delete Prescription"
            >
              <DeleteIcon />
            </IconButton>
            </div>
            <Container sx={{backgroundColor: 'white'}}>
            <Typography color="textSecondary" gutterBottom>
              Prescription Details
            </Typography>

            <Container> 
              <p style={{ display: "inline-block", marginRight: "2em" }}>
                <strong>Route: </strong>
                {route}
              </p>
              <p style={{ display: "inline-block" }}>
                <strong>Dosage: </strong>
                {dosage}
              </p>
            </Container>
            <Container>
              <p style={{ display: "inline-block", marginRight: "2em" }}>
                <strong>Frequency: </strong>
                {frequency}
              </p>
            </Container>
            </Container>
          </CardContent>
        </Card>

      </Container>
      {formOpen && (
        <PrescriptionForm
          close={setFormOpen}
          onEdit={handleEdit}
          prescription={prescription}
          method={"PATCH"}
        />
      )}
      <HealthMetricContainer script={medication.generic_name} />
    </Container>
  );
}

export default PrescriptionDetails;
