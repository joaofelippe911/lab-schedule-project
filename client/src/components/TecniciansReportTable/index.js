import { memo } from "react";

function TecniciansReportTable({ data: { tecnicians } }) {
  if (!tecnicians) {
    return null;
  }

  return (
    <div className="table-container">
      <div className="table-title">
        <h2>Número de atendimentos por usuário</h2>
      </div>
      {tecnicians.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Total</th>
              <th>Recebimentos</th>
            </tr>
          </thead>
          <tbody>
            {tecnicians.map((tecnician) => (
              <tr key={tecnician.uid}>
                <td>{tecnician.username}</td>
                <td>{tecnician.total}</td>
                <td>
                  {tecnician.amount.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="empty-table">Não houveram atendimentos!</p>
      )}
    </div>
  );
}

export default memo(TecniciansReportTable);
