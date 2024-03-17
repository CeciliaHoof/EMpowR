import { useState, useEffect } from "react";
import styled from "styled-components";
import { Item, Segment } from "semantic-ui-react";

import MedicationSearch from "../components/MedicationSearch";
import Medication from "../components/Medication";

function Medications() {
  const [medications, setMedications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("generic");

  useEffect(() => {
    fetch("/medications")
      .then((resp) => resp.json())
      .then((data) => setMedications(data));
  }, []);

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
    <Container>
      <SearchContainer>
        <MedicationSearch
          onSearch={handleSearch}
          searchFor={searchQuery}
          onSearchBySelection={handleSearchBy}
          searchBy={searchBy}
        />
      </SearchContainer>
      <Segment style={{ height: "100%", width: "100%", overflowY: "auto" }}>
        <Item.Group divided>{medicationsDisplay}</Item.Group>
      </Segment>
    </Container>
  );
}

export default Medications;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const SearchContainer = styled.div`
  text-align: center;
  height: 25%;
  background-color: #b6cbe0;
`;
