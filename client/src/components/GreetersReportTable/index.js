import { memo } from "react";

function GreetersReportTable({ data: { greeters } }) {
  if (!greeters) {
    return null;
  }

  return (
    <div className="table-container">
      <div className="table-title">
        <h2>Número de cadastros por usuário</h2>
      </div>
      {greeters.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {greeters.map((greeter) => (
              <tr key={greeter.id}>
                <td>{greeter.username}</td>
                <td>{greeter.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="empty-table">Não houveram agendamentos cadastrados!</p>
      )}
    </div>
  );
}

export default memo(GreetersReportTable);
