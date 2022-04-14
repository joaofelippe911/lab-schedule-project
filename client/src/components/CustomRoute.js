import { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { Context } from '../Contexts/AuthContext';

export default function CustomRoute({ isPrivate, allowedRoles, ...rest }) {
    const { loading, authenticated } = useContext(Context);
    const user = JSON.parse(localStorage.getItem('user'));

    if (loading) {
        return <h1>Loading...</h1>
    }

    if(isPrivate && !authenticated) {
        return <Redirect to="/admin/login" />
    }

    if(allowedRoles !== undefined) {
        if(!allowedRoles?.includes(user.role)){
            return <Redirect to="/admin/" />
        }
    }

    return <Route {...rest} />
}