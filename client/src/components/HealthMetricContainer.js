import { useContext, useState } from "react";
import { Segment, Feed, Image, Popup } from "semantic-ui-react";
import { toast } from "react-toastify";
import HealthMetric from "./HealthMetric";
import { HealthMetricsContext } from "../context/healthMetrics";
import HealthMetricForm from "./HealthMetricForm";
import health_metric_icon from "../assets/health_metric_icon.png";
import prescription_icon from "../assets/prescription_icon.png";
import symptom_icon from "../assets/symptom_icon.png";

function HealthMetricContainer({ script }) {
  const { healthMetrics, setHealthMetrics } = useContext(HealthMetricsContext);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");

  function onAddMetric(metric) {
    setHealthMetrics([...healthMetrics, metric]);
    toast.success("Metric Successfully Created.");
  }

  function onDeleteMetric(metric) {
    const updatedMetrics = healthMetrics.filter((hm) => hm.id !== metric.id);
    setHealthMetrics(updatedMetrics);
  }

  function handleClick(string) {
    setOpen(true);
    setType(string);
  }

  const metricsDisplay = healthMetrics
    .filter((metric) => {
      if (script) {
        return metric.content.toUpperCase() === script.toUpperCase();
      } else {
        return metric;
      }
    })
    .sort((metricA, metricB) => {
      const timeA = new Date(metricA.time_taken);
      const timeB = new Date(metricB.time_taken);

      return timeB - timeA;
    })
    .map((metric) => (
      <HealthMetric
        metric={metric}
        key={metric.id}
        handleDelete={onDeleteMetric}
      />
    ));

  return (
    <>
      <Segment style={{ height: "100%", overflowY: "auto" }}>
        <Image.Group
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
          }}
        >
          <Popup
            size="tiny"
            content="Add Vital Signs, Blood Glucose, or Pain Level"
            trigger={
              <Image
                src={health_metric_icon}
                alt="health_metric_icon"
                onClick={() => handleClick("vitals")}
              />
            }
          />
          <Popup
            size="tiny"
            content="Record taking a Prescription"
            trigger={
              <Image
                src={prescription_icon}
                alt="prescription_icon"
                onClick={() => handleClick("prescription")}
              />
            }
          />
          <Popup
            size="tiny"
            content="Add Other Symptoms or Lifestyle Factors"
            trigger={
              <Image
                src={symptom_icon}
                alt="symptom_icon"
                onClick={() => handleClick("symptoms")}
              />
            }
          />
        </Image.Group>
        {open && (
          <HealthMetricForm
            hideForm={setOpen}
            addMetric={onAddMetric}
            method={"POST"}
            formType={type}
          />
        )}
        <Feed>{metricsDisplay}</Feed>
      </Segment>
    </>
  );
}

export default HealthMetricContainer;
