import { useEffect, useState } from 'react';
import { CustomInput } from '../CustomInput';
import './styles.scss';
import api from '../../api';
import { useReportsDataContext } from '../../Contexts/ReportsContext';
import { useConfirmationModalContext } from '../../Contexts/ConfirmationModalContext';



export default function ReportNavbar(){
    const [values, setValues] = useState({});
    const [selected, setSelected] = useState('');

    const { handleSetData } = useReportsDataContext();

    function handleChange(event){
        setValues({
            ...values,
            [event.target.name]: event.target.value
        })
    }

    const { openConfirmationModal } = useConfirmationModalContext();

    function handleSubmit(event){
        event.preventDefault();
        if(!values.initialDate){
            return openConfirmationModal({title: "Informe a data inicial!", buttons: false});
        }

        if(!values.finalDate){
            return openConfirmationModal({title: "Informe a data final!", buttons: false});
        }

        if(values.initialDate.length < 10){
            return openConfirmationModal({title: "Data inicial inválida!", text: "Exemplo de data válida: 01/02/2022", buttons: false})
        }

        if(values.finalDate.length < 10){
            return openConfirmationModal({title: "Data final inválida!", text: "Exemplo de data válida: 01/02/2022", buttons: false})
        }

        const initialDate = values.initialDate.replaceAll("/", "-");
        const finalDate = values.finalDate.replaceAll("/", "-");

        api.get(`/api/schedules/reports/${initialDate}/${finalDate}`).then((result) => {
            handleSetData(result['data']);
            setSelected('');
        })
    }

    function searchCurrentDateData(){
        
        let date = new Date().toLocaleDateString("pt-br", {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        date = date.replaceAll("/", "-");
        api.get(`/api/schedules/reports/${date}/${date}`).then((result) => {
            handleSetData(result['data']);
            setSelected('day');
            clearValues();
        })
    }

    function searchCurrentWeekData(){
        const date = new Date();

        // SEPARO DIA MES ANO EM ARRAY
        let currentDateSplited = date.toLocaleDateString('pt-br', {
            year: "numeric",
            month: '2-digit',
            day: '2-digit',
        }).split("/");

        let currentMonthNumOfDays = new Date(currentDateSplited[2], currentDateSplited[1], 0).getDate();

        // PEGO O DIA DO MES ex DIA 31
        let dayOfMonth = parseInt(currentDateSplited[0]);
        let firstDayOfTheWeek;
        let lastDayOfTheWeek;

        // PEGO DIA DA SEMANA ex 4
        let currentDayOfWeek = new Date().getDay();
        if(dayOfMonth >= 7) {
            firstDayOfTheWeek = dayOfMonth - currentDayOfWeek;
            firstDayOfTheWeek = ('0' + (firstDayOfTheWeek)).slice(-2)+ '-' + currentDateSplited[1] + '-' + currentDateSplited[2] ;
        } else {
            let d = new Date(currentDateSplited[2], (currentDateSplited[1] - 1), 0);
            let previousMonthNumOfDays = d.getDate();
            firstDayOfTheWeek = previousMonthNumOfDays + (dayOfMonth - currentDayOfWeek);
            firstDayOfTheWeek = ('0' + (firstDayOfTheWeek)).slice(-2)+ '-' + (currentDateSplited[1] - 1) + '-' + currentDateSplited[2] ;
        }

        if(dayOfMonth <= (currentMonthNumOfDays - 7)){
            lastDayOfTheWeek = dayOfMonth.valueOf() + (6 - currentDayOfWeek);
            lastDayOfTheWeek = ('0' + (lastDayOfTheWeek)).slice(-2) + '-' + currentDateSplited[1] + '-' + currentDateSplited[2];
        } else {
            lastDayOfTheWeek = (6 - currentDayOfWeek) - (currentMonthNumOfDays - dayOfMonth);
            lastDayOfTheWeek =  ('0' + (lastDayOfTheWeek)).slice(-2) + '-' + ('0' + (date.getMonth() + 2)).slice(-2) + '-' + currentDateSplited[2];
        }

        api.get(`/api/schedules/reports/${firstDayOfTheWeek}/${lastDayOfTheWeek}`).then((result) => {
            handleSetData(result['data']);
            setSelected('week');
            clearValues();
        })

    }

    function searchByCurrentMonth(){
        const date = new Date();
        const currentDateSplited = date.toLocaleDateString("pt-br", {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).split("/");

        const month = currentDateSplited[1];

        let lastDay = new Date(currentDateSplited[2], month, 0);
        lastDay = lastDay.getDate();
        const initialDate = "01-" + month + "-" + currentDateSplited[2];
        const finalDate = lastDay + "-" + month + "-" + currentDateSplited[2];

        api.get(`/api/schedules/reports/${initialDate}/${finalDate}`).then((result) => {
            handleSetData(result['data']);
            setSelected('month');
            clearValues();
        })
    }

    function searchByCurrentYear(){
        const year = new Date().getFullYear();

        const initialDate = "01-01-" + year;
        const finalDate = "31-12-" + year;

        api.get(`/api/schedules/reports/${initialDate}/${finalDate}`).then((result) => {
            handleSetData(result['data']);
            setSelected('year');
            clearValues();
        })
    }

    function clearValues(){
        if(Object.keys(values).length > 0) {
            setValues({initialDate: '', finalDate: ''})
        }
    }

    useEffect(() => {
        searchByCurrentMonth();
    }, [])

    return (
        <div className="report-navigation">
            <div className="fields">
                <form id="custom-date-search" autoComplete="off">
                    <div className="input-container">
                        <div className="single-input-container">
                            <label htmlFor="initialDate">Data inicial:</label>
                            <CustomInput 
                            name="initialDate" 
                            id="initialDate" 
                            onChange={handleChange}
                            value={values.initialDate}
                            placeholder="Digite a data inicial"
                            mask="99/99/9999"
                            minLength="10"
                            />
                        </div>
                        <div className="single-input-container">
                            <label htmlFor="finalDate">Data final:</label>
                            <CustomInput 
                                name="finalDate" 
                                id="finalDate" 
                                onChange={handleChange}
                                value={values.finalDate}
                                placeholder="Digite a data final"
                                mask="99/99/9999"
                                minLength="10"
                            />
                        </div>
                    </div>
                    <button onClick={handleSubmit} className='button'>Buscar</button>
                </form>
            </div>
            <div className="buttons">
                <button className={`button date-interval-button ${selected === 'day' && 'selected'}`} onClick={searchCurrentDateData}>Hoje</button>
                <button className={`button date-interval-button ${selected === 'week' && 'selected'}`} onClick={searchCurrentWeekData}>Esta semana</button>
                <button className={`button date-interval-button ${selected === 'month' && 'selected'}`} onClick={searchByCurrentMonth}>Este mês</button>
                <button className={`button date-interval-button ${selected === 'year' && 'selected'}`} onClick={searchByCurrentYear}>Este ano</button>
            </div>
        </div>
    )
}