import { useContext, useEffect, useState } from "react";
import { Segment, Feed, Icon, Modal, Dropdown } from "semantic-ui-react";
import HealthMetric from "./HealthMetric";
import { HealthMetricsContext } from "../context/healthMetrics";
import HealthMetricForm from "./HealthMetricForm";

function HealthMetricContainer() {
  const { healthMetrics, setHealthMetrics } = useContext(HealthMetricsContext);
  const [open, setOpen] = useState(false);

  function onAddMetric(metric) {
    setHealthMetrics([...healthMetrics, metric]);
  }
  
  function onDeleteMetric(metric){
    const updatedMetrics = healthMetrics.filter(hm => hm.id !== metric.id)
    setHealthMetrics(updatedMetrics)
  }

  const metricsDisplay = healthMetrics.map((metric) => (
    <HealthMetric metric={metric} key={metric.id} handleDelete={onDeleteMetric}/>
  ));

  return (
    <Segment style={{ height: "80vh", overflowY: "auto" }}>
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
