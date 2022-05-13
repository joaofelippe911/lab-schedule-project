import Button from "../Button";

export default function TimeTable({ times, inactivateTime, activateTime }) {
  return (
    <div className="table-container">
      <div className="table-title">
        <h2>Horários</h2>
      </div>
      {times.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Horário</th>
              <th>N° de agendamentos</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {times.map((time) => (
              <tr key={time.id}>
                <td>{time.hour.slice(0, 5)}</td>
                <td>{time.total}</td>
                <td>{time.status === 1 ? "Ativo" : "Inativo"}</td>
                <td>
                  {time.status === 1 ? (
                    <Button
                      className="time-button"
                      bg="red"
                      onClick={() => {
                        inactivateTime(time.id);
                      }}
                    >
                      Inativar
                    </Button>
                  ) : (
                    <Button
                      className="time-button"
                      bg="green"
                      onClick={() => {
                        activateTime(time.id);
                      }}
                    >
                      Ativar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="empty-table">Não há horários cadastrados!</p>
      )}
    </div>
  );
}
