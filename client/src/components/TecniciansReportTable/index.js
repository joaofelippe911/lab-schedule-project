import { useReportsDataContext } from "../../Contexts/ReportsContext"

export default function TecniciansReportTable(){
    const { reportsData: { tecnicians } } = useReportsDataContext();

    if(!tecnicians){
        return null;
    }

    return (
        <div className="table-container">
            {tecnicians.length > 0 ?
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
                            <td>{tecnician.amount.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                                minimumFractionDigits: 2
                            })}</td>
                        </tr>
                    ))}
                </tbody>
            </table> : <p>Não houveram atendimentos!</p>}
        </div>
    )
}