import GenerealReportTable from "../components/GeneralReportTable";
import GreetersReportTable from "../components/GreetersReportTable";
import ReportNavbar from "../components/ReportNavbar";
import TecniciansReportTable from "../components/TecniciansReportTable";

import '../styles/reports.scss';

export default function Reports(){

    return (
        <main>
            <div id="reports-page">
                <ReportNavbar />
                <div className="general reports-container">
                    <div className="title">
                        <h2>Agendamentos</h2>
                    </div>
                    <GenerealReportTable />
                </div>
                <div className="tecnicians reports-container">
                    <div className="title">
                        <h2>Número de atendimentos por usuário</h2>
                    </div>
                    <TecniciansReportTable />
                </div>

                <div className="greeters reports-container">
                    <div className="title">
                        <h2>Número de cadastros por usuário</h2>
                    </div>
                    <GreetersReportTable />
                </div>
                
            </div>
        </main>
    )
}