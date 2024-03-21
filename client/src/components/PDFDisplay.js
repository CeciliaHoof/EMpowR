function PDFDisplay({ metric }) {
  const { comment, metric_type, time_taken, content } = metric;
  const moment = require("moment");
  const formattedDate = moment(time_taken).format("MM-DD-YYYY hh:mm A");
  return (
    <>
      <p>
        <strong>{formattedDate}:</strong>{" "}
        {metric_type.units
          ? `${metric_type.metric_type}: ${content} ${metric_type.units}.`
          : `${metric_type.metric_type}: ${content}`}
      </p>
      {comment ? (
        <p>
          <strong>Comment: </strong> {comment}
        </p>
      ) : null}
    </>
  );
}

export default PDFDisplay;
