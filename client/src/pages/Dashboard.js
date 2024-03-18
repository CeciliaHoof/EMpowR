import { useContext } from "react";
import styled from "styled-components";
import { Card } from "semantic-ui-react";
import Snapshot from "../components/Snapshot";
import HealthMetricContainer from "../components/HealthMetricContainer";
import { HealthMetricsContext } from "../context/healthMetrics";
import { PrescriptionsContext } from "../context/prescriptions";


function Dashboard() {
  const { healthMetrics } = useContext(HealthMetricsContext);
  const { prescriptions } = useContext(PrescriptionsContext);

  const numPrescriptions = prescriptions.length;
  const numMetrics = healthMetrics.length;

  return (
    <MainContainer>
      <SnapshotContainer>
        <Card.Group>
          <Snapshot num={numPrescriptions} type={"prescriptions"} />
          <Snapshot num={numMetrics} type={"health metrics"} />
        </Card.Group>
      </SnapshotContainer>
      <HealthMetricContainer />
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
  height: 20%;
  margin-top: 0.5em;
`;
