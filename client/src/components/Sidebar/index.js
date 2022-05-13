import './styles.scss';
import { NavLink } from 'react-router-dom';

import { Context } from '../../Contexts/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { useConfirmationModalContext } from '../../Contexts/ConfirmationModalContext';

export default function Sidebar({onCollapse}) {
    const { name, role } = JSON.parse(localStorage.getItem('user'));
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [fixed, setFixed] = useState(false);

    function openSidebar(){
        setSidebarOpen(true);
    }

    function closeSidebar(){
        setSidebarOpen(false);
    }

    function handleFix(){
        setFixed(true);
    }

    function handleUnfix(){
        setFixed(false);
    }

    function handleNavigate(){
        if(!fixed){
            closeSidebar();
        }
    }

    useEffect(() => {
        onCollapse(sidebarOpen);
    }, [sidebarOpen])


    const { handleLogout } = useContext(Context);
    const { openConfirmationModal } = useConfirmationModalContext();
    
    return (
        <div className={`sidebar-responsive ${!sidebarOpen ? 'closed' : ''}`} id="sidebar">
            <div className="siderbar-buttons">
                {sidebarOpen ? 
                    <>
                        <button onClick={closeSidebar} className="sidebar-actions-btn"><i className="fa-solid fa-xmark"></i></button>
                        {fixed ? <button className="sidebar-actions-btn" onClick={handleUnfix}><i className="fa-solid fa-lock"></i></button> : <button className="sidebar-actions-btn" onClick={handleFix}><i className="fa-solid fa-lock-open"></i></button>}
                    </>
                    :
                    <button onClick={openSidebar} className="sidebar-actions-btn"><i className="fa-solid fa-bars"></i></button>
                }
            </div>
            <div className={`sidebar-top ${!sidebarOpen ? 'hidden' : ''}`}>
                <h2>Laboratório São João</h2>
                <p>Olá, {name}</p>
            </div>
            <nav className={`sidebar-menu ${!sidebarOpen ? 'hidden' : ''}`}>
                <h2 className="group-title">Agendamentos</h2>
                <ul>
                    <li>
                        <NavLink to="/novo-agendamento" onClick={handleNavigate} activeClassName='active' >Novo agendamento</NavLink>
                    </li>
                    <li>
                        <NavLink to="/agendamentos" onClick={handleNavigate} activeClassName='active' >Pendentes</NavLink>
                    </li>
                    <li>
                        <NavLink to="/historico" onClick={handleNavigate} activeClassName='active' >Histórico</NavLink>
                    </li>
                </ul>                   
                {role <= 3 ?
                    <>
                    <h2 className="group-title">Administração</h2>
                    <ul>
                            <li>
                                <NavLink to="/horarios" onClick={handleNavigate} activeClassName='active'>Horários</NavLink>
                            </li>
                        {[1, 3].includes(role) && 
                            <>
                                <li>
                                    <NavLink to="/relatorios" onClick={handleNavigate} activeClassName='active' >Relatórios</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/usuarios" onClick={handleNavigate} activeClassName='active'  >Usuários</NavLink>
                                </li>
                            </>
                        }
                        
                    </ul>
                </>
                : ''}
                <button onClick={() => {
                    openConfirmationModal({title: "Deseja realmente sair do sistema?", text: "Para acessar o sistema novamente, você precisará realizar o login.", fnc: handleLogout})
                }} className="logout-button red-text"><i className="fa-solid fa-right-from-bracket"></i> Sair</button>
            </nav>
        </div>
    )
}