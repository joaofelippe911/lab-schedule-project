import { useEffect, useState } from "react";
import Axios from "axios";

import { Header } from "../components/Header";
import { MaskedInput } from "../components/MaskedInput";
import { mask as masker, unMask as unMasker } from "remask";

import api from "../api";

import "../styles/scheduling.scss";
import Sidebar from "../components/Sidebar";

export function Scheduling() {
  const [values, setValues] = useState({});
  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    let dateOfCollect = values.date;
    if (dateOfCollect !== undefined) {
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
      }
    }
  }, [values.date]);

  function handleChange(event) {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  }

  function handleScheduleCollect(event) {
    event.preventDefault();

    if (!values.patientName) {
      return;
    } else if (!values.cpf) {
      return;
    } else if (!values.birth) {
      return;
    } else if (!values.phone) {
      return;
    } else if (!values.address) {
      return;
    } else if (!values.neighborhood) {
      return;
    } else if (!values.number) {
      return;
    } else if (!values.date) {
      return;
    } else if (!values.time) {
      return;
    }

    values.cpf = unMasker(values.cpf);
    
    values.birth = unMasker(values.birth);
    values.birth = masker(values.birth, ["99-99-9999"]);
    values.birth = values.birth.split("-");
    values.birth = values.birth[2] + values.birth[1] + values.birth[0];
    values.birth = masker(values.birth, ["9999-99-99"]);
    
    values.phone = unMasker(values.phone);

    if (values.cep) {
      values.cep = unMasker(values.cep);
    }
    
    values.date = masker(values.date, ["99-99-9999"]);
    values.date = values.date.split("-");
    values.date = values.date[2] + values.date[1] + values.date[0];
    values.date = masker(values.date, ["9999-99-99"]);

    if (values.responsiblePhone) {
      values.responsiblePhone = unMasker(values.responsiblePhone);
    }

    if (values.patientName.trim() === "") {
      return;
    } else if (values.cpf.trim().length < 11) {
      return;
    } else if (values.birth.trim().length < 8) {
      return;
    } else if (values.phone.trim().length < 10) {
      return;
    } else if (values.address.trim() === "") {
      return;
    } else if (values.neighborhood.trim() === "") {
      return;
    } else if (values.number.trim() === "") {
      return;
    } else if (values.date.trim().length < 8) {
      return;
    } else if (values.time.trim() === "") {
      return;
    } else if (values.requisitationNumber.trim() === "") {
      return;
    } else if (values.price.trim() === "") {
      return;
    }
    
    values.price = values.price.replace('.', '');
    values.price = values.price.replace(',','.');

    if (!values.cep) {
      values.cep = undefined;
    }
    if (values.responsibleName) {
      values.responsibleName = undefined;
    }

    if (!values.responsiblePhone) {
      values.responsiblePhone = undefined;
    }

    if (!values.note) {
      values.note = undefined;
    }

    api.post("/api/insert", values).then(() => {
      setValues({});
      alert("Agendamento realizado com sucesso!");
      window.location.reload();
    });

  }

  return (
    <div id="scheduling-page">
      <div className="container">
        <Sidebar active="scheduling" />
        <main className="scheduling-form">
            <form onSubmit={handleScheduleCollect} autoComplete="off">
              
              <div className="input-container">
                <div className="single-input-container">
                  <label htmlFor="patientName">Nome do paciente:</label>
                  <input
                    type="text"
                    name="patientName"
                    placeholder="Digite o nome do paciente"
                    required
                    onChange={handleChange}
                    value={values.patientName}
                  />
                </div>

                <div className="single-input-container">
                  <label htmlFor="birth">Data de nascimento:</label>
                  <MaskedInput
                    value={values.birth}
                    name="birth"
                    onChange={handleChange}
                    mask="99/99/9999"
                    placeholder="Digite a data de nascimento"
                    required
                  />
                </div>
              </div>
              <div className="input-container">
                <div className="single-input-container">
                  <label htmlFor="cpf">CPF:</label>
                  <MaskedInput
                    value={values.cpf}
                    name="cpf"
                    onChange={handleChange}
                    mask="999.999.999-99"
                    placeholder="Digite o CPF"
                    required
                  />
                </div>
                <div className="single-input-container">
                  <label htmlFor="phone">Telefone:</label>
                  <MaskedInput
                    value={values.phone}
                    name="phone"
                    onChange={handleChange}
                    mask={["(99) 9999-9999", "(99) 9 9999-9999"]}
                    placeholder="Digite o telefone"
                    required
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
                    value={values.address}
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
                    value={values.neighborhood}
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
                    value={values.number}
                  />
                </div>

                <div className="single-input-container">
                  <label htmlFor="cep">CEP (opcional):</label>
                  <MaskedInput
                    value={values.cep}
                    name="cep"
                    onChange={handleChange}
                    mask="99999-999"
                    placeholder="Digite o CEP"
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
                      return <option value={val.id}>{val.hour}</option>
                    })}
                  </select>
                </div>
              </div>
              <div className="input-container">
                <div className="single-input-container">
                  <label htmlFor="responsibleName">Nome do responsável (opcional):</label>
                  <input
                    type="text"
                    name="responsibleName"
                    placeholder="Digite o nome do responsável"
                    onChange={handleChange}
                    value={values.responsibleName}
                  />
                </div>
                <div className="single-input-container">
                  <label htmlFor="phone">Telefone do responsável (opcional):</label>
                  <MaskedInput
                    value={values.responsiblePhone}
                    name="responsiblePhone"
                    onChange={handleChange}
                    mask={["(99) 9999-9999", "(99) 9 9999-9999"]}
                    placeholder="Digite o telefone do responsável"
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
                    mask={["99,99", "999,99", "9.999,99", "99.999,99", "999.999,99"]}
                    placeholder="Digite o valor"
                  />
                </div>
              </div>
              <label htmlFor="note">Observações (opcional):</label>
              <textarea
                name="note"
                placeholder="Digite aqui a sua mensagem"
                onChange={handleChange}
                value={values.note}
              ></textarea>
              <input type="submit" value="Enviar" className="button" />
            </form>
        </main>
      </div>
    </div>
  );
}
