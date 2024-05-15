import { createContext, useState } from "react";

const AlertsContext = createContext({
    alerts: null,
    setAlerts: () => {}
})

function AlertsProvider({ children }){

    const [alerts, setAlerts] = useState(null)

    return (
        <AlertsContext.Provider value={{alerts, setAlerts}}>
            {children}
        </AlertsContext.Provider>
    )

}

export { AlertsContext, AlertsProvider }