import { useEffect, useState } from "react";
import api from "../api";
import TimeForm from "../components/TimeForm";
import TimeTable from "../components/TimeTable";
import { useConfirmationModalContext } from "../Contexts/ConfirmationModalContext";

export default function Time() {
  const [times, setTimes] = useState([]);
  const { openConfirmationModal } = useConfirmationModalContext();

  useEffect(() => {
    getUpdatedTimes();
  }, []);

  async function getUpdatedTimes() {
    const { data } = await api.get("/api/time");

    setTimes(data);
  }

  function inactivateTime(idTime) {
    api
      .patch(`/api/time/inactivate/${idTime}`)
      .then(() => {
        times.find(({ id }) => id === idTime).status = 0;

        setTimes([...times]);
      })
      .catch(() => {
        openConfirmationModal({
          title:
            "Houve um erro ao inativar o horário! Por favor, entre em contato com um administrador.",
          buttons: false,
        });
      });
  }

  function activateTime(idTime) {
    api
      .patch(`/api/time/activate/${idTime}`)
      .then(() => {
        times.find(({ id }) => id === idTime).status = 1;

        setTimes([...times]);
      })
      .catch(() => {
        openConfirmationModal({
          title:
            "Houve um erro ao ativar o horário! Por favor, entre em contato com um administrador.",
          buttons: false,
        });
      });
  }

  return (
    <div id="horary-page">
      <TimeForm onCreatedTime={getUpdatedTimes} />
      <TimeTable
        times={times}
        activateTime={activateTime}
        inactivateTime={inactivateTime}
      />
    </div>
  );
}
