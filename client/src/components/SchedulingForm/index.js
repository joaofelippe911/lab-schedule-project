import { useEffect, useState } from "react";
import { CustomInput } from "../CustomInput";
import { unMask as unMasker } from "remask";

import api from "../../api";
import { useConfirmationModalContext } from "../../Contexts/ConfirmationModalContext";

export default function SchedulingForm() {
  const [values, setValues] = useState({});
  const [availableTimes, setAvailableTimes] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const { openConfirmationModal } = useConfirmationModalContext();

  useEffect(() => {
    if (values.date?.length === 10) {
      const dateOfCollect = values.date.split("/").reverse().join("-");

      api.get(`/api/schedules/times/${dateOfCollect}`).then((response) => {
        setAvailableTimes(response.data);
      });
    } else {
      setAvailableTimes([]);
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
    }

    if (values.patientName.trim() === "") {
      return openConfirmationModal({
        title: "O campo 'Nome do paciente' está incorreto!",
        buttons: false,
      });
    }

    if (!values.birth) {
      return;
    }

    if (values.birth.trim().length < 10) {
      return openConfirmationModal({
        title: "O campo 'Data de nascimento' está incorreto!",
        buttons: false,
      });
    }

    if (!values.cpf) {
      return;
    }

    if (values.cpf.trim().length < 14) {
      return openConfirmationModal({
        title: "O campo 'CPF' está incorreto!",
        buttons: false,
      });
    }

    if (!values.phone) {
      return;
    }

    if (values.phone.trim().length < 14) {
      return openConfirmationModal({
        title: "O campo 'Telefone' está incorreto!",
        buttons: false,
      });
    }

    if (!values.address) {
      return;
    }

    if (values.address.trim() === "") {
      return openConfirmationModal({
        title: "O campo 'Endereço' está incorreto!",
        buttons: false,
      });
    }

    if (!values.neighborhood) {
      return;
    }

    if (values.neighborhood.trim() === "") {
      return openConfirmationModal({
        title: "O campo 'Bairro' está incorreto!",
        buttons: false,
      });
    }

    if (!values.number) {
      return;
    }

    if (values.number.trim() === "") {
      return openConfirmationModal({
        title: "O campo 'Número' está incorreto!",
        buttons: false,
      });
    }

    if (!values.date) {
      return;
    }

    if (values.date.trim().length < 10) {
      return openConfirmationModal({
        title: "O campo 'data da coleta' está incorreto!",
        buttons: false,
      });
    }

    if (!values.time) {
      return;
    }

    if (values.time.trim() === "") {
      return openConfirmationModal({
        title: "O campo 'Horário da coleta' está incorreto!",
        buttons: false,
      });
    }

    if (!values.requisitationNumber) {
      return;
    }

    if (values.requisitationNumber.trim().length < 6) {
      return openConfirmationModal({
        title: "O campo 'Número da requisição' está incorreto!",
        buttons: false,
      });
    }

    if (!values.price) {
      return;
    }

    if (values.price.trim() === "") {
      return openConfirmationModal({
        title: "O campo 'Valor' está incorreto!",
        buttons: false,
      });
    }

    values.birth = values.birth.split("/").reverse().join("-");
    values.cpf = unMasker(values.cpf);
    values.phone = unMasker(values.phone);
    values.date = values.date.split("/").reverse().join("-");
    values.price = values.price.replace(".", "").replace(",", ".");
    if (values.cep) {
      values.cep = unMasker(values.cep);
    }
    if (values.responsiblePhone) {
      values.responsiblePhone = unMasker(values.responsiblePhone);
    }

    api.post("/api/schedules", { ...values, userId: user.id }).then(() => {
      setValues({});
      openConfirmationModal({
        title: "Agendamento realizado com sucesso!",
        buttons: false,
        timer: 2000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  }

  return (
    <form onSubmit={handleScheduleCollect} autoComplete="off">
      <div className="input-container">
        <div className="single-input-container">
          <label htmlFor="patientName">Nome do paciente:</label>
          <CustomInput
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
          <CustomInput
            value={values.birth}
            name="birth"
            onChange={handleChange}
            mask="99/99/9999"
            placeholder="Digite a data de nascimento"
            required
            minLength="10"
          />
        </div>
      </div>
      <div className="input-container">
        <div className="single-input-container">
          <label htmlFor="cpf">CPF:</label>
          <CustomInput
            value={values.cpf}
            name="cpf"
            onChange={handleChange}
            mask="999.999.999-99"
            placeholder="Digite o CPF"
            required
            minLength="14"
          />
        </div>
        <div className="single-input-container">
          <label htmlFor="phone">Telefone:</label>
          <CustomInput
            value={values.phone}
            name="phone"
            onChange={handleChange}
            mask={["(99) 9999-9999", "(99) 9 9999-9999"]}
            placeholder="Digite o telefone"
            minLength="14"
            required
          />
        </div>
      </div>
      <div className="input-container">
        <div className="single-input-container">
          <label htmlFor="address">Endereço:</label>
          <CustomInput
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
          <CustomInput
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
          <CustomInput
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
          <CustomInput
            value={values.cep}
            name="cep"
            onChange={handleChange}
            mask="99999-999"
            placeholder="Digite o CEP"
            minLength="9"
          />
        </div>
      </div>

      <div className="input-container">
        <div className="single-input-container">
          <label htmlFor="date">Data da coleta:</label>
          <CustomInput
            value={values.date}
            name="date"
            onChange={handleChange}
            mask="99/99/9999"
            placeholder="Digite a data da coleta"
            required
            minLength="10"
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

            {availableTimes.map((time) => {
              return (
                <option key={time.id} value={time.id}>
                  {time.hour.slice(0, 5)}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="input-container">
        <div className="single-input-container">
          <label htmlFor="responsibleName">
            Nome do responsável (opcional):
          </label>
          <CustomInput
            type="text"
            name="responsibleName"
            placeholder="Digite o nome do responsável"
            onChange={handleChange}
            value={values.responsibleName}
          />
        </div>
        <div className="single-input-container">
          <label htmlFor="phone">Telefone do responsável (opcional):</label>
          <CustomInput
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
          <CustomInput
            value={values.requisitationNumber}
            name="requisitationNumber"
            onChange={handleChange}
            mask={["999999"]}
            placeholder="Digite o número da requisição"
            required
          />
        </div>
        <div className="single-input-container">
          <label htmlFor="price">Valor (R$)</label>
          <CustomInput
            value={values.price}
            name="price"
            onChange={handleChange}
            mask={["99,99", "999,99", "9.999,99", "99.999,99", "999.999,99"]}
            placeholder="Digite o valor"
            required
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
      <div className="buttons-container">
        <input type="submit" value="Enviar" className="button" />
      </div>
    </form>
  );
}