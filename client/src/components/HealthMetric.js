import { useState } from "react";
import { Feed, Icon, Modal } from "semantic-ui-react";
import HealthMetricForm from "./HealthMetricForm";

function HealthMetric({ metric, handleDelete }) {
  const [metricDisplay, setMetricDisplay] = useState(metric);
  const { comment, metric_type, time_taken, content } = metricDisplay;
  const [open, setOpen] = useState(false);

  function handleClick(){
    fetch(`/health_metrics/${metric.id}`,{
        method: 'DELETE',
    })
    .then(resp =>{
        if (resp.ok){
            handleDelete(metric)
        } else {
            console.error("Failed to delete care.")
        }
    })
    .catch((error) => {
        console.error("error while deleting care", error);
      });
  }

  return (
    <Feed.Event style={{ display: "block" }}>
      <Feed.Content>
        <Feed.Summary>
          {metric_type.units
            ? `🩺 ${metric_type.metric_type}: ${content} ${metric_type.units}.`
            : `🩺 ${metric_type.metric_type}: ${content}`}{" "}
          <Feed.Date>{time_taken}</Feed.Date>{" "}
        </Feed.Summary>
      </Feed.Content>
      {comment && <Feed.Extra text>{comment}</Feed.Extra>}
      <Feed.Meta>
        <Modal
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          trigger={<Icon name="pencil" />}
          header="What Health Metric would you like to edit?"
          content={
            <HealthMetricForm
              close={setOpen}
              onEdit={setMetricDisplay}
              metric={metric}
              method={"PATCH"}
            />
          }
          style={{ textAlign: "center" }}
        />
        <Icon name="trash" onClick={handleClick}/>
      </Feed.Meta>
    </Feed.Event>
  );
}

export default HealthMetric;
