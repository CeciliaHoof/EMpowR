import { Item } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

function Medication({ generic_name, brand_names, prescription, id }) {
  const navigate = useNavigate();

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
        </Item.Extra>
      </Item.Content>
    </Item>
  );
}

export default Medication;
