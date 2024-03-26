import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";

import {
  Card,
  CardContent,
  Container,
  Typography,
  List,
  ListItem,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import { UserContext } from "../context/user";

function MedicationDetails() {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const theme = useTheme();

  const [medication, setMedication] = useState({});
  const [value, setValue] = useState(0);

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
  const brandNamesDisplay = brandNamesArray.slice(0, 10).map((brand, index) => (
    <>
      <span>{brand}</span>
      {index < brandNamesArray.length - 2 && (
        <Box component="span" sx={{ display: "inline-block", mx: "2px" }}>
          •
        </Box>
      )}
    </>
  ));

  const filteredIndications = indications.split(". ").filter((indication) => {
    return !indication.includes("Orphan") && indication !== "";
  });
  const indicationsDisplay = filteredIndications.map((indication, index) => (
    <>
      <span>{indication}</span>
      {index < filteredIndications.length - 1 && (
        <Box component="span" sx={{ display: "inline-block", mx: "2px" }}>
          •
        </Box>
      )}
    </>
  ));

  function splitDosages(inputString) {
    const parts = inputString.split("! ");
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
      const dosageItems = dosages
        .split(",")
        .map((dosage) => (
          <ListItem key={`${dosage.trim()}${medication}`}>
            {dosage.trim()}
          </ListItem>
        ));
      return (
        <div key={medication} style={{ marginBottom: "1em" }}>
          {medication}:<List>{dosageItems}</List>
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
        <ListItem key={instruction}>{instruction}</ListItem>
      ));
  }

  const contraindicationDisplay = contraindications_and_cautions
    .split(". ")
    .map((contraindication) => (
      <ListItem key={contraindication}>{contraindication}</ListItem>
    ));

  const adverseEffects = adverse_effects
    .split(". ")
    .filter((effect) => effect !== "")
    .map((effect) => <ListItem key={effect}>{effect}</ListItem>);

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `med-detail-tab-${index}`,
      "aria-controls": `med-detail-tabpanel-${index}`,
    };
  }

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Container
        sx={{
          width: "80%",
          marginBottom: "1rem",
        }}
      >
        <Card
          sx={{ backgroundColor: theme.palette.primary.light, borderRadius: 0 }}
        >
          <CardContent>
            <Typography variant="h5" component="div">
              {generic_name}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              {brandNamesDisplay}
            </Typography>
            <Container sx={{ backgroundColor: "white" }}>
              <Typography color="textSecondary" gutterBottom>
                Medication Details
              </Typography>

              <Container>
                <p>
                  <strong>Drug Class: </strong>
                  {drug_class}
                </p>
                <p>
                  <strong>Indications and Uses: </strong>
                  {indicationsDisplay}
                </p>
              </Container>
            </Container>
          </CardContent>
        </Card>
      </Container>
      <Container
        sx={{
          height: "33rem",
          width: "100%",
          overflowY: "auto",
          paddingLeft: "calc(100vw - 100%)",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="medication detail tabs"
            >
              <Tab label="Dosage" {...a11yProps(0)} />
              {administration && (
                <Tab label="Administration" {...a11yProps(1)} />
              )}
              <Tab label="Contraindications" {...a11yProps(2)} />
              <Tab label="Adverse Effects" {...a11yProps(3)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <div style={{ marginBottom: "0.5em", fontSize: "1.2rem" }}>
              <strong>Dosage Forms:</strong>
            </div>
            {dosageDisplay}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <div style={{ marginBottom: "0.5em", fontSize: "1.2rem" }}>
              <strong>Administration Instructions:</strong>
            </div>
            <List>{adminDisplay}</List>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <div style={{ marginBottom: "0.5em", fontSize: "1.2rem" }}>
              <strong>Contraindications and Precautions:</strong>
            </div>
            <List>{contraindicationDisplay}</List>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <div style={{ marginBottom: "0.5em", fontSize: "1.2rem" }}>
              <strong>Adverse Effects:</strong>
            </div>
            <List bulleted>{adverseEffects}</List>
          </CustomTabPanel>
        </Box>
      </Container>
      {box_warning && (
        <Container
          sx={{
            color: "red",
            margin: "1em 0",
            paddingLeft: "calc(100vw - 100%)",
            borderLeft: "0.5em solid red",
            maxHeight: "5rem",
            overflowY: "auto",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <strong>BOX WARNING: </strong> {box_warning}
          </Box>
        </Container>
      )}
    </Container>
  );
}

export default MedicationDetails;
