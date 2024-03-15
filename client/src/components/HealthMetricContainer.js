import { useContext, useState } from "react";
import { Segment, Feed, Icon, Modal } from "semantic-ui-react";
import HealthMetric from "./HealthMetric";
import { HealthMetricsContext } from "../context/healthMetrics";
import HealthMetricForm from "./HealthMetricForm";

function HealthMetricContainer({ script }) {
  const { healthMetrics, setHealthMetrics } = useContext(HealthMetricsContext);
  const [open, setOpen] = useState(false);

  function onAddMetric(metric) {
    setHealthMetrics([...healthMetrics, metric]);
  }
  
  function onDeleteMetric(metric){
    const updatedMetrics = healthMetrics.filter(hm => hm.id !== metric.id)
    setHealthMetrics(updatedMetrics)
  }

  const metricsDisplay = healthMetrics
  .filter(metric => {
    if(script){
      return metric.content.toUpperCase() === script.toUpperCase()
    } else {
      return metric
    }
  })
  .sort((metricA, metricB) => {
    const timeA = new Date(metricA.time_taken)
    const timeB = new Date(metricB.time_taken)

    return timeB - timeA
  })
  .map((metric) => (
    <HealthMetric metric={metric} key={metric.id} handleDelete={onDeleteMetric}/>
  ))
  

  return (
    <Segment style={{ height: "100%", overflowY: "auto" }}>
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={
          <Icon
            name="plus"
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              cursor: "default",
            }}
          />
        }
        header="What Health Metric would you like to log?"
        content={<HealthMetricForm close={setOpen} addMetric={onAddMetric} method={"POST"}/>}
        style={{ textAlign: "center" }}
      />
      <Feed>{metricsDisplay}</Feed>
    </Segment>
  );
}

export default HealthMetricContainer;
