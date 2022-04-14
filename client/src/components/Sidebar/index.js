import './styles.scss';
import { NavLink } from 'react-router-dom';

import { Context } from '../../Contexts/AuthContext';
import { useContext } from 'react';

export default function Sidebar() {
    const { name, role } = JSON.parse(localStorage.getItem('user'));

    const { handleLogout } = useContext(Context);
    
    return (
        <div className="sidebar-responsive" id="sidebar">
            <div className="sidebar-top">
                <h2>Laboratório São João</h2>
                <p>Olá, {name}</p>
            </div>
            <nav className="sidebar-menu">
                <h2 className="group-title">Agendamentos</h2>
                <ul>
                    <li>
                        <NavLink to="/admin/novo-agendamento" activeClassName='active' >Novo agendamento</NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/agendamentos" activeClassName='active' >Pendentes</NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/historico" activeClassName='active' >Historico</NavLink>
                    </li>
                </ul>                   
                <h2 className="group-title">Administração</h2>
                <ul>
                    {role <= 3 ?
                        <li>
                            <NavLink to="/admin/horarios" activeClassName='active'>Horários</NavLink>
                        </li>
                    : ''}
                    <li>
                        <NavLink to="/admin/relatorios" activeClassName='active' >Relatórios</NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/usuarios" activeClassName='active'  >Usuários</NavLink>
                    </li>
                </ul>
                <button onClick={handleLogout} className="logout-button"><i className="fa-solid fa-right-from-bracket"></i> Sair</button>
            </nav>
        </div>
    )
}