import React,{ createContext, useContext, useState } from "react";


export const UserContext =  createContext();

export const UserProvider = ({children}) => {

    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={ {user, setUser} }>
            {children}
        </UserContext.Provider>
    )
};

// custom hook to use UserContext
// export const useUser = () => {
//     return useContext(UserContext);
// }