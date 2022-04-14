import { useState } from "react";
import ScheduleModal from "../components/ScheduleModal";
import ScheduleTable from "../components/ScheduleTable";
import { useScheduleModalContext } from "../Contexts/ScheduleModalContext";

import '../styles/schedulesHistory.scss';


export default function SchedulesHistory(){

    const [unlimited, setUnlimited] = useState(false);

    const { modalState: {id, visible } } = useScheduleModalContext();

    function handleUnlimitTable(){
        setUnlimited(true);
    }

    function handleLimitTable(){
        setUnlimited(false);
    }

    return (
        <main>
            <div id="schedules-history-page">
                <ScheduleModal visible={visible} scheduleId={id} />
                {!unlimited ? <button onClick={handleUnlimitTable} className="button limit-button">Mostrar tudo</button> : <button onClick={handleLimitTable} className="button limit-button">Mostrar menos</button>}
                <ScheduleTable isHistory isUnlimited={unlimited}/>
            </div>
        </main>
    )
}

