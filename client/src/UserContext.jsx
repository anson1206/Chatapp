import axios from "axios";
import { useState, createContext, useEffect } from "react";
export const UserContext = createContext({});


export function UserContextProvider({children}) {
    const [username, setUsername] = useState("");
    const [id, setId] = useState(null);
    useEffect(() => {
        axios.get('/profile').then(response => {
            setUsername(response.data.username);
            setId(response.data.userId);
        });
    }, []);
    return (
        <UserContext.Provider value={{username, setUsername, id, setId}}>
            {children}
        </UserContext.Provider>
    )
}