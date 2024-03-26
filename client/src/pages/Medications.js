import { useState, useContext } from "react";
import { Container } from "@mui/material";
import { useTheme } from "@mui/material/styles"
import MedicationSearch from "../components/MedicationSearch";
import Medication from "../components/Medication";
import { MedicationsContext } from "../context/medications";

function Medications() {
  const { medications } = useContext(MedicationsContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("generic");
  
  const theme = useTheme()

  if (!medications) {
    return <h1>Loading</h1>;
  }

  const medicationsDisplay = medications
  .filter((med) => {
    if (searchBy === "generic") {
      return med.generic_name.toUpperCase().includes(searchQuery.toUpperCase());
    } else if (searchBy === "brand") {
      return med.brand_names.toUpperCase().includes(searchQuery.toUpperCase());
    } else {
      return med
    }
  })
  .map((med) => (
    <Medication
      key={med.id}
      generic_name={med.generic_name}
      brand_names={med.brand_names}
      id={med.id}
    />
  ));

  function handleSearch(string) {
    setSearchQuery(string);
  }

  function handleSearchBy(string) {
    setSearchBy(string);
  }

  return (
    <Container sx={{ display: "flex", flexDirection: "column", width: "100%"}}>
      <Container
        sx={{
          textAlign: "center",
          backgroundColor: theme.palette.primary.light,
          padding: "2rem 0.5rem 1rem",
          width: "80%",
          marginBottom: '2rem',
        }}
      >
        <MedicationSearch
          onSearch={handleSearch}
          searchFor={searchQuery}
          onSearchBySelection={handleSearchBy}
          searchBy={searchBy}
        />
      </Container>
      <Container sx={{ height: "40rem", width: "100%", overflowY: "auto", margin: "0 1rem"}}>
        {medicationsDisplay}
      </Container>
    </Container>
  );
}

export default Medications;

// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   width: 100%;
// `;
// const SearchContainer = styled.div`
//   text-align: center;
//   height: 25%;
//   background-color: #b6cbe0;
//   margin: 3rem 1rem 2rem 1rem;
//   padding: 2rem 0.5rem 1rem;
// `;
