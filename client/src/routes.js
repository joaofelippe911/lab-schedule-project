import React from "react";
import { Switch } from "react-router-dom";

import Login from "./pages/Login";
import { Admin } from "./pages/Admin";

import CustomRoute from "./components/CustomRoute";

export default function Routes() {
  return (
    <Switch>
      <CustomRoute path="/login" exact component={Login} />
      <CustomRoute isPrivate path="/" component={Admin} />
    </Switch>
  );
}
