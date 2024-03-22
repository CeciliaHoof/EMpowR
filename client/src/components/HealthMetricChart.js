import { useContext, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale, //x axis
  LinearScale, //y axis
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";
import { Form } from "semantic-ui-react";
import styled from "styled-components";
import { HealthMetricsContext } from "../context/healthMetrics";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

function MetricChart() {
  const { healthMetrics } = useContext(HealthMetricsContext);
  const [display, setDisplay] = useState("all");

  const moment = require("moment");
  function formatDate(dateString, format = "MM-DD-YYYY") {
    return moment(dateString).format(format);
  }

  const labels = [
    "SBP",
    "DBP",
    "HR",
    "RR",
    "SpO2",
    "Pain",
    "Temp",
    "Blood Glucose",
    "Weight",
  ];
  const colors = [
    "#6699FF",
    "#CCCCFF",
    "#FFCCCC",
    "#CC99FF",
    "#CCFFCC",
    "#CCCCCC",
    "#FFD699",
    "#CC9966",
    "#FFFF99",
  ];

  const sortedMetrics = healthMetrics.sort(
    (metricA, metricB) =>
      new Date(metricA.time_taken) - new Date(metricB.time_taken)
  );

  let filteredMetrics = [];
  const today = new Date();

  switch (display) {
    case "day":
      filteredMetrics = sortedMetrics.filter(
        (metric) =>
          new Date(metric.time_taken).setHours(0, 0, 0, 0) ===
          today.setHours(0, 0, 0, 0)
      );
      break;
    case "week":
      const lastWeekDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredMetrics = sortedMetrics.filter(
        (metric) =>
          new Date(metric.time_taken).setHours(0, 0, 0, 0) >=
          lastWeekDate.setHours(0, 0, 0, 0)
      );
      break;
    case "month":
      const month = today.getMonth();
      filteredMetrics = sortedMetrics.filter(
        (metric) => new Date(metric.time_taken).getMonth() === month
      );
      break;
    default:
      filteredMetrics = [...sortedMetrics];
  }

  let startDate;
  let endDate;
  let allDates = [];
  if (filteredMetrics.length === 0) {
    startDate = today.getTime() - 1 * 24 + 60 * 60 * 1000;
    endDate = today;
  } else {
    startDate = moment(filteredMetrics[0].time_taken);
    endDate = moment(filteredMetrics[filteredMetrics.length - 1].time_taken);
  }
  if (display !== "day") {
    while (startDate <= endDate) {
      allDates.push(formatDate(startDate, "MM-DD-YYYY"));
      startDate.add(1, "day");
    }
  } else {
    allDates.length = 0;
    while (startDate <= endDate) {
      allDates.push(formatDate(startDate, "hh:mm A"));
      startDate.add(1, "hour");
    }
  }

  const data = {
    labels: allDates,
    datasets: [],
  };

  const bpMetrics = filteredMetrics.filter(
    (metric) => metric.metric_type_id === 1
  );

  if (bpMetrics.length > 0) {
    let sbpData = [];
    let dbpData = [];
    let addedDates = {};
    bpMetrics.forEach((metric) => {
      let formattedDate;
      if (display === "day") {
        formattedDate = formatDate(metric.time_taken, "hh:mm A");
        sbpData.push({
          x: formattedDate,
          y: parseInt(metric.content.split("/")[0]),
        });
        dbpData.push({
          x: formattedDate,
          y: parseInt(metric.content.split("/")[1]),
        });
      } else {
        sbpData.length = 0;
        dbpData.length = 0;
        formattedDate = formatDate(metric.time_taken);
        if (!addedDates[formattedDate]) {
          addedDates[formattedDate] = { sbpSum: 0, dbpSum: 0, count: 0 };
        }
        addedDates[formattedDate].sbpSum += parseInt(
          metric.content.split("/")[0]
        );
        addedDates[formattedDate].dbpSum += parseInt(
          metric.content.split("/")[1]
        );
        addedDates[formattedDate].count++;
      }

      Object.keys(addedDates).forEach((date) => {
        const sbpAvg = addedDates[date].sbpSum / addedDates[date].count;
        const dbpAvg = addedDates[date].dbpSum / addedDates[date].count;
        sbpData.push({ x: date, y: sbpAvg });
        dbpData.push({ x: date, y: dbpAvg });
      });
    });

    const bpData = [sbpData, dbpData];
    for (let i = 0; i < 2; i++) {
      data.datasets.push({
        label: labels[i],
        data: bpData[i],
        backgroundColor: colors[i],
        borderColor: colors[i],
        tension: 0.5,
      });
    }
  }

  for (let i = 2; i < 9; i++) {
    let addedDates = {};
    let dataSet = [];
    if (display === "all" || display === "week" || display === "month") {
      dataSet.length = 0;
      filteredMetrics
        .filter((metric) => metric.metric_type_id === i)
        .forEach((metric) => {
          const formattedDate = formatDate(metric.time_taken);
          if (!addedDates[formattedDate]) {
            addedDates[formattedDate] = { sum: 0, count: 0 };
          }
          addedDates[formattedDate].sum += parseInt(metric.content);
          addedDates[formattedDate].count++;
        });

      Object.keys(addedDates).forEach((date) => {
        const average = addedDates[date].sum / addedDates[date].count;
        dataSet.push({ x: date, y: average });
      });
    } else if (display === "day") {
      dataSet.length = 0;
      filteredMetrics
        .filter((metric) => metric.metric_type_id === i)
        .forEach((metric) => {
          const formattedDate = formatDate(metric.time_taken, "hh:mm A");
          dataSet.push({ x: formattedDate, y: parseInt(metric.content) });
        });
    }
    if (dataSet.length > 0) {
      data.datasets.push({
        label: labels[i],
        data: dataSet,
        backgroundColor: colors[i],
        borderColor: colors[i],
        tension: 0.5,
      });
    }
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    maintainAspectRation: false,
  };

  return (
    <ChartContainer>
      <h2>Health Metric Data</h2>
      <Form>
        <Form.Group inline>
          <label>Display:</label>
          <Form.Radio
            label="All"
            value="all"
            checked={display === "all"}
            onChange={(e, { value }) => setDisplay(value)}
          />
          <Form.Radio
            label="Day"
            value="day"
            checked={display === "day"}
            onChange={(e, { value }) => setDisplay(value)}
          />
          <Form.Radio
            label="Week"
            value="week"
            checked={display === "week"}
            onChange={(e, { value }) => setDisplay(value)}
          />
          <Form.Radio
            label="Month"
            value="month"
            checked={display === "month"}
            onChange={(e, { value }) => setDisplay(value)}
          />
        </Form.Group>
      </Form>
      {healthMetrics.length === 0 && <p>Once you have Health Metrics logged in our system, come back here to view a graph of your Health Metric data.</p>}
      <ChartWrapper>
        <Line data={data} options={options}></Line>
      </ChartWrapper>
    </ChartContainer>
  );
}

export default MetricChart;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: center;
  margin-top: 1rem;
  width: 100%;
`;

const ChartWrapper = styled.div`
  height: 30rem;
  width: 60rem;
`;
