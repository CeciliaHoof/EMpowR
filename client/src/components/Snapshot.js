import prescription_icon from "../assets/prescription_icon.png";
import health_metric_icon from "../assets/health_metric_icon.png"
import { Card, Image } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

function Snapshot({ num, type }) {
  const navigate = useNavigate()

  function handleClick(){
    type === 'Prescriptions'
      ? navigate(`/prescriptions`)
      : navigate(`/health_metrics`);
  }
  return (
    <Card>
      <Card.Content>
        {type === "Prescriptions" ?
        <Image
            floated="left"
            src = {prescription_icon}
        />:
        <Image
            floated="left"
            src = {health_metric_icon}
        />
        }
        <Card.Header>
        {`You have ${num} ${type.toLowerCase()} saved!`}
        </Card.Header>
        </Card.Content>
        <Card.Content extra style={{textAlign: 'center'}}>
            <span onClick={handleClick}>{`View ${type}`}</span>
        </Card.Content>
      
    </Card>
  );
}

export default Snapshot;
