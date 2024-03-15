import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";

function MedicationDetails() {
    const { id } = useParams()

    const [medication, setMedication] = useState({})
    
    const { generic_name, brand_name, pharm_class, route, dosage_and_administration, indications_and_usage, boxed_warning } = medication
    useEffect(() => {
        fetch(`/medications/${id}`)
            .then(resp => resp.json())
            .then(data => setMedication(data))
    }, [id])

    return(
        <MainContainer>
            <h1>{generic_name}</h1>
            <h2>Brand Name: {brand_name}</h2>
            <div>
                {pharm_class && <h3 style={{display: 'inline', paddingRight: '1.5em'}}>Class: {pharm_class}</h3> } 
                <h3 style={{display: 'inline'}}>Route: {route}</h3>
            </div>
            {boxed_warning && <p style={{color: 'red'}}><strong>BOX WARNING: </strong> {boxed_warning}</p>}
            <p><strong>Dosage: </strong> {dosage_and_administration}</p>
            <p><strong>Indications:</strong> {indications_and_usage}</p>

        </MainContainer>
    )
}

export default MedicationDetails;


const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
`