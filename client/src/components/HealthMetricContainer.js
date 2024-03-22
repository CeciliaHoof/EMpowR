import { useContext } from "react";
import { Segment, Feed, Button } from "semantic-ui-react";
import HealthMetric from "./HealthMetric";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PDFDisplay from "./PDFDisplay";
import { HealthMetricsContext } from "../context/healthMetrics";
import { UserContext } from "../context/user";

function HealthMetricContainer({ script }) {
  const { user } = useContext(UserContext)
  const { healthMetrics } = useContext(HealthMetricsContext);

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
    });

  function downloadPDF() {
    const input = document.getElementById("pdf-content");
    html2canvas(input, {
      onclone: function (clonedDoc) {
        clonedDoc.getElementById("pdf-content").style.display = "block";
      },
    }).then((canvas) => {
      const image = { type: "jpeg", quality: 0.98 };
      const margin = [0.5, 0.5];

      const imgWidth = 8.5;
      let pageHeight = 11;

      const innerPageWidth = imgWidth - margin[0] * 2;
      const innerPageHeight = pageHeight - margin[1] * 2;

      const pxFullHeight = canvas.height;
      const pxPageHeight = Math.floor(canvas.width * (pageHeight / imgWidth));
      const nPages = Math.ceil(pxFullHeight / pxPageHeight);

      pageHeight = innerPageHeight;

      const pageCanvas = document.createElement("canvas");
      const pageCtx = pageCanvas.getContext("2d");
      pageCanvas.width = canvas.width;
      pageCanvas.height = pxPageHeight;

      const pdf = new jsPDF("p", "in", [8.5, 11]);

      for (let page = 0; page < nPages; page++) {
        if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
          pageCanvas.height = pxFullHeight % pxPageHeight;
          pageHeight = (pageCanvas.height * innerPageWidth) / pageCanvas.width;
        }

        const w = pageCanvas.width;
        const h = pageCanvas.height;
        pageCtx.fillStyle = "white";
        pageCtx.fillRect(0, 0, w, h);
        pageCtx.drawImage(canvas, 0, page * pxPageHeight, w, h, 0, 0, w, h);

        if (page > 0) pdf.addPage();
        debugger;
        const imgData = pageCanvas.toDataURL(
          "image/" + image.type,
          image.quality
        );
        pdf.addImage(
          imgData,
          image.type,
          margin[1],
          margin[0],
          innerPageWidth,
          pageHeight
        );
      }

      pdf.save('health_metrics.pdf');
    });
  }
  return (
    <>
      <Segment style={{ height: "100%", overflowY: "auto" }}>
        <Feed>
          {metricsDisplay.map((metric) => (
            <HealthMetric metric={metric} key={metric.id} />
          ))}
        </Feed>
      </Segment>
      <div id="pdf-content" style={{ display: "none" }}>
      <h2>{user.first_name} {user.last_name}'s Health Metrics</h2>
        {metricsDisplay.map((metric) => (
          <PDFDisplay metric={metric} key={metric.id} />
        ))}
      </div>
      <Button onClick={downloadPDF}>Download PDF of Health Metrics</Button>
    </>
  );
}

export default HealthMetricContainer;
