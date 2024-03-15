import { useContext } from "react";
import styled from "styled-components";

import Snapshot from "../components/Snapshot"
import HealthMetricContainer from "../components/HealthMetricContainer";
import { HealthMetricsContext } from "../context/healthMetrics";
import { PrescriptionsContext } from "../context/prescriptions";

function Dashboard() {
    const { healthMetrics } = useContext(HealthMetricsContext)
    const { prescriptions } = useContext(PrescriptionsContext)

    const numPrescriptions = prescriptions.length
    const numMetrics = healthMetrics.length

    return(
        <MainContainer>
            <SnapshotContainer>
                <Snapshot num={numPrescriptions} type={"prescriptions"} />
                <Snapshot num={numMetrics} type={"health metrics"} />
            </SnapshotContainer>
            <HealthMetricContainer />
        </MainContainer>
    )
}

export default Dashboard;

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%
`
const SnapshotContainer = styled.div`
    display: flex;
    justify-content: center;
    height: 20%;
`