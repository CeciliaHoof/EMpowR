import { useContext, useRef } from "react";
import { Button, Grid, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import HealthMetric from "./HealthMetric";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PDFDisplay from "./PDFDisplay";
import { HealthMetricsContext } from "../context/healthMetrics";
import { UserContext } from "../context/user";

function HealthMetricContainer({
  script,
  filterMetricType,
  filterDate,
  filterPrescription,
  setSnackbar
}) {
  const { user } = useContext(UserContext);
  const { healthMetrics } = useContext(HealthMetricsContext);
  const pdfRef = useRef(null);
  const theme = useTheme();
  
  function handleSnackBar(string){
    string === 'delete' ?
    setSnackbar("Metric Successfully Deleted"):
    setSnackbar("Metric Successfully Updated")
  }
  const metricsDisplay = healthMetrics
    .filter((metric) => {
      if (script) {
        return metric.content.toUpperCase() === script.toUpperCase();
      } else {
        return metric;
      }
    })
    .filter((metric) => {
      if (filterMetricType) {
        if (filterMetricType === "All") {
          return metric;
        } else if (filterMetricType === "Medication Taken") {
          return filterPrescription === "All"
            ? metric.metric_type.metric_type.includes("Medication Taken")
            : metric.content.includes(filterPrescription) &&
                metric.metric_type.metric_type === "Medication Taken";
        } else {
          return metric.metric_type.metric_type.includes(filterMetricType);
        }
      } else {
        return metric;
      }
    })
    .filter((metric) =>
      !filterDate ? metric : new Date(metric.time_taken).setHours(0, 0, 0, 0) >= new Date(filterDate).setHours(0, 0, 0, 0)
    )
    .sort((metricA, metricB) => {
      const timeA = new Date(metricA.time_taken);
      const timeB = new Date(metricB.time_taken);

      return timeB - timeA;
    });

  function downloadPDF() {
    const input = pdfRef.current;
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

      pdf.save("health_metrics.pdf");
    });
  }

  let pdfHeading;
  if (filterMetricType !== "Medication Taken") {
    pdfHeading = `${filterMetricType} Data`;
  } else {
    if (filterPrescription === "" || filterPrescription === "All") {
      pdfHeading = "Medication Data for all Prescriptions";
    } else {
      pdfHeading = `Medication Data for ${filterPrescription}`;
    }
  }

  if (filterDate) {
    pdfHeading += ` since ${filterDate}`;
  }

  return (
    <>
      <Box
        sx={{
          height: "31rem",
          width: "100%",
          overflowY: "scroll",
        }}
      >
        <Grid container>
        {metricsDisplay.map((metric) => (
          <HealthMetric
            metric={metric}
            key={metric.id}
            handleSnackBar={handleSnackBar}
          />
        ))}
        </Grid>
      </Box>
      <div ref={pdfRef} id="pdf-content" style={{ display: "none" }}>
        <h2 style={{ marginBottom: "2px" }}>
          {user.first_name} {user.last_name}'s Health Metrics
        </h2>
        {filterMetricType && <h3 style={{ marginTop: "2px" }}>{pdfHeading}</h3>}
        {metricsDisplay.map((metric) => (
          <PDFDisplay metric={metric} key={metric.id} />
        ))}
      </div>
      {!script && (
        <div style={{ textAlign: "center"}}>
          <Button
            onClick={downloadPDF}
            size="small"
            variant="contained"
            sx={{ backgroundColor: theme.palette.primary.dark, marginTop:'1.3rem' }}
          >
            Download PDF of Currently Displayed Health Metrics
          </Button>
        </div>
      )}
    </>
  );
}

export default HealthMetricContainer;
