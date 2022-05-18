import SchedulingModal from "../components/SchedulingModal";
import ScheduleTable from "../components/ScheduleTable";
import ScheduleCards from "../components/ScheduleCards";

import Modal from "../components/Modal";
import { useEffect, useState } from "react";
import api from "../api";

const TWO_MINUTES_IN_MILLISECONDS = 120000;

export default function Schedules() {
  const [schedule, setSchedule] = useState([]);
  const [cardData, setCardData] = useState([]);

  async function getUpdatedSchedule() {
    const { data } = await api.get("/api/scheduling/");
    setSchedule(data);
  }

  async function getUpdatedCardData() {
    const { data } = await api.get("/api/scheduling/month-numbers");
    setCardData(data);
  }

  useEffect(() => {
    getUpdatedSchedule();
    getUpdatedCardData();
    const updateInterval = setInterval(() => {
      getUpdatedSchedule();
      getUpdatedCardData();
      console.log("teste");
    }, TWO_MINUTES_IN_MILLISECONDS);

    return () => {
      if (updateInterval !== undefined) {
        clearInterval(updateInterval);
      }
    };
  }, []);

  return (
    <div id="schedules-page">
      <Modal>
        <SchedulingModal getUpdatedSchedule={getUpdatedSchedule} />
      </Modal>
      <ScheduleCards data={cardData} />
      <ScheduleTable schedule={schedule} />
    </div>
  );
}
