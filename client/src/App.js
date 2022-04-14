import React from 'react';
import { Router } from 'react-router-dom';

import Routes from './routes';
import history from './history';

import "./styles/global.scss";

import ConfirmationModal from "./components/ConfirmationModal";

import { AuthProvider } from './Contexts/AuthContext';
import { ScheduleModalProvider } from './Contexts/ScheduleModalContext';
import { UserModalProvider } from './Contexts/UserModalContext';
import { ConfirmationModalProvider } from './Contexts/ConfirmationModalContext';

function App() {
  return (
    <AuthProvider>
      <ScheduleModalProvider>
        <UserModalProvider>
          <ConfirmationModalProvider>
            <ConfirmationModal />
            <Router history={history}>
                <Routes />
            </Router>
          </ConfirmationModalProvider>
        </UserModalProvider>
      </ScheduleModalProvider>
    </AuthProvider>
  )
}

export default App;
