
import { useEffect, useState } from 'react';
import api from '../../api';
import { useScheduleModalContext } from '../../Contexts/ScheduleModalContext';

import './styles.scss';

export default function ScheduleCards() {

    const [cardData, setCardData] = useState([])

    const { modalState: { visible } } = useScheduleModalContext();

    useEffect(() => {
        (async () => {
            const { data } = await api.get("/api/schedules/month-numbers");
            setCardData(data)
        })()

        const updateInterval = setInterval((async () => {
            const { data } = await api.get("/api/schedules/month-numbers");
            setCardData(data)
        }), 120000);

        return () => {
            if(updateInterval !== undefined) {
                clearInterval(updateInterval);
            }
        }
    }, [visible])

    return (
        <>
            <div className="card">
                <div className="card-title">
                    <p>Hoje</p>
                    <p className="text-blue">{cardData.currentDay?.finished}/{cardData.currentDay?.total}</p>
                </div>
                <div className="card-content">
                    <div className="card-icon blue">
                        <i className="fas fa-calendar-day"></i>
                    </div>
                    <div className="card-text">
                        {cardData.currentDay?.total > 0 ? "Já foram realizadas " + cardData.currentDay?.finished + " das " + cardData.currentDay?.total + " coletas agendadas!" : "Não há agendamentos!"}
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-title">
                    <p>Esta semana</p>
                    <p className="text-yellow">{cardData.currentWeek?.finished}/{cardData.currentWeek?.total}</p>
                </div>
                <div className="card-content">
                    <div className="card-icon yellow">
                    <i className="fa-solid fa-calendar-week"></i>
                    </div>
                    <div className="card-text">
                        {cardData.currentWeek?.total > 0 ? "Já foram realizadas " + cardData.currentWeek.finished + " das " + cardData.currentWeek.total + " coletas agendadas!" : "Não há agendamentos!"}
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-title">
                    <p>Este mês</p>
                    <p className="text-green">{cardData.currentMonth?.finished}/{cardData.currentMonth?.total}</p>
                </div>
                <div className="card-content">
                    <div className="card-icon green">
                    <i className="fa-solid fa-calendar-days"></i>
                    </div>
                    <div className="card-text">
                        {cardData.currentMonth?.total > 0 ? "Já foram realizadas " + cardData.currentMonth?.finished + " das " + cardData.currentMonth?.total +  " coletas agendadas!" : "Não há agendamentos!"}
                    </div>
                </div>
            </div>
        </>
    )
}