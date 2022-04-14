import ScheduleModal from "../components/ScheduleModal";
import ScheduleTable from "../components/ScheduleTable";
import { useScheduleModalContext } from "../Contexts/ScheduleModalContext";
import ScheduleCards from "../components/ScheduleCards";

import '../styles/schedules.scss';

export default function Schedules() {
    const { modalState: {id, visible} } = useScheduleModalContext();

    return (
        <main>
            <div id="schedules-page">
                <ScheduleModal visible={visible} scheduleId={id} />
                <div className="cards-container">
                    <ScheduleCards />
                </div>
                <div className="schedules-container">
                    <div className="schedules-title">
                        <h2>Lista de agendamentos</h2>
                    </div>
                    <ScheduleTable />
                </div>
            </div>
        </main>
    )
}