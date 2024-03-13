import { createContext, useState } from "react";

const PrescriptionsContext = createContext({
    prescriptions: null,
    setPrescriptions: () => {}
})

function PrescriptionsProvider({ children }){

    const [prescriptions, setPrescriptions] = useState(null)

    return (
        <PrescriptionsContext.Provider value={{prescriptions, setPrescriptions}}>
            {children}
        </PrescriptionsContext.Provider>
    )

}

export { PrescriptionsContext, PrescriptionsProvider}