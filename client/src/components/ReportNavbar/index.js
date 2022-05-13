import { useCallback, useEffect, useState } from 'react';
import CustomInput from '../CustomInput';
import './styles.scss';
import api from '../../api';
import { useConfirmationModalContext } from '../../Contexts/ConfirmationModalContext';
import Button from '../Button';
import { getFirstAndLastDayOfTheMonth, getFirstAndLastDayOfTheWeek, getFirstAndLastDayOfTheYear } from '../../utils/dates';

export default function ReportNavbar({ onDateIntervalChange }){
    const [values, setValues] = useState({});
    const [selected, setSelected] = useState('');

    const handleChange = useCallback((event) => {
        setValues((prevState) => {
            return {
                ...prevState,
                [event.target.name]: event.target.value
            }
        })
    }, [])

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

        api.get(`/api/scheduling/reports/${initialDate}/${finalDate}`).then((result) => {
            onDateIntervalChange(result['data']);
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
        api.get(`/api/scheduling/reports/${date}/${date}`).then((result) => {
            onDateIntervalChange(result['data']);
            setSelected('day');
            clearValues();
        })
    }

    function searchCurrentWeekData(){
        const { firstDayOfTheWeek, lastDayOfTheWeek } = getFirstAndLastDayOfTheWeek();

        api.get(`/api/scheduling/reports/${firstDayOfTheWeek}/${lastDayOfTheWeek}`).then((result) => {
            onDateIntervalChange(result['data']);
            setSelected('week');
            clearValues();
        })

    }

    function searchByCurrentMonth(){
        const { firstDayOfTheMonth, lastDayOfTheMonth } = getFirstAndLastDayOfTheMonth();

        api.get(`/api/scheduling/reports/${firstDayOfTheMonth}/${lastDayOfTheMonth}`).then((result) => {
            onDateIntervalChange(result['data']);
            setSelected('month');
            clearValues();
        })
    }

    function searchByCurrentYear(){
        const { firstDayOfTheYear, lastDayOfTheYear } = getFirstAndLastDayOfTheYear();

        api.get(`/api/scheduling/reports/${firstDayOfTheYear}/${lastDayOfTheYear}`).then((result) => {
            onDateIntervalChange(result['data']);
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
                    <CustomInput 
                    name="initialDate" 
                    id="initialDate" 
                    label="Data inicial"
                    onChange={handleChange}
                    value={values.initialDate || ""}
                    placeholder="Digite a data inicial"
                    mask="99/99/9999"
                    minLength="10"
                    />
                    <CustomInput 
                        name="finalDate" 
                        id="finalDate"
                        label="Data final"
                        onChange={handleChange}
                        value={values.finalDate || ""}
                        placeholder="Digite a data final"
                        mask="99/99/9999"
                        minLength="10"
                    />
                    <button onClick={handleSubmit} className='button'>Buscar</button>
                </form>
            </div>
            <div className="buttons">
                <Button className={`date-interval-button ${selected === 'day' && 'selected'}`} onClick={searchCurrentDateData}>Hoje</Button>
                <Button className={`date-interval-button ${selected === 'week' && 'selected'}`} onClick={searchCurrentWeekData}>Esta semana</Button>
                <Button className={`date-interval-button ${selected === 'month' && 'selected'}`} onClick={searchByCurrentMonth}>Este mês</Button>
                <Button className={`date-interval-button ${selected === 'year' && 'selected'}`} onClick={searchByCurrentYear}>Este ano</Button>
            </div>
        </div>
    )
}