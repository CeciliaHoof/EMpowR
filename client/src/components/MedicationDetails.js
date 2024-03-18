import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Item, List, Segment, Tab } from "semantic-ui-react";
import { UserContext } from "../context/user";

function MedicationDetails() {
  const { user } = useContext(UserContext);
  const { id } = useParams();

  const [medication, setMedication] = useState({});

  const {
    generic_name,
    brand_names,
    drug_class,
    box_warning,
    indications,
    dosages,
    contraindications_and_cautions,
    adverse_effects,
    administration,
  } = medication;
  useEffect(() => {
    fetch(`/medications/${id}`)
      .then((resp) => resp.json())
      .then((data) => setMedication(data));
  }, [id, user]);

  if (!generic_name || !dosages) {
    return <h1>Loading</h1>;
  }

  const brandNamesArray = brand_names.split(", ");
  const brandNamesDisplay = brandNamesArray
    .slice(0, 10)
    .map((brand) => <List.Item key={brand}>{brand}</List.Item>);

  const filteredIndications = indications
    .split('. ')
    .filter((indication) => {return !indication.includes("Orphan") && indication !== ""})
    .map((indication) => <List.Item key={indication}>{indication}</List.Item>);

    function splitDosages(inputString) {
      const parts = inputString.split('! ');
      return parts.map((part) => part.trim());
    }

    function groupDosages(parts) {
      const groups = [];
      let currentGroup = "";

      for (const part of parts) {
        if (part.includes(":")) {
          if (currentGroup) {
            groups.push(currentGroup.trim());
          }
          currentGroup = part;
        } else {
          currentGroup += `, ${part}`;
        }
      }

      if (currentGroup) {
        groups.push(currentGroup.trim());
      }

      return groups;
    }

    function createDosagesLists(groupedParts) {
      return groupedParts.map((group) => {
        const [medication, dosages] = group.split(":");
        console.log(medication, dosages)
        const dosageItems = dosages
          .split(",")
          .map((dosage) => (
            <List.Item key={`${dosage.trim()}${medication}`}>
              {dosage.trim()}
            </List.Item>
          ));
        return (
          <div key={medication} style={{ marginBottom: "1em" }}>
            {medication}:<List bulleted>{dosageItems}</List>
          </div>
        );
      });
    }
    const doses = splitDosages(dosages);
    const groupedDosages = groupDosages(doses.slice(0, -1));
    const dosageDisplay = createDosagesLists(groupedDosages);

  let adminDisplay;
  if (administration) {
    adminDisplay = administration
      .split(". ")
      .map((instruction) => (
        <List.Item key={instruction}>{instruction}</List.Item>
      ));
  }

  const contraindicationDisplay = contraindications_and_cautions
    .split(". ")
    .map((contraindication) => (
      <List.Item key={contraindication}>{contraindication}</List.Item>
    ));

  const adverseEffects = adverse_effects
    .split(". ")
    .filter((effect) => effect !== "")
    .map((effect) => <List.Item key={effect}>{effect}</List.Item>);

  let panes = [
    {
      menuItem: "Dosage",
      render: () => (
        <Tab.Pane attached={false}>
          <div style={{ marginBottom: "0.5em", fontSize: "1.2rem" }}>
            <strong>Dosage Forms:</strong>
          </div>
          {dosageDisplay}
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Contraindications",
      render: () => (
        <Tab.Pane attached={false}>
          <div style={{ marginBottom: "0.5em", fontSize: "1.2rem" }}>
            <strong>Contraindications and Precautions:</strong>
          </div>
          <List>{contraindicationDisplay}</List>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Adverse Effects",
      render: () => (
        <Tab.Pane attached={false}>
          <div style={{ marginBottom: "0.5em", fontSize: "1.2rem" }}>
            <strong>Adverse Effects:</strong>
          </div>
          <List bulleted>{adverseEffects}</List>
        </Tab.Pane>
      ),
    },
  ];
  {
    administration
      ? panes.splice(1, 0, {
          menuItem: "Administration",
          render: () => (
            <Tab.Pane attached={false}>
              <div style={{ marginBottom: "0.5em", fontSize: "1.2rem" }}>
                <strong>Administration Instructions:</strong>
              </div>
              <List>{adminDisplay}</List>
            </Tab.Pane>
          ),
        })
      : (panes = panes);
  }

  return (
    <Container>
      <DetailContainer>
        <Item.Group>
          <Item>
            <Item.Content>
              <Item.Header>{generic_name}</Item.Header>
              <Item.Meta>Medication Details</Item.Meta>
              <Item.Description>
                <div>
                  <p
                    style={{
                      fontSize: "1rem",
                      display: "inline-block",
                      marginRight: "0.2em",
                    }}
                  >
                    <strong>Common Brand Names: </strong>
                  </p>
                  <List bulleted horizontal>
                    {brandNamesDisplay}
                  </List>
                </div>
                <p
                  style={{
                    fontSize: "1rem",
                  }}
                >
                  <strong>Drug Class: </strong>
                  {drug_class}
                </p>
                <p
                  style={{
                    display: "inline-block",
                    fontSize: "1rem",
                    marginRight: "0.2em",
                  }}
                >
                  <strong>Indications and Uses: </strong>
                </p>
                <List bulleted horizontal>
                  {filteredIndications}
                </List>
              </Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </DetailContainer>
      <Segment style={{ height: "100%", width: "100%", overflowY: "auto" }}>
        <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
      </Segment>
      {box_warning && (
        <p
          style={{
            color: "red",
            marginBottom: "1em",
            paddingLeft: "0.5em",
            borderLeft: "0.5em solid red",
          }}
        >
          <strong>BOX WARNING: </strong> {box_warning}
        </p>
      )}
    </Container>
  );
}

export default MedicationDetails;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const DetailContainer = styled.div`
  background-color: #b6cbe0;
  padding: 1em;
  margin-left: -1vw;
`;
