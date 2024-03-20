import { useContext, useState } from "react";
import styled from "styled-components";
import { Segment, Item, Button } from "semantic-ui-react";
import { PrescriptionsContext } from "../context/prescriptions";
import MedicationSearch from "../components/MedicationSearch";
import Medication from "../components/Medication";
import PrescriptionForm from "../components/PrescriptionForm";

function Prescriptions() {
  const { prescriptions } = useContext(PrescriptionsContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("generic");
  const [formOpen, setFormOpen] = useState(false);

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
      {formOpen ? (
        <PrescriptionForm method={"POST"} close={setFormOpen} />
      ) : (
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <Button
            size="mini"
            onClick={() => setFormOpen(true)}
            content="Add Prescription"
          />
        </div>
      )}
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
  margin: 3rem 1rem 2rem 1rem;
  padding: 2rem 0.5rem 1rem;
`;
