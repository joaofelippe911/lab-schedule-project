import React, { createContext, useEffect, useState } from "react";

import api from "../api";
import history from "../history";

const Context = createContext();

function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await api
        .get("/verifyAuthentication")
        .then((response) => {
          const isAuthenticated = response.data.isAuthenticated;
          if (isAuthenticated) {
            setAuthenticated(true);
          }
          console.log("passei aqui no useeffect");
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    })();
  }, []);

  function handleSetAuthenticated() {
    setAuthenticated(true);
  }

  function handleLogout() {
    setAuthenticated(false);
    api.get("/deleteCookie");
    history.push("/login");
  }

  return (
    <Context.Provider
      value={{ loading, authenticated, handleSetAuthenticated, handleLogout }}
    >
      {children}
    </Context.Provider>
  );
}

export { Context, AuthProvider };
