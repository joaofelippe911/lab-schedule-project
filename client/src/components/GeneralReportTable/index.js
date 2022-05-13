import { memo } from "react";

function GenerealReportTable({ data: { general } }) {
  if (!general) {
    return null;
  }

  return (
    <div className="table-container">
      <div className="table-title">
        <h2>Agendamentos</h2>
      </div>
      {general.total > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Total</th>
              <th>Finalizados</th>
              <th>Recebimentos</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{general.total}</td>
              <td>{general.finished}</td>
              <td>
                {general.amount.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p className="empty-table">Não houveram agendamentos!</p>
      )}
    </div>
  );
}

export default memo(GenerealReportTable);
