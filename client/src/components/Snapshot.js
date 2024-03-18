import prescription_icon from "../assets/prescription_icon.png";
import health_metric_icon from "../assets/health_metric_icon.png"
import { Button, Card, Image } from "semantic-ui-react";

function Snapshot({ num, type }) {
  return (
    <Card>
      <Card.Content>
        {type === "prescriptions" ?
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
        {`You have ${num} ${type} saved!`}
        </Card.Header>
        </Card.Content>
        <Card.Content extra style={{textAlign: 'center'}}>
            <Button>{`View ${type}`}</Button>
        </Card.Content>
      
    </Card>
  );
}

export default Snapshot;
