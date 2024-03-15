import { useContext, useState } from "react";
import styled from "styled-components";
import { Segment, Item } from "semantic-ui-react";
import { PrescriptionsContext } from "../context/prescriptions";
import MedicationSearch from "../components/MedicationSearch";
import Medication from "../components/Medication";

function Prescriptions() {
  const { prescriptions } = useContext(PrescriptionsContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("generic");

  if(!prescriptions){
    return <h1>Loading</h1>
  }

  const prescriptionsDisplay = prescriptions
    .filter((script) => {
      if (searchBy === "generic") {
        return script.medication.generic_name.toUpperCase().includes(searchQuery.toUpperCase());
      } else if (searchBy === "brand") {
        return script.medication.brand_name.toUpperCase().includes(searchQuery.toUpperCase());
      } else {
        return script
      }
    })
    .map((script) => (
      <Medication
        key={script.id}
        generic_name={script.medication.generic_name}
        brand_name={script.medication.brand_name}
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
    <Container>
      <SearchContainer>
        <MedicationSearch
          onSearch={handleSearch}
          searchFor={searchQuery}
          onSearchBySelection={handleSearchBy}
          searchBy={searchBy}
          prescriptions={true}
        />
      </SearchContainer>
      <Segment style={{ height: "100%", width: "100%", overflowY: "auto" }}>
        <Item.Group divided>{prescriptionsDisplay}</Item.Group>
      </Segment>
    </Container>
  );
}

export default Prescriptions;

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
