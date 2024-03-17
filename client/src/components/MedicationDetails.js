import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";

function MedicationDetails() {
    const { id } = useParams()

    const [medication, setMedication] = useState({})
    
    const { generic_name, brand_names, drug_class, box_warning, indications, dosages, contraindications_and_cautions, adverse_effects, administration} = medication
    useEffect(() => {
        fetch(`/medications/${id}`)
            .then(resp => resp.json())
            .then(data => setMedication(data))
    }, [id])

    return(
        <MainContainer>
            <h1>{generic_name}</h1>
            <h2>Brand Names: {brand_names}</h2>
            <div>
                <h3 style={{display: 'inline', paddingRight: '1.5em'}}>Class: {drug_class}</h3>
            </div>
            {box_warning && <p style={{color: 'red'}}><strong>BOX WARNING: </strong> {box_warning}</p>}
            <p><strong>Dosage: </strong> {dosages}</p>
            <p><strong>Indications:</strong> {indications}</p>
            {administration && <p>Administration: {administration}</p>}

            <p>Contraindications: {contraindications_and_cautions}</p>
            <p>Adverse Effects: {adverse_effects}</p>


        </MainContainer>
    )
}

export default MedicationDetails;


const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
`