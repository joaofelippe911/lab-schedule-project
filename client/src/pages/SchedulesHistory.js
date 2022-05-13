import Modal from "../components/Modal";
import SchedulingModal from "../components/SchedulingModal";
import ScheduleTable from "../components/ScheduleTable";

import "../styles/schedulesHistory.scss";
import api from "../api";
import { useEffect, useState } from "react";

export default function SchedulesHistory() {
  const [schedule, setSchedule] = useState([]);
  const [unlimited, setUnlimited] = useState(false);

  async function getUpdatedSchedule() {
    const { data } = await api.get("/api/scheduling/history", {
      params: { isUnlimited: unlimited },
    });
    setSchedule(data);
  }

  function handleToggleUnlimited() {
    setUnlimited(!unlimited);
  }

  useEffect(() => {
    getUpdatedSchedule();
  }, [unlimited]);

  return (
    <div id="schedules-history-page">
      <Modal>
        <SchedulingModal getUpdatedSchedule={getUpdatedSchedule} />
      </Modal>
      <ScheduleTable
        schedule={schedule}
        isHistory
        toggleUnlimited={handleToggleUnlimited}
        unlimited={unlimited}
      />
    </div>
  );
}