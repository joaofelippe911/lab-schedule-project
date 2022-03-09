import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { Home } from './pages/Home';
import { novaHome } from './pages/novaHome';
import { Scheduling } from './pages/Scheduling';
import Login from './pages/Login';
import { Admin } from './pages/Admin';
import Schedules from './pages/Schedules';

import { Context } from './Contexts/AuthContext';
import { useContext } from 'react';

function CustomRoute({ isPrivate, ...rest }) {
    const { loading, authenticated } = useContext(Context);

    if (loading) {
        return <h1>Loading...</h1>
    }

    if(isPrivate && !authenticated) {
        return <Redirect to="/admin/login" />
    }

    return <Route {...rest} />
}

export default function Routes() {
    return (
        <Switch>
            <CustomRoute path="/" exact component={Home} />
            <CustomRoute path="/nova" component={novaHome} />
            <CustomRoute path="/agendamento" component={Scheduling} />
            <CustomRoute path="/admin/login" exact component={Login} />
            <CustomRoute isPrivate path="/admin/" exact component={Admin} />
            <CustomRoute isPrivate path="/admin/agendamentos" exact component={Schedules} />
            <CustomRoute isPrivate path="/admin/novo-agendamento" exact component={Scheduling} />
        </Switch>
    )
}

