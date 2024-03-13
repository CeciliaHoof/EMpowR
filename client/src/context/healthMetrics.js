import { createContext, useState } from "react";

const HealthMetricsContext = createContext({
    healthMetrics: null,
    setHealthMetrics: () => {}
})

function HealthMetricsProvider({ children }){

    const [healthMetrics, setHealthMetrics] = useState(null)

    return (
        <HealthMetricsContext.Provider value={{healthMetrics, setHealthMetrics}}>
            {children}
        </HealthMetricsContext.Provider>
    )

}

export { HealthMetricsContext, HealthMetricsProvider}