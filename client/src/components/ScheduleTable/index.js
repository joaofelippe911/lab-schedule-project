import { memo } from "react";
import "./styles.scss";

import { mask as masker } from "remask";
import { useModalContext } from "../../Contexts/ModalContext";
import { EditButton } from "../EditButton";
import Button from "../Button";

function ScheduleTable({ schedule, isHistory, toggleUnlimited, unlimited }) {
  const { openModal } = useModalContext();

  function handleOpenModal(id) {
    openModal({ id: id });
  }

  return (
    <div className="table-container">
      {isHistory ? (
        <div className="buttons-container">
          <Button onClick={toggleUnlimited} className="limit-button">
            {!unlimited ? "Mostrar tudo" : "Mostrar menos"}
          </Button>
        </div>
      ) : (
        <div className="table-title">
          <h2>Lista de agendamentos</h2>
        </div>
      )}
      {schedule.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Horário</th>
              <th>Nome</th>
              <th className="address-column">Endereço</th>
              <th>Requisição</th>
              <th className="user-status-column">
                {isHistory ? "Usuário" : "Status"}
              </th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((scheduling) => (
              <tr key={scheduling.scheduling_id}>
                <td>{new Date(scheduling.date).toLocaleDateString("pt-br")}</td>
                <td>{scheduling.hour.slice(0, 5)}</td>
                <td>{scheduling.patient_name}</td>
                <td className="address-column">
                  {scheduling.address}, {scheduling.number},{" "}
                  {scheduling.neighborhood}{" "}
                  {scheduling.cep !== "" && scheduling.cep !== null
                    ? "- " + masker(scheduling.cep, ["99999-999"])
                    : ""}
                </td>
                <td>{scheduling.requisitation_number}</td>
                <td className="user-status-column">
                  {!isHistory ? (
                    scheduling.sname
                  ) : scheduling.status === 4 ? (
                    <span className="red-text">Cancelado</span>
                  ) : (
                    scheduling.username
                  )}
                </td>
                <td>
                  <EditButton
                    onClick={() => handleOpenModal(scheduling.scheduling_id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="empty-table">Não há agendamentos!</p>
      )}
    </div>
  );
}

export default memo(ScheduleTable);
