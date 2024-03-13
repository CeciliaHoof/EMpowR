import { createContext, useState } from "react";

const UserContext = createContext({
    user: null,
    setUser: () => {}
})

function UserProvider({ children }){

    const [user, setUser] = useState(null)

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )

}

export { UserContext, UserProvider}