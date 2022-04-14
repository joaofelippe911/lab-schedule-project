import React from 'react';
import { Switch } from 'react-router-dom';

import { Home } from './pages/Home';
import { novaHome } from './pages/novaHome';
import { Scheduling } from './pages/Scheduling';
import Login from './pages/Login';
import { Admin } from './pages/Admin';

import CustomRoute from './components/CustomRoute';

export default function Routes() {
    return (
        <Switch>
            <CustomRoute path="/" exact component={Home} />
            <CustomRoute path="/nova" component={novaHome} />
            <CustomRoute path="/agendamento" component={Scheduling} />
            <CustomRoute path="/admin/login" exact component={Login} />
            <CustomRoute isPrivate path="/admin" allowedRoles={[1, 2, 3, 4]} exact component={Admin} />
            <CustomRoute isPrivate path="/admin/*" component={Admin} />
            <CustomRoute path="*" component={() => (<h1>Not found</h1>)} />
        </Switch>
    )
}