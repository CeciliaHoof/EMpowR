import { useContext, useState } from "react";
import styled from "styled-components";
import { Image, Popup } from "semantic-ui-react";
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import HealthMetricContainer from "../components/HealthMetricContainer";
import HealthMetricForm from "../components/HealthMetricForm";
import health_metric_icon from "../assets/health_metric_icon.png";
import prescription_icon from "../assets/prescription_icon.png";
import symptom_icon from "../assets/symptom_icon.png";
import { HealthMetricsContext } from "../context/healthMetrics";

function HealthMetrics() {
    const { healthMetrics, setHealthMetrics } = useContext(HealthMetricsContext);
    const [open, setOpen] = useState(false);
    const [formType, setFormType] = useState("");

    function onAddMetric(metricsList) {
        setHealthMetrics([...healthMetrics, ...metricsList]);
        metricsList.forEach(metric => toast.success("Metric Successfully Created."));
      }
    
      function handleClick(string) {
        setOpen(true);
        setFormType(string);
      }

    return (
    <MainContainer>
      <IconContainer>
        <Popup
          size="tiny"
          content="Record Other Symptoms"
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
          content="Record Vital Signs, Pain Level, Blood Glucose and Weight"
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

export default HealthMetrics

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const IconContainer = styled.div`
  width: 100%;
  margin-top: 1rem;
  margin-bottom: -1rem;
`;