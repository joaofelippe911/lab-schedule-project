import { useScheduleModalContext } from '../../Contexts/ScheduleModalContext';
import { useConfirmationModalContext } from '../../Contexts/ConfirmationModalContext';
import api from '../../api';
import { useEffect, useState } from 'react';
import { CustomInput } from '../CustomInput';
import { mask as masker } from 'remask';

export default function ScheduleModal({visible = false, scheduleId}){
    const [schedule, setSchedule] = useState({});
    const [values, setValues] = useState({});
    const [availableTimes, setAvailableTimes] = useState([]);
    const [firstTimeRenderingTimes, setFirstTimeRenderingTimes] = useState(true);
    const { closeModal } = useScheduleModalContext();
    const { openConfirmationModal } = useConfirmationModalContext();
    const user = JSON.parse(localStorage.getItem('user'));

    const currencyFormatArray = ["9,99", "99,99", "999,99", "9.999,99", "99.999,99", "999.999,99"];

    useEffect(()=>{
        setFirstTimeRenderingTimes(true)
        if(visible) {
            (async ()=> {
                const { data } = await api.get(`/api/schedules/${scheduleId}`);
                setSchedule(data);
                let dateOfCollect = new Date(data[0].date).toLocaleDateString("pt-br", {
                  year: "numeric",
                  day: "2-digit",
                  month: "2-digit"
                });
                setValues({
                  scheduleId: data[0].schedule_id, 
                  date: dateOfCollect, 
                  time: data[0].time, 
                  note: data[0].note, 
                  price: masker(data[0].price.toFixed(2).replace(".", ""), currencyFormatArray),
                  requisitationNumber : data[0].requisitation_number
                });
                dateOfCollect = dateOfCollect.split("/").reverse().join("-");
                api.get(`/api/schedules/times/${dateOfCollect}/${data[0].schedule_id}`).then((response) => {
                  setAvailableTimes(response.data);
                  setFirstTimeRenderingTimes(true)
                });
            })();
        }
    },[visible])

    useEffect(() => {
      if (values.date !== undefined) {
        if(!firstTimeRenderingTimes) {
          if (values.date.length === 10) {
            const dateOfCollect = values.date.split("/").reverse().join("-");
            api.get(`/api/schedules/times/${dateOfCollect}`).then((response) => {
              setAvailableTimes(response.data);
            });   
          } else {
            setAvailableTimes([]);
            if(values.time){
              values.time = '';
            }
          }
        } else {
          setFirstTimeRenderingTimes(false);
        }   
      }
    }, [values.date]);

    if(!visible || schedule[0] === undefined || values.price === undefined){
        return ( 
            <div className="modal-wrapper">
                <p>Nothing here...</p>;
            </div>
        )
    }

    function handleChange(event) {
        setValues({
          ...values,
          [event.target.name]: event.target.value,
        });
    }

    function handleUpdateSchedule(){
      values.price = values.price.replace('.', '').replace(',', '.');
      values.date = values.date.split("/").reverse().join("-");

      api.put(`/api/schedules/${values.scheduleId}`, values).then(() => {
        closeModal()
      })
    }

    function handleFinishSchedule(){
      api.put(`api/schedules/finish/${scheduleId}`, {userId: user.id}).then(() => {
        openConfirmationModal({title: "Agendamento finalizado com sucesso!", buttons: false, timer: 2000});
        closeModal();
      }).catch(() => {
        openConfirmationModal({title: "Houve um erro ao finalizar o agendamento! Por favor, entre em contato com um administrador.", buttons: false});
      })
    }

    function handleMeetSchedule(){
      api.put(`/api/schedules/meet/${scheduleId}`, {userId: user.id}).then(() => {
        openConfirmationModal({title: "Atendimento inicializado com sucesso!", buttons: false, timer: 2000});
        closeModal();
      }).catch(() => {
        openConfirmationModal({title: "Houve um erro ao iniciar o atendimento! Por favor, entre em contato com um administrador.", buttons: false});
      })
    }

    function handleReopenSchedule(){
      api.put(`/api/schedules/reopen/${scheduleId}`).then(() => {
        openConfirmationModal({title: "Agendamento reaberto com sucesso!", buttons: false, timer: 2000});
        closeModal();
      }).catch(() => {
        openConfirmationModal({title: "Houve um erro ao reabrir o agendamento! Por favor, entre em contato com um administrador.", buttons: false});
      })
    }
    
    return (
        <div className="modal-wrapper visible">
            <div className="modal-content">
              <div className="modal-header">
                  <button onClick={closeModal}><i className="fa-solid fa-xmark"></i></button>
              </div>
              <div className="modal-main">
                <form autoComplete="off">
              
                  <div className="input-container">
                    <div className="single-input-container">
                      <label htmlFor="patientName">Nome do paciente:</label>
                      <CustomInput
                        type="text"
                        name="patientName"
                        value={schedule[0].patient_name}
                        readOnly
                      />
                    </div>

                    <div className="single-input-container">
                      <label htmlFor="birth">Data de nascimento:</label>
                      <CustomInput
                        type="text"
                        name="birth"
                        value={new Date(schedule[0].birth).toLocaleDateString("pt-br")}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="input-container">
                    <div className="single-input-container">
                      <label htmlFor="cpf">CPF:</label>
                      <CustomInput
                        type="text"
                        name="cpf"
                        value={masker(schedule[0].cpf, ["999.999.999-99"])}
                        readOnly
                      />
                    </div>
                    <div className="single-input-container">
                      <label htmlFor="phone">Telefone:</label>
                      <CustomInput
                        type="text"
                        name="phone"
                        value={masker(schedule[0].phone, ["(99) 9999-9999", "(99) 9 9999-9999"])}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="input-container">
                    <div className="single-input-container">
                      <label htmlFor="address">Endereço:</label>
                      <CustomInput
                        type="text"
                        name="address"
                        value={schedule[0].address}
                        readOnly
                      />
                    </div>
                    <div className="single-input-container">
                      <label htmlFor="neighborhood">Bairro:</label>
                      <CustomInput
                        type="text"
                        name="neighborhood"
                        value={schedule[0].neighborhood}
                        readOnly
                      />
                    </div>
                  </div>
                  
                  
                  <div className="input-container">
                    <div className="single-input-container">
                      <label htmlFor="number">Número:</label>
                      <CustomInput
                        type="text"
                        name="number"
                        value={schedule[0].number}
                        readOnly
                      />
                    </div>

                    <div className="single-input-container">
                      <label htmlFor="cep">CEP:</label>
                      <CustomInput
                        type="text"
                        name="cep"
                        value={schedule[0].cep !== null ? masker(schedule[0].cep, ["99999-999"]) : ''}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="input-container">
                    <div className="single-input-container">
                      <label htmlFor="date">Data da coleta:</label>
                      <CustomInput
                        type="text"
                        name="date"
                        value={values.date}
                        onChange={handleChange}
                        mask="99/99/9999"
                        placeholder="Digite a data da coleta"
                        required
                      />
                    </div>

                    <div className="single-input-container">
                      <label htmlFor="time">Horário da coleta:</label>
                      <select
                        name="time"
                        value={values.time}
                        required
                        onChange={handleChange}
                        disabled={availableTimes.length === 0 ? true : false}
                      >
                        <option value="">Selecione um horário</option>
                        
                        {availableTimes.map((time) => {
                          return <option key={time.id} value={time.id}>{time.hour.slice(0,5)}</option>
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="input-container">
                    <div className="single-input-container">
                      <label htmlFor="responsibleName">Nome do responsável:</label>
                      <CustomInput
                        type="text"
                        name="responsibleName"
                        value={schedule[0].responsible_name !== null ? schedule[0].responsible_name : ''}
                        placeholder="Não informado"
                        onChange={handleChange}
                        readOnly
                      />
                    </div>
                    <div className="single-input-container">
                      <label htmlFor="phone">Telefone do responsável:</label>
                      <CustomInput
                        type="text"
                        name="responsiblePhone"
                        value={schedule[0].responsible_phone !== null ? masker(schedule[0].responsible_phone, ['(99) 9999-9999', '(99) 9 9999-9999']) : ''}
                        onChange={handleChange}
                        mask={['(99) 9999-9999', '(99) 9 9999-9999']}
                        placeholder="Não informado"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="input-container">
                    <div className="single-input-container">
                      <label htmlFor="requisitationNumber">Número da requisição:</label>
                      <CustomInput
                        type="text"
                        name="requisitationNumber"
                        value={values.requisitationNumber}
                        onChange={handleChange}
                        mask={["999999"]}
                        placeholder="Digite o número da requisição"
                        required
                      />
                    </div>
                    <div className="single-input-container">
                      <label htmlFor="price">Valor (R$)</label>
                      <CustomInput
                        name="price"
                        value={values.price}
                        onChange={handleChange}
                        mask={currencyFormatArray}
                        placeholder="Digite o valor"
                        required
                      />
                    </div>
                  </div>
                  <label htmlFor="note">Observações:</label>
                  <textarea
                    name="note"
                    placeholder="Digite aqui a sua mensagem"
                    onChange={handleChange}
                    value={values.note || ''}
                    rows="5"
                  ></textarea>
                  <div className="buttons-container">
                    {[1, 2, 3].includes(user.role) ?
                      schedule[0].id_status === 1 
                        ? 
                        <button 
                          onClick={(e) => {
                            e.preventDefault();

                            openConfirmationModal({
                              title: "Deseja realmente iniciar o atendimento desse agendamento?",
                              fnc: handleMeetSchedule
                            })
                          }} 
                          className="button green-button"> Atender
                        </button> 
                        : 
                        schedule[0].id_status === 2 
                        ? 
                        <button 
                          onClick={(e) => {
                            e.preventDefault();

                            openConfirmationModal({
                              title: "Deseja realmente finalizar o atendimento desse agendamento?",
                              fnc: handleFinishSchedule
                            })
                          }} 
                          className="button red-button">Finalizar
                        </button> 
                        : 
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            openConfirmationModal({
                              title: "Deseja realmente reabrir esse agendamento?",
                              fnc: handleReopenSchedule
                            })
                          }} 
                          className="button red-button">Reabrir
                        </button>
                      : ''
                    }
                    <button className="button" onClick={(e) => {
                      e.preventDefault();

                      openConfirmationModal({
                        title: "Deseja realmente salvar as alterações?",
                        fnc: handleUpdateSchedule
                      })
                    }}>Salvar</button>
                  </div>
                    
                </form>
                </div>
                
            </div>            
        </div>
    )
}