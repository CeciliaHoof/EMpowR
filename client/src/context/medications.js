import { createContext, useState } from "react";

const MedicationsContext = createContext({
    medications: null,
    setMedications: () => {}
})

function MedicationsProvider({ children }){

    const [medications, setMedications] = useState(null)

    return (
        <MedicationsContext.Provider value={{medications, setMedications}}>
            {children}
        </MedicationsContext.Provider>
    )

}

export { MedicationsContext, MedicationsProvider}