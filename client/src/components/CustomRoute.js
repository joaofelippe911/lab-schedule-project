import { useContext } from "react";
import { Route } from "react-router-dom";
import { Context } from "../Contexts/AuthContext";
import history from "../history";

export default function CustomRoute({ isPrivate, allowedRoles, ...rest }) {
  const { loading, authenticated } = useContext(Context);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (isPrivate && !authenticated) {
    history.push("/login");
    return null;
  }

  const user = JSON.parse(localStorage.getItem("user"));

  if (allowedRoles !== undefined) {
    if (!allowedRoles?.includes(user.role)) {
      history.push("/");
      return null;
    }
  }

  return <Route {...rest} />;
}
