import { createContext, useState } from "react";

const CurrentPageContext = createContext({
    currentPage: null,
    setCurrentPage: () => {}
})

function CurrentPageProvider({ children }){

    const [currentPage, setCurrentPage] = useState(null)

    return (
        <CurrentPageContext.Provider value={{currentPage, setCurrentPage}}>
            {children}
        </CurrentPageContext.Provider>
    )

}

export { CurrentPageContext, CurrentPageProvider}