import { memo } from "react";
import { useReportsDataContext } from "../../Contexts/ReportsContext"


function GenerealReportTable(){
    const { reportsData: { general } } = useReportsDataContext();
    if(!general){
        return null;
    }

    return (
        <div className="table-container">
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
                        <td>{general.amount.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                                minimumFractionDigits: 2
                            })}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
    )
}

export default memo(GenerealReportTable);