import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Item, Icon, Popup } from "semantic-ui-react";
import { toast } from "react-toastify";
import { PrescriptionsContext } from "../context/prescriptions";
import HealthMetricContainer from "./HealthMetricContainer";
import PrescriptionForm from "./PrescriptionForm";

function PrescriptionDetails() {
  const { id } = useParams();
  const { prescriptions, setPrescriptions } = useContext(PrescriptionsContext);

  const [prescription, setPrescription] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  const { medication, route, dosage, frequency } = prescription;

  const navigate = useNavigate();

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
  function handleDelete() {
    const updatedPrescriptions = prescriptions.filter(
      (script) => script.id !== prescription.id
    );
    setPrescriptions(updatedPrescriptions);
    toast.success("Prescription Successfully Deleted.")
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
    <Container>
      <DetailContainer>
        <Item.Group>
          <Item>
            <Item.Content>
              <Item.Header>
                {medication.generic_name}: {medication.brand_names}
              </Item.Header>
              <Item.Meta>Prescription Details</Item.Meta>
              <Item.Description>
                <div>
                  <p style={{ display: "inline-block", marginRight: "2em" }}>
                    <strong>Route: </strong>
                    {route}
                  </p>
                  <p style={{ display: "inline-block" }}>
                    <strong>Dosage: </strong>
                    {dosage}
                  </p>
                </div>
                <div>
                  <p style={{ display: "inline-block", marginRight: "2em" }}>
                    <strong>Frequency: </strong>
                    {frequency}
                  </p>
                </div>
              </Item.Description>
              <Item.Extra>
                <Popup
                  size="tiny"
                  content="Edit Prescription"
                  trigger={
                    <Icon name="pencil" onClick={() => setFormOpen(true)} />
                  }
                />
                <Popup
                  size="tiny"
                  content="Delete Prescription"
                  trigger={
                    <Icon name="trash" onClick={handleClick} />
                  }
                />
              </Item.Extra>
            </Item.Content>
          </Item>
        </Item.Group>
      </DetailContainer>
      {formOpen && (
        <PrescriptionForm
          close={setFormOpen}
          onEdit={setPrescription}
          prescription={prescription}
          method={"PATCH"}
        />
      )}
      <HealthMetricContainer script={medication.generic_name} />
    </Container>
  );
}
export default PrescriptionDetails;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const DetailContainer = styled.div`
  height: 25%;
  background-color: #b6cbe0;
  margin: 3rem 1rem 2rem 1rem;
  padding: 0.5rem;
`;
