import { useState, useEffect, memo } from "react";
import api from "../../api";

import { mask as masker } from 'remask';
import { useScheduleModalContext } from "../../Contexts/ScheduleModalContext";
import { EditButton } from "../EditButton";

function ScheduleTable({isHistory, isUnlimited}) {
    const [ schedules, setSchedules ] = useState([]);

    const { openModal, modalState: { visible } } = useScheduleModalContext();

    function handleOpenModal(id){
        openModal({id: id});
    }

    useEffect(() => {        
        (async ()=> {
            if(!isHistory) {
                const { data } = await api.get("/api/schedules/");
                setSchedules(data);
            } else {
                const { data } = await api.get("/api/schedules/history", { params : {isUnlimited: isUnlimited} });
                setSchedules(data);
            }            
        })();
        const  updateInterval = setInterval((async ()=>{
            if(!isHistory) {
                const { data } = await api.get("/api/schedules/");
                setSchedules(data);
            } else {
                const { data } = await api.get("/api/schedules/history");
                setSchedules(data);
            }
        }), 120000)
        
        return () => {
            if(updateInterval !== undefined) {
                clearInterval(updateInterval);
            }
        }
    }, [visible, isUnlimited]);

    return (
        <div className="table-container">
            {schedules.length > 0 ? <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Endereço</th>
                        <th>Telefone</th>
                        <th>Requisição</th>
                        <th>Valor</th>
                        <th>Data</th>
                        <th>Horário</th>
                        <th>{!isHistory ? "Status" : "Usuário"}</th>
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
                            <td>{!isHistory ? schedule.sname : schedule.username}</td>
                            <td>
                                <EditButton 
                                    onClick={
                                        () => handleOpenModal(schedule.schedule_id)
                                    } 
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table> : <p>Não há agendamentos!</p>}
            
        </div>
    )
}

export default memo(ScheduleTable)