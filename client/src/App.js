import React from "react";
import { Router } from "react-router-dom";

import Routes from "./routes";
import history from "./history";

import "./styles/global.scss";

import { AuthProvider } from "./Contexts/AuthContext";
import { ModalProvider } from "./Contexts/ModalContext";
import { ConfirmationModalProvider } from "./Contexts/ConfirmationModalContext";

function App() {
  return (
    <Router history={history}>
      <AuthProvider>
        <ModalProvider>
          <ConfirmationModalProvider>
            <Routes />
          </ConfirmationModalProvider>
        </ModalProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
