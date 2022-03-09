import React from 'react';
import { Router } from 'react-router-dom';

import Routes from './routes';
import history from './history';

import { AuthProvider } from './Contexts/AuthContext';
import { ScheduleModalProvider } from './Contexts/ScheduleModalContext';

function App() {
  return (
    <AuthProvider>
      <ScheduleModalProvider>
        <Router history={history}>
            <Routes />
        </Router>
      </ScheduleModalProvider>
    </AuthProvider>
  )
}

export default App;
