import './styles.scss';
import whiteBioprevLogo from '../../images/logo_bioprev_branca.png';
import { Link } from 'react-router-dom';

export default function Sidebar({active}) {
    return (
        <div className="sidebar-responsive" id="sidebar">
            <div className="sidebar-top">
                <h3>Laboratório São João</h3>
            </div>
            <div className="sidebar-menu">
                <h2 className="group-title">Coletas</h2>
                <Link to="/admin/novo-agendamento">
                    <div className={active == "scheduling" ? "active sidebar-link" : "sidebar-link"}>
                        Novo agendamento
                    </div>
                </Link>
                <Link to="/admin/agendamentos">
                    <div className={active == "schedules" ? "active sidebar-link" : "sidebar-link"}>
                        Agendamentos
                    </div>
                </Link>
                
                    
                
                <div className="sidebar-link">
                    <a href="#">Histórico</a>
                </div>
                <div className="sidebar-link">
                    <a href="#">Relatórios</a>
                </div>
            </div>
        </div>
    )
}