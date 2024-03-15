import { useState, useEffect } from "react";

function Medications() {
    const [medication, setMedications] = useState([])

    useEffect(() => {
        fetch('/medications')
            .then(resp => resp.json())
            .then(data => setMedications(data))
    }, [])
    return(
        <>
            <h1>Medications</h1>
        </>
    )
}

export default Medications;