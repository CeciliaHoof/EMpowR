import { useState } from "react";
import { Feed, Icon, Image } from "semantic-ui-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HealthMetricForm from "./HealthMetricForm";
import health_metric_icon from "../assets/health_metric_icon.png";
import prescription_icon from "../assets/prescription_icon.png";
import symptom_icon from "../assets/symptom_icon.png";

function HealthMetric({ metric, handleDelete }) {
  const [metricDisplay, setMetricDisplay] = useState(metric);
  const { comment, metric_type, time_taken, content } = metricDisplay;
  const [isEditing, setIsEditing] = useState(false);

  function successfulDelete() {
    toast.success("Metric Successfully Deleted.");
  }

  function handleEdit(metric){
    setMetricDisplay(metric)
    toast.success("Metric Successfully Updated.")
  }
  function handleClick() {
    fetch(`/health_metrics/${metric.id}`, {
      method: "DELETE",
    })
      .then((resp) => {
        if (resp.ok) {
          handleDelete(metric);
          successfulDelete();
        } else {
          console.error("Failed to delete care.");
        }
      })
      .catch((error) => {
        console.error("error while deleting care", error);
      });
  }
  const moment = require("moment");
  const formattedDate = moment(time_taken).format("MM-DD-YYYY hh:mm A");

  let formType;
  let metricImage;
  if (metric_type.id <= 5) {
    formType = "vitals";
    metricImage = (
      <Image src={health_metric_icon} alt="health_metric_icon" wrapped />
    );
  } else if (metric_type.id === 6) {
    formType = "prescription";
    metricImage = (
      <Image src={prescription_icon} alt="prescription_icon" wrapped />
    );
  } else {
    formType = "symptoms";
    metricImage = <Image src={symptom_icon} alt="symptom_icon" wrapped />;
  }
  return (
    <>
      <Feed.Event>
        <Feed.Label>{metricImage}</Feed.Label>
        <Feed.Content>
          {!isEditing ? (
            <>
              <Feed.Date>{formattedDate}</Feed.Date>
              <Feed.Summary>
                {metric_type.units
                  ? `${metric_type.metric_type}: ${content} ${metric_type.units}.`
                  : `${metric_type.metric_type}: ${content}`}
              </Feed.Summary>
              {comment && <Feed.Extra text>{comment}</Feed.Extra>}
              <Feed.Meta>
                <Icon name="pencil" onClick={() => setIsEditing(true)} />
                <Icon name="trash" onClick={handleClick} />
              </Feed.Meta>{" "}
            </>
          ) : (
            <>
              <HealthMetricForm
                hideForm={setIsEditing}
                onEdit={handleEdit}
                metric={metric}
                method={"PATCH"}
                formType={formType}
              />
            </>
          )}
        </Feed.Content>
      </Feed.Event>
    </>
  );
}

export default HealthMetric;
