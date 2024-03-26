import { useContext, useState } from "react";
import {
  Button,
  Container,
  Box,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { PrescriptionsContext } from "../context/prescriptions";
import MedicationSearch from "../components/MedicationSearch";
import Medication from "../components/Medication";
import PrescriptionForm from "../components/PrescriptionForm";

function Prescriptions({ setSnackbar }) {
  const { prescriptions } = useContext(PrescriptionsContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("generic");
  const [formOpen, setFormOpen] = useState(false);

  const theme = useTheme();

  if (!prescriptions) {
    return <h1>Loading</h1>;
  }

  const prescriptionsDisplay = prescriptions
    .filter((script) => {
      if (searchBy === "generic") {
        return script.medication.generic_name
          .toUpperCase()
          .includes(searchQuery.toUpperCase());
      } else if (searchBy === "brand") {
        return script.medication.brand_names
          .toUpperCase()
          .includes(searchQuery.toUpperCase());
      } else {
        return script;
      }
    })
    .map((script) => (
      <Medication
        key={script.id}
        generic_name={script.medication.generic_name}
        brand_names={script.medication.brand_names}
        prescription={true}
        id={script.id}
      />
    ));

  function handleSearch(string) {
    setSearchQuery(string);
  }

  function handleSearchBy(string) {
    setSearchBy(string);
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
            padding: "2rem 0.5rem 1rem",
            width: "80%",
            margin: "auto",
          }}
        >
          <MedicationSearch
            onSearch={handleSearch}
            searchFor={searchQuery}
            onSearchBySelection={handleSearchBy}
            searchBy={searchBy}
            prescriptions={true}
          />
        </Container>
        {formOpen ? (
          <PrescriptionForm
            method={"POST"}
            close={setFormOpen}
            setSnackbar={setSnackbar}
          />
        ) : (
          <Container sx={{ textAlign: "center", margin: "1rem 0" }}>
            <Button
              size="small"
              onClick={() => setFormOpen(true)}
              variant="contained"
              sx={{ backgroundColor: theme.palette.primary.dark }}
            >
              Add Prescription
            </Button>
          </Container>
        )}
        <Box sx={{ height: "33rem", width: "100%", overflowY: "scroll" }}>
          <Grid container>{prescriptionsDisplay}</Grid>
        </Box>
      </Container>
    </>
  );
}

export default Prescriptions;
