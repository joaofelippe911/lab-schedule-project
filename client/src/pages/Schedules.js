import Sidebar from "../components/Sidebar";

import { useEffect, useState, useContext, useMemo } from "react";
import { Context } from "../Contexts/AuthContext";
import api from "../api";
import { mask as masker } from 'remask';
import { useTable } from 'react-table';

import '../styles/schedules.scss';
import ScheduleModal from "../components/ScheduleModal";
import { useScheduleModalContext } from "../Contexts/ScheduleModalContext";

export default function Schedules() {
     //const { handleLogout } = useContext(Context);
    //const [ user, setUser ] = useState([]);

    const [ schedules, setSchedules ] = useState([]);

    const { modalState: {id, visible}, openModal } = useScheduleModalContext();

    useEffect(() => {
        // const userData = JSON.parse(localStorage.getItem('user'));
        // setUser(userData);
        (async ()=> {
            const { data } = await api.get("/admin/");

            setSchedules(data);
        })();
        console.log("rodei useEffect gg")
        const  updateTimeout = setInterval((async ()=>{
            const { data } = await api.get("/admin/");
            console.log("rodei interval");

            setSchedules(data);
        }), 5000)
        
        return () => {
            if(updateTimeout !== undefined) {
                console.log("console aq")
                clearInterval(updateTimeout);
            }
        }
    }, [visible]);


    function handleOpenModal(id){
        openModal({id: id});
    }

    return (
        <div id="schedules-page">
            <ScheduleModal visible={visible} scheduleId={id} />
            <div className="container">
                <Sidebar active="schedules" />
                <main>
                    <div className="cards-container">
                        <div className="card">
                            <div className="card-title">
                                <p>Hoje</p>
                                <p className="text-blue">12/17</p>
                            </div>
                            <div className="card-content">
                                <div className="card-icon text-blue">
                                    <p>icone</p>
                                </div>
                                <div className="card-text">
                                    Já foram realizadas 12 das 17 coletas agendadas!
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-title">
                                <p>Essa semana</p>
                                <p className="text-yellow">45/182</p>
                            </div>
                            <div className="card-content">
                                <div className="card-icon text-yellow">
                                    <p>icone</p>
                                </div>
                                <div className="card-text">
                                    Já foram realizadas 45 das 182 coletas agendadas!
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-title">
                                <p>Esse mês</p>
                                <p className="text-green">120/460</p>
                            </div>
                            <div className="card-content">
                                <div className="card-icon text-green">
                                    <p>icone</p>
                                </div>
                                <div className="card-text">
                                    Já foram realizadas 120 das 460 coletas agendadas!
                                </div>
                            </div></div>
                    </div>
                    <div className="schedules-container">
                        <div className="schedules-title">
                            <h2>Lista de agendamentos</h2>
                        </div>
                        <div className="schedules-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Endereço</th>
                                        <th>Telefone</th>
                                        <th>Requisição</th>
                                        <th>Valor</th>
                                        <th>Data</th>
                                        <th>Horário</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {schedules.map((schedule)=>(
                                        <tr key={schedule.schedule_id}>
                                            <td>{schedule.patient_name}</td>
                                            <td>{schedule.address}, {schedule.number}, {schedule.neighborhood} {schedule.cep !== "" && schedule.cep !== null ? "- " + masker(schedule.cep, ["99999-999"]) : ""}</td>
                                            <td>{masker(schedule.phone, ["(99) 9999-9999", "(99) 9 9999-9999"])}</td>
                                            <td>{schedule.requisitation_number}</td>
                                            <td>{schedule.price.toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL',
                                                minimumFractionDigits: 2
                                            })}</td>
                                            <td>{new Date(schedule.date).toLocaleDateString('pt-br')}</td>
                                            <td>{schedule.hour.slice(0, 5)}</td>
                                            <td><button className="edit-button" onClick={
                                                () => {
                                                    handleOpenModal(schedule.schedule_id);
                                                }
                                            }>Expand</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
        
    )
}