import React, { createContext, useEffect, useState } from "react";

import api from "../api";
import history from "../history";

const Context = createContext();

function AuthProvider({ children }) {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // const history = useHistory();

    useEffect(() => {
        (async () => {
            await api.get("/verifyAuthentication").then((response)=>{
                const isAuthenticated = response.data.isAuthenticated;
                if(isAuthenticated){
                    setAuthenticated(true);
                }
                setLoading(false);
            }).catch((err)=> {
                setLoading(false);
            });

            
        })(); 
         
    }, []);
    
    function handleSetAuthenticated(){
        setAuthenticated(true);
    }

    // async function handleLogin(username, password) {
        
    //     const { data: { auth, user } } = await api.post("/authenticate", {username, password});

    //     if (auth) {
    //         setAuthenticated(true);
    //         localStorage.setItem('user', JSON.stringify(user));
    //         history.push("/admin/agendamentos");
    //     }
    // }


    function handleLogout() {
        setAuthenticated(false);
        api.get("/deleteCookie");
        history.push("/admin/login");
    }

    return (
        <Context.Provider value={{ loading, authenticated, handleSetAuthenticated, handleLogout }}>
            {children}
        </Context.Provider>
    )
}

export { Context, AuthProvider };