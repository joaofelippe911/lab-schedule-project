import './styles.scss';
import { useScheduleModalContext } from '../../Contexts/ScheduleModalContext';
import api from '../../api';
import { useEffect, useState } from 'react';
import { MaskedInput } from '../MaskedInput';
import { mask as masker, unMask as unMasker } from 'remask';

export default function ScheduleModal({visible = false, scheduleId}){
    const [schedule, setSchedule] = useState({});
    const [values, setValues] = useState({});
    const [availableTimes, setAvailableTimes] = useState([]);
    const [firstTimeRenderingTimes, setFirstTimeRenderingTimes] = useState(true);
    const { closeModal } = useScheduleModalContext();

    const currencyFormatArray = ["9,99", "99,99", "999,99", "9.999,99", "99.999,99", "999.999,99"];

    useEffect(()=>{
        setFirstTimeRenderingTimes(true)
        if(visible) {
            (async ()=> {
                const { data } = await api.post("/admin/search-schedule", { id: scheduleId });
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
                dateOfCollect = dateOfCollect.split("/");
                dateOfCollect = dateOfCollect[2] + "-" + dateOfCollect[1] + "-" + dateOfCollect[0];
                api.get(`/api/scheduling/times/getOnViewing`, { params: { dateOfCollect: dateOfCollect, scheduleId: data[0].schedule_id } }).then((response) => {
                  setAvailableTimes(response.data);
                  setFirstTimeRenderingTimes(true)
                });
            })();
        }
    },[visible])

    useEffect(() => {
      let dateOfCollect = values.date;
      if (dateOfCollect !== undefined) {
        if(!firstTimeRenderingTimes) {
          dateOfCollect = unMasker(dateOfCollect);
  
          if (dateOfCollect.length === 8) {
            dateOfCollect = masker(dateOfCollect, ["99-99-9999"]);
            dateOfCollect = dateOfCollect.split("-");
            dateOfCollect = dateOfCollect[2] + dateOfCollect[1] + dateOfCollect[0];
            dateOfCollect = masker(dateOfCollect, ["9999-99-99"]);

              api.get(`/api/scheduling/times/get/${dateOfCollect}`).then((response) => {
                setAvailableTimes(response.data);
              });   
          } else {
            setAvailableTimes([]);
            if(values.time){
              console.log(values.time);
              values.time = '';
            }
          }
        } else {
          setFirstTimeRenderingTimes(false);
        }   
      }
    }, [values.date]);

    if(!visible || schedule[0] == undefined || values.price == undefined){
        return ( 
            <div className={`modal-wrapper ${visible ? 'visible' : ''}`}>
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

    function handleUpdateSchedule(event){
      event.preventDefault();

      console.log(values);
      values.price = values.price.replace('.', '');
      values.price = values.price.replace(',', '.');

      values.date = values.date.split("/");
      values.date = values.date[2] + "-" + values.date[1] + "-" + values.date[0];

      console.log(values)

      api.post("/api/update", values).then(() => {
        closeModal()
      })
    }

    console.log(schedule)
    console.log(values)
    console.log(availableTimes);

    return (
        <div className={`modal-wrapper ${visible ? 'visible' : ''}`}>
            <div className="modal-content">
                <div className="modal-header">
                    <button onClick={closeModal}>Fechar</button>
                </div>
                <div className="modal-main">
                <form onSubmit={handleUpdateSchedule} autoComplete="off">
              
              <div className="input-container">
                <div className="single-input-container">
                  <label htmlFor="patientName">Nome do paciente:</label>
                  <input
                    type="text"
                
                    name="patientName"
                    placeholder="Digite o nome do paciente"
                    required
                    onChange={handleChange}
                    value={schedule[0].patient_name}
                    readOnly
                  />
                </div>

                <div className="single-input-container">
                  <label htmlFor="birth">Data de nascimento:</label>
                  <MaskedInput
                    value={new Date(schedule[0].birth).toLocaleDateString("pt-br")}
                    name="birth"
                    onChange={handleChange}
                    mask="99/99/9999"
                    placeholder="Digite a data de nascimento"
                    required
                    readOnly
                  />
                </div>
              </div>
              <div className="input-container">
                <div className="single-input-container">
                  <label htmlFor="cpf">CPF:</label>
                  <MaskedInput
                    value={masker(schedule[0].cpf, ["999.999.999-99"])}
                    name="cpf"
                    onChange={handleChange}
                    mask="999.999.999-99"
                    placeholder="Digite o CPF"
                    required
                    readOnly
                  />
                </div>
                <div className="single-input-container">
                  <label htmlFor="phone">Telefone:</label>
                  <MaskedInput
                    value={masker(schedule[0].phone, ["(99) 9999-9999", "(99) 9 9999-9999"])}
                    name="phone"
                    onChange={handleChange}
                    mask={["(99) 9999-9999", "(99) 9 9999-9999"]}
                    placeholder="Digite o telefone"
                    required
                    readOnly
                  />
                </div>
              </div>
              <div className="input-container">
                <div className="single-input-container">
                  <label htmlFor="address">Endereço:</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Digite o endereço para coleta"
                    required
                    onChange={handleChange}
                    value={schedule[0].address}
                    readOnly
                  />
                </div>
                <div className="single-input-container">
                  <label htmlFor="neighborhood">Bairro:</label>
                  <input
                    type="text"
                    name="neighborhood"
                    placeholder="Digite o bairro"
                    required
                    onChange={handleChange}
                    value={schedule[0].neighborhood}
                    readOnly
                  />
                </div>
              </div>
              
              
              <div className="input-container">
                <div className="single-input-container">
                  <label htmlFor="number">Número:</label>
                  <input
                    type="text"
                    name="number"
                    placeholder="Digite o número"
                    required
                    onChange={handleChange}
                    value={schedule[0].number}
                    readOnly
                  />
                </div>

                <div className="single-input-container">
                  <label htmlFor="cep">CEP:</label>
                  <MaskedInput
                    value={schedule[0].cep !== null ? masker(schedule[0].cep, ["99999-999"]) : ''}
                    name="cep"
                    onChange={handleChange}
                    mask="99999-999"
                    placeholder="Digite o CEP"
                    readOnly
                  />
                </div>
              </div>

              <div className="input-container">
                <div className="single-input-container">
                  <label htmlFor="date">Data da coleta:</label>
                  <MaskedInput
                    value={values.date}
                    name="date"
                    onChange={handleChange}
                    mask="99/99/9999"
                    placeholder="Digite a data da coleta"
                    required
                  />
                </div>

                <div className="single-input-container">
                  <label htmlFor="time">Horário da coleta:</label>
                  <select
                    value={values.time}
                    name="time"
                    required
                    onChange={handleChange}
                    disabled={availableTimes.length === 0 ? true : false}
                  >
                    <option value="">Selecione um horário</option>
                    
                    {availableTimes.map((val) => {
                      return <option value={val.id}>{val.hour.slice(0,5)}</option>
                    })}
                  </select>
                </div>
              </div>
              <div className="input-container">
                <div className="single-input-container">
                  <label htmlFor="responsibleName">Nome do responsável:</label>
                  <input
                    type="text"
                    name="responsibleName"
                    placeholder="Digite o nome do responsável"
                    onChange={handleChange}
                    value={schedule[0].responsible_name !== null ? schedule[0].responsible_name : ''}
                    readOnly
                  />
                </div>
                <div className="single-input-container">
                  <label htmlFor="phone">Telefone do responsável:</label>
                  <MaskedInput
                    value={schedule[0].responsible_phone !== null ? masker(schedule[0].responsible_phone, ['(99) 9999-9999', '(99) 9 9999-9999']) : ''}
                    name="responsiblePhone"
                    onChange={handleChange}
                    placeholder="Digite o telefone do responsável"
                    readOnly
                  />
                </div>
              </div>
              <div className="input-container">
                <div className="single-input-container">
                  <label htmlFor="requisitationNumber">Número da requisição:</label>
                  <MaskedInput
                    value={values.requisitationNumber}
                    name="requisitationNumber"
                    onChange={handleChange}
                    mask={["999999"]}
                    placeholder="Digite o número da requisição"
                  />
                </div>
                <div className="single-input-container">
                  <label htmlFor="price">Valor (R$)</label>
                  <MaskedInput
                    value={values.price}
                    name="price"
                    onChange={handleChange}
                    mask={currencyFormatArray}
                    placeholder="Digite o valor"
                  />
                </div>
              </div>
              <label htmlFor="note">Observações:</label>
              <textarea
                name="note"
                placeholder="Digite aqui a sua mensagem"
                onChange={handleChange}
                value={values.note}
                rows="5"
              ></textarea>
              <input type="submit" value="Enviar" className="button" />
            </form>
                </div>
                
            </div>            
        </div>
    )
}