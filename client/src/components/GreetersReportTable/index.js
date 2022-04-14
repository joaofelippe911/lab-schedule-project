import { useReportsDataContext } from "../../Contexts/ReportsContext"

export default function GreetersReportTable(){
    const { reportsData: { greeters } } = useReportsDataContext();

    if(!greeters){
        return null;
    }

    return (
        <div className="table-container">
            {greeters.length > 0 ?
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
            </table> : <p>Não houveram agendamentos cadastrados!</p> }
        </div>
    )
}