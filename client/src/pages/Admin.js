import { Redirect, Route, Switch } from "react-router-dom";

import { Scheduling } from "./Scheduling";
import SchedulesHistory from "./SchedulesHistory";
import Schedules from "./Schedules";
import Users from "./Users";
import Time from "./Time";
import Reports from "./Reports";

import ConfirmationModal from "../components/ConfirmationModal";
import Sidebar from "../components/Sidebar";
import CustomRoute from "../components/CustomRoute";
import { useState } from "react";

export function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const onCollapse = (sidebarOpen) => {
    setSidebarOpen(sidebarOpen);
  };

  return (
    <div className="container">
      <ConfirmationModal />
      <Sidebar onCollapse={onCollapse} />
      <main className={!sidebarOpen ? "full-w" : ""}>
        <Switch>
          <CustomRoute isPrivate path="/" allowedRoles={[1, 2, 3, 4]} exact component={() => <Redirect to="/agendamentos" />} />
          <CustomRoute isPrivate path="/agendamentos" allowedRoles={[1, 2, 3, 4]} exact component={Schedules} />
          <CustomRoute isPrivate path="/novo-agendamento" allowedRoles={[1, 2, 3, 4]} exact component={Scheduling} />
          <CustomRoute isPrivate path="/historico" allowedRoles={[1, 2, 3, 4]} exact component={SchedulesHistory} />
          <CustomRoute isPrivate path="/usuarios" allowedRoles={[1, 3]} exact component={Users} />
          <CustomRoute isPrivate path="/horarios" allowedRoles={[1, 2, 3]} exact component={Time} />
          <CustomRoute isPrivate path="/relatorios" allowedRoles={[1, 3]} exact component={Reports} />
          <Route path="/*" component={() => <h1>Error 404 - Page not found</h1>} />
        </Switch>
      </main>
    </div>
  );
}