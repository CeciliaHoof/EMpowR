import { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { Card, Image, Popup, Tab } from "semantic-ui-react";
import Snapshot from "../components/Snapshot";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HealthMetricContainer from "../components/HealthMetricContainer";
import { HealthMetricsContext } from "../context/healthMetrics";
import { PrescriptionsContext } from "../context/prescriptions";
import HealthMetricForm from "../components/HealthMetricForm";
import health_metric_icon from "../assets/health_metric_icon.png";
import prescription_icon from "../assets/prescription_icon.png";
import symptom_icon from "../assets/symptom_icon.png";

function Dashboard() {
  const { healthMetrics, setHealthMetrics } = useContext(HealthMetricsContext);
  const { prescriptions } = useContext(PrescriptionsContext);
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState("");
  const [metricTypes, setMetricTypes] = useState("");

  useEffect(() => {
    fetch("/metric_types")
      .then((r) => r.json())
      .then((data) => setMetricTypes(data));
  }, []);

  const numPrescriptions = prescriptions.length;
  const numMetrics = healthMetrics.length;

  if (!metricTypes) {
    return <h1>Loading...</h1>;
  }
  function onAddMetric(metricsList) {
    console.log(metricsList);
    setHealthMetrics([...healthMetrics, ...metricsList]);
    metricsList.forEach(metric => toast.success("Metric Successfully Created."));
  }

  function handleClick(string) {
    setOpen(true);
    setFormType(string);
  }

  return (
    <MainContainer>
      <SnapshotContainer>
        <Card.Group>
          <Snapshot num={numPrescriptions} type={"prescriptions"} />
          <Snapshot num={numMetrics} type={"health metrics"} />
        </Card.Group>
      </SnapshotContainer>
      <IconContainer>
        <Popup
          size="tiny"
          content="Record Blood Glucose and Other Symptoms"
          trigger={
            <Image
              floated="right"
              src={symptom_icon}
              alt="symptom_icon"
              onClick={() => handleClick("symptoms")}
            />
          }
        />
        <Popup
          size="tiny"
          content="Record taking a Prescription"
          trigger={
            <Image
              floated="right"
              src={prescription_icon}
              alt="prescription_icon"
              onClick={() => handleClick("prescription")}
            />
          }
        />
        <Popup
          size="tiny"
          content="Record Vital Signs, including Pain Level"
          trigger={
            <Image
              floated="right"
              src={health_metric_icon}
              alt="health_metric_icon"
              onClick={() => handleClick("vitals")}
            />
          }
        />
      </IconContainer>
      {open && (
        <HealthMetricForm
          hideForm={setOpen}
          addMetric={onAddMetric}
          method={"POST"}
          formType={formType}
        />
      )}
      <HealthMetricContainer />
    </MainContainer>
  );
}

export default Dashboard;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const SnapshotContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 20%;
  width: 100%;
  margin-top: 0.5em;
`;
const IconContainer = styled.div`
  width: 100%;
  margin-bottom: -1rem;
`;
