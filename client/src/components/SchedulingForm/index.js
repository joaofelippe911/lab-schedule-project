import { useCallback, useEffect, useState } from "react";
import CustomInput from "../CustomInput";
import { unMask as unMasker } from "remask";

import "./styles.scss";

import api from "../../api";
import { useConfirmationModalContext } from "../../Contexts/ConfirmationModalContext";
import Button from "../Button";

const masks = {
  phone: ["(99) 9999-9999", "(99) 9 9999-9999"],
  price: ["99,99", "999,99", "9.999,99", "99.999,99", "999.999,99"],
};

export default function SchedulingForm() {
  const [values, setValues] = useState({});
  const [availableTimes, setAvailableTimes] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const { openConfirmationModal } = useConfirmationModalContext();

  useEffect(() => {
    if (values.date?.length === 10) {
      const splitedDateOfCollect = values.date.split("/").reverse();

      const date = new Date(
        splitedDateOfCollect[0],
        parseInt(splitedDateOfCollect[1]) - 1,
        splitedDateOfCollect[2]
      );

      if (date.getDay() === 0) {
        return openConfirmationModal({
          title: "Não é possível realizar agendamentos aos domingos!",
          text: "Por favor, informe um dia entre segunda e sábado.",
          buttons: false,
        });
      }

      const formatedDateOfCollect = splitedDateOfCollect.join("-");

      api
        .get(`/api/scheduling/times/${formatedDateOfCollect}`)
        .then((response) => {
          setAvailableTimes(response.data);
        });
    } else {
      setAvailableTimes([]);
    }
  }, [values.date]);

  const handleChange = useCallback((event) => {
    setValues((prevState) => {
      return {
        ...prevState,
        [event.target.name]: event.target.value,
      };
    });
  }, []);

  function handleSchedule(event) {
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

    api.post("/api/scheduling", { ...values, userId: user.id }).then(() => {
      setValues({});
      openConfirmationModal({
        title: "Agendamento realizado com sucesso!",
        buttons: false,
        timer: 2000,
      });
    });
  }

  return (
    <form onSubmit={handleSchedule} id="scheduling-form" autoComplete="off">
      <CustomInput
        type="text"
        name="patientName"
        label="Nome do paciente"
        placeholder="Digite o nome do paciente"
        required
        onChange={handleChange}
        value={values.patientName || ""}
      />
      <CustomInput
        value={values.birth || ""}
        name="birth"
        label="Data de nascimento"
        onChange={handleChange}
        mask="99/99/9999"
        placeholder="Digite a data de nascimento"
        required
        minLength="10"
      />
      <CustomInput
        value={values.cpf || ""}
        name="cpf"
        label="CPF"
        onChange={handleChange}
        mask="999.999.999-99"
        placeholder="Digite o CPF"
        required
        minLength="14"
      />
      <CustomInput
        value={values.phone || ""}
        name="phone"
        label="Telefone"
        onChange={handleChange}
        mask={masks.phone}
        placeholder="Digite o telefone"
        minLength="14"
        required
      />
      <CustomInput
        type="text"
        name="address"
        label="Endereço"
        placeholder="Digite o endereço para coleta"
        required
        onChange={handleChange}
        value={values.address || ""}
      />
      <CustomInput
        type="text"
        label="Bairro"
        name="neighborhood"
        placeholder="Digite o bairro"
        required
        onChange={handleChange}
        value={values.neighborhood || ""}
      />

      <CustomInput
        type="text"
        name="number"
        label="Número"
        placeholder="Digite o número"
        required
        onChange={handleChange}
        value={values.number || ""}
      />
      <CustomInput
        value={values.cep || ""}
        name="cep"
        label="CEP (opcional)"
        onChange={handleChange}
        mask="99999-999"
        placeholder="Digite o CEP"
        minLength="9"
      />
      <CustomInput
        value={values.date || ""}
        name="date"
        label="Data da coleta"
        onChange={handleChange}
        mask="99/99/9999"
        placeholder="Digite a data da coleta"
        required
        minLength="10"
      />
      <div className="input-container">
        <label htmlFor="time">Horário da coleta:</label>
        <select
          value={values.time || ""}
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
      <CustomInput
        type="text"
        name="responsibleName"
        label="Nome do responsável (opcional)"
        placeholder="Digite o nome do responsável"
        onChange={handleChange}
        value={values.responsibleName || ""}
      />
      <CustomInput
        value={values.responsiblePhone || ""}
        name="responsiblePhone"
        label="Telefone do responsável (opcional)"
        onChange={handleChange}
        mask={masks.phone}
        placeholder="Digite o telefone do responsável"
      />
      <CustomInput
        value={values.requisitationNumber || ""}
        name="requisitationNumber"
        label="Número da requisição"
        onChange={handleChange}
        mask="999999"
        placeholder="Digite o número da requisição"
        required
      />
      <CustomInput
        value={values.price || ""}
        name="price"
        label="Valor (R$)"
        onChange={handleChange}
        mask={masks.price}
        placeholder="Digite o valor"
        required
      />
      <div className="input-container">
        <label htmlFor="note">Observações (opcional):</label>
        <textarea
          name="note"
          placeholder="Digite aqui a sua mensagem"
          onChange={handleChange}
          value={values.note || ""}
          rows="5"
        ></textarea>
      </div>
      <div className="buttons-container">
        <Button type="submit">Enviar</Button>
      </div>
    </form>
  );
}
