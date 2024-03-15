import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Item, Modal, Icon } from "semantic-ui-react";
import { PrescriptionsContext } from "../context/prescriptions";
import HealthMetricContainer from "./HealthMetricContainer";
import PrescriptionForm from "./PrescriptionForm";


function PrescriptionDetails() {
  const { id } = useParams();
  const { prescriptions, setPrescriptions } = useContext(PrescriptionsContext)

  const [prescription, setPrescription] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const { medication, route, dosage, time_of_day, frequency, prescribed_on } =
    prescription;

    const navigate = useNavigate()

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
  function handleDelete(){
    const updatedPrescriptions = prescriptions.filter(script => script.id !== prescription.id)
    setPrescriptions(updatedPrescriptions)
  }
  function handleClick(){
    fetch(`/prescriptions/${id}`,{
        method: 'DELETE',
    })
    .then(resp =>{
        if (resp.ok){
            handleDelete()
            navigate('/prescriptions')
            console.log("Deleted Prescription Successfully")
        } else {
            console.error("Failed to delete care.")
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
                {medication.generic_name}: {medication.brand_name}
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
                  <p style={{ display: "inline-block" }}>
                    <strong>Time of Day: </strong> {time_of_day}
                  </p>
                </div>
                {prescribed_on && (
                  <p>
                    <strong>Prescribed On: </strong> {prescribed_on}
                  </p>
                )}
              </Item.Description>
              <Item.Extra>
                <Modal
                  onClose={() => setOpen(false)}
                  onOpen={() => setOpen(true)}
                  open={open}
                  trigger={<Icon name="pencil" />}
                  header="Enter Prescription Details"
                  content={
                    <PrescriptionForm
                      close={setOpen}
                      onEdit={setPrescription}
                      prescription={prescription}
                      method={"PATCH"}
                    />
                  }
                  style={{ textAlign: "center" }}
                />
                <Icon name="trash" onClick={handleClick} />
              </Item.Extra>
            </Item.Content>
          </Item>
        </Item.Group>
      </DetailContainer>
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
  padding: 1em;
  margin-left: -1vw;
`;
