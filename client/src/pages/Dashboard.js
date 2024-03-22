import { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { Card } from "semantic-ui-react";

import Snapshot from "../components/Snapshot";
import HealthMetricChart from "../components/HealthMetricChart";

import { HealthMetricsContext } from "../context/healthMetrics";
import { PrescriptionsContext } from "../context/prescriptions";

function Dashboard() {
  const { healthMetrics } = useContext(HealthMetricsContext);
  const { prescriptions } = useContext(PrescriptionsContext);
  const [metricTypes, setMetricTypes] = useState("");

  useEffect(() => {
    fetch("/metric_types")
      .then((r) => r.json())
      .then((data) => setMetricTypes(data));
  }, []);

  const numPrescriptions = prescriptions.length;
  const numMetrics = healthMetrics.length;

  if (!metricTypes) {
    return <h1>Loading...</h1>;
  }
  
  return (
    <MainContainer>
      <SnapshotContainer>
        <Card.Group>
          <Snapshot num={numPrescriptions} type={"Prescriptions"} />
          <Snapshot num={numMetrics} type={"Health Metrics"} />
        </Card.Group>
      </SnapshotContainer>
      <HealthMetricChart />
    </MainContainer>
  );
}

export default Dashboard;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const SnapshotContainer = styled.div`
  display: flex;
  justify-content: center;
  background-color: #b6cbe0;
  margin: 3rem 1rem 2rem 1rem;
  padding: 1rem;
`;

