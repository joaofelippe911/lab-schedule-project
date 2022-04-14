import Sidebar from "../components/Sidebar";
import { Switch } from "react-router-dom";
import CustomRoute from "../components/CustomRoute";

import Schedules from './Schedules';
import SchedulesHistory from './SchedulesHistory';
import Users from './Users';
import { Scheduling } from './Scheduling';
import Reports from "./Reports";
import { ReportsDataProvider } from "../Contexts/ReportsContext";
import Horary from "./Horary";

export function Admin() {
    return (
        <div className="container">
            <Sidebar/>
            <Switch>
                <CustomRoute isPrivate path="/admin/agendamentos" allowedRoles={[1, 2, 3, 4]} exact component={Schedules} />
                <CustomRoute isPrivate path="/admin/novo-agendamento" allowedRoles={[1, 2, 3, 4]} exact component={Scheduling} />
                <CustomRoute isPrivate path="/admin/historico" allowedRoles={[1, 2, 3, 4]} exact component={SchedulesHistory} />
                <CustomRoute isPrivate path="/admin/usuarios" allowedRoles={[1, 3]} exact component={Users} />
                <CustomRoute isPrivate path="/admin/horarios" allowedRoles={[1, 3, 4]} exact component={Horary} />
                
                <ReportsDataProvider>
                    <CustomRoute isPrivate path="/admin/relatorios" allowedRoles={[1, 3]} exact component={Reports} />
                </ReportsDataProvider>
            </Switch>
        </div>
    )
}