import { Item, Modal } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import PrescriptionForm from "./PrescriptionForm";

function Medication({ generic_name, brand_names, prescription, id }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleClick() {
    prescription
      ? navigate(`/prescriptions/${id}`)
      : navigate(`/medications/${id}`);
  }
  return (
    <Item>
      <Item.Content>
        <Item.Header>{generic_name}</Item.Header>
        <Item.Meta>{brand_names}</Item.Meta>
        <Item.Extra style={{ textAlign: "right", cursor: "default" }}>
          <span onClick={handleClick}>View Details</span>
          {!prescription && (
            <Modal
              onClose={() => setOpen(false)}
              onOpen={() => setOpen(true)}
              open={open}
              trigger={<span>Add Prescription</span>}
              header={`Enter Prescription Details for ${generic_name}`}
              content={
                <PrescriptionForm close={setOpen} method={"POST"} medId={id} />
              }
              style={{ textAlign: "center" }}
            />
          )}
        </Item.Extra>
      </Item.Content>
    </Item>
  );
}

export default Medication;
