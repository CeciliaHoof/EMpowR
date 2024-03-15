import { Item } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

function Medication({ generic_name, brand_name, id }) {
    const navigate = useNavigate()

    function handleClick(){
        navigate(`/medications/${id}`)
    }
  return (
    <Item>
      <Item.Content>
        <Item.Header>{generic_name}</Item.Header>
        <Item.Meta>{brand_name}</Item.Meta>
        <Item.Extra style={{ textAlign: "right", cursor: "default" }}>
          <span onClick={handleClick}>View Details</span>
          <span>Add Prescription</span>
        </Item.Extra>
      </Item.Content>
    </Item>
  );
}

export default Medication;
