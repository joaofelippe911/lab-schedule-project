import HoraryTable from "../components/HoraryTable";

import '../styles/horary.scss';

export default function Horary(){

    return (
        <main>
            <div id="horary-page">
                <div className="horary-container">
                    <div className="horary-title">
                        <h2>Horários</h2>
                    </div>
                    <HoraryTable />
                </div>
            </div>
        </main>
        
    )
}