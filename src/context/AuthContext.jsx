import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../Firebase";

export const AuthContext = createContext()

export const AuthContextProvider = (props) => {
    const [currentUser, setCurrentUser] = useState({})
    
    useEffect(() =>{
        const unsub = onAuthStateChanged(auth, (user) =>{
            setCurrentUser(user);
        });

        return () =>{
            unsub();
        }
    }, []);

    return(
        <AuthContext.Provider value={{currentUser}}>
            {props.children}
        </AuthContext.Provider>
    )
}