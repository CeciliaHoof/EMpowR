import { useContext } from "react";
import { Segment, Feed } from "semantic-ui-react";
import HealthMetric from "./HealthMetric";
import { HealthMetricsContext } from "../context/healthMetrics";

function HealthMetricContainer({ script }) {
  const { healthMetrics, setHealthMetrics } = useContext(HealthMetricsContext);

  function onDeleteMetric(metric) {
    const updatedMetrics = healthMetrics.filter((hm) => hm.id !== metric.id);
    setHealthMetrics(updatedMetrics);
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
        <Feed>{metricsDisplay}</Feed>
      </Segment>
    </>
  );
}

export default HealthMetricContainer;
