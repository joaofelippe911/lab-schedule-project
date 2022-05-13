import { useModalContext } from "../../Contexts/ModalContext";
import { useConfirmationModalContext } from "../../Contexts/ConfirmationModalContext";
import api from "../../api";
import { useEffect, useState } from "react";
import CustomInput from "../CustomInput";
import { mask as masker } from "remask";
import Button from "../Button";

export default function SchedulingModal({ getUpdatedSchedule }) {
  const [scheduling, setScheduling] = useState({});
  const [values, setValues] = useState({});
  const [availableTimes, setAvailableTimes] = useState([]);
  const [firstTimeRenderingTimes, setFirstTimeRenderingTimes] = useState(true);
  const {
    closeModal,
    modalState: { id },
  } = useModalContext();
  const { openConfirmationModal } = useConfirmationModalContext();
  const user = JSON.parse(localStorage.getItem("user"));

  const currencyFormatArray = [
    "9,99",
    "99,99",
    "999,99",
    "9.999,99",
    "99.999,99",
    "999.999,99",
  ];

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/api/scheduling/${id}`);
      setScheduling(data);
      let dateOfCollect = new Date(data[0].date).toLocaleDateString("pt-br", {
        year: "numeric",
        day: "2-digit",
        month: "2-digit",
      });
      setValues({
        id: data[0].scheduling_id,
        date: dateOfCollect,
        time: data[0].time,
        note: data[0].note,
        price: masker(
          data[0].price.toFixed(2).replace(".", ""),
          currencyFormatArray
        ),
        requisitationNumber: data[0].requisitation_number,
      });
      dateOfCollect = dateOfCollect.split("/").reverse().join("-");
      api
        .get(`/api/scheduling/times/${dateOfCollect}/${data[0].scheduling_id}`)
        .then((response) => {
          setAvailableTimes(response.data);
          setFirstTimeRenderingTimes(true);
        });
    })();
  }, []);

  useEffect(() => {
    if (values.date !== undefined) {
      if (!firstTimeRenderingTimes) {
        if (values.date.length === 10) {
          const dateOfCollect = values.date.split("/").reverse().join("-");
          api.get(`/api/scheduling/times/${dateOfCollect}`).then((response) => {
            setAvailableTimes(response.data);
          });
        } else {
          setAvailableTimes([]);
          if (values.time) {
            values.time = "";
          }
        }
      } else {
        setFirstTimeRenderingTimes(false);
      }
    }
  }, [values.date]);

  if (scheduling[0] === undefined) {
    return <p>Loading...</p>;
  }

  function handleChange(event) {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  }

  function handleUpdateSchedule() {
    values.price = values.price.replace(".", "").replace(",", ".");
    values.date = values.date.split("/").reverse().join("-");

    api.patch(`/api/scheduling/${values.id}`, values).then(() => {
      getUpdatedSchedule();
      closeModal();
    });
  }

  function handleFinishSchedule() {
    api
      .patch(`api/scheduling/finish/${id}`, { userId: user.id })
      .then(() => {
        openConfirmationModal({
          title: "Agendamento finalizado com sucesso!",
          buttons: false,
          timer: 2000,
        });
        getUpdatedSchedule();
        closeModal();
      })
      .catch(() => {
        openConfirmationModal({
          title:
            "Houve um erro ao finalizar o agendamento! Por favor, entre em contato com um administrador.",
          buttons: false,
        });
      });
  }

  function handleMeetSchedule() {
    api
      .patch(`/api/scheduling/meet/${id}`, { userId: user.id })
      .then(() => {
        openConfirmationModal({
          title: "Atendimento inicializado com sucesso!",
          buttons: false,
          timer: 2000,
        });
        getUpdatedSchedule();
        closeModal();
      })
      .catch(() => {
        openConfirmationModal({
          title:
            "Houve um erro ao iniciar o atendimento! Por favor, entre em contato com um administrador.",
          buttons: false,
        });
      });
  }

  function handleReopenSchedule() {
    api
      .patch(`/api/scheduling/reopen/${id}`)
      .then(() => {
        openConfirmationModal({
          title: "Agendamento reaberto com sucesso!",
          buttons: false,
          timer: 2000,
        });
        getUpdatedSchedule();
        closeModal();
      })
      .catch(() => {
        openConfirmationModal({
          title:
            "Houve um erro ao reabrir o agendamento! Por favor, entre em contato com um administrador.",
          buttons: false,
        });
      });
  }

  function handleCancelSchedule() {
    api
      .patch(`/api/scheduling/cancel/${id}`)
      .then(() => {
        openConfirmationModal({
          title: "Agendamento cancelado com sucesso",
          buttons: false,
          timer: 2000,
        });
        getUpdatedSchedule();
        closeModal();
      })
      .catch(() => {
        openConfirmationModal({
          title:
            "Houve um erro ao cancelar o agendamento! Por favor, entre em contato com um administrador.",
          buttons: false,
        });
      });
  }

  return (
    <form autoComplete="off">
      <CustomInput
        type="text"
        name="patientName"
        label="Nome do paciente"
        value={scheduling[0].patient_name}
        readOnly
      />
      <CustomInput
        type="text"
        name="birth"
        label="Data de nascimento"
        value={new Date(scheduling[0].birth).toLocaleDateString("pt-br")}
        readOnly
      />

      <CustomInput
        type="text"
        name="cpf"
        label="CPF"
        value={masker(scheduling[0].cpf, ["999.999.999-99"])}
        readOnly
      />
      <CustomInput
        type="text"
        name="phone"
        label="Telefone"
        value={masker(scheduling[0].phone, [
          "(99) 9999-9999",
          "(99) 9 9999-9999",
        ])}
        readOnly
      />
      <CustomInput
        type="text"
        name="address"
        label="Endereço"
        value={scheduling[0].address}
        readOnly
      />
      <CustomInput
        type="text"
        name="neighborhood"
        label="Bairro"
        value={scheduling[0].neighborhood}
        readOnly
      />
      <CustomInput
        type="text"
        name="number"
        label="Número"
        value={scheduling[0].number}
        readOnly
      />
      <CustomInput
        type="text"
        name="cep"
        label="CEP"
        value={
          scheduling[0].cep !== null
            ? masker(scheduling[0].cep, ["99999-999"])
            : ""
        }
        placeholder="Não informado"
        readOnly
      />

      <CustomInput
        type="text"
        name="date"
        label="Data da coleta"
        value={values.date}
        onChange={handleChange}
        mask="99/99/9999"
        placeholder="Digite a data da coleta"
        required
      />

      <div className="input-container">
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
        label="Nome do responsável"
        value={
          scheduling[0].responsible_name !== null
            ? scheduling[0].responsible_name
            : ""
        }
        placeholder="Não informado"
        onChange={handleChange}
        readOnly
      />
      <CustomInput
        type="text"
        name="responsiblePhone"
        label="Telefone do responsável"
        value={
          scheduling[0].responsible_phone !== null
            ? masker(scheduling[0].responsible_phone, [
                "(99) 9999-9999",
                "(99) 9 9999-9999",
              ])
            : ""
        }
        onChange={handleChange}
        mask={["(99) 9999-9999", "(99) 9 9999-9999"]}
        placeholder="Não informado"
        readOnly
      />
      <CustomInput
        type="text"
        name="requisitationNumber"
        label="Número da requisição"
        value={values.requisitationNumber}
        onChange={handleChange}
        mask={["999999"]}
        placeholder="Digite o número da requisição"
        required
      />
      <CustomInput
        name="price"
        label="Valor (R$)"
        value={values.price}
        onChange={handleChange}
        mask={currencyFormatArray}
        placeholder="Digite o valor"
        required
      />
      <div className="input-container">
        <label htmlFor="note">Observações:</label>
        <textarea
          name="note"
          placeholder="Digite aqui a sua mensagem"
          onChange={handleChange}
          value={values.note || ""}
          rows="5"
        ></textarea>
      </div>
      <div className="buttons-container">
        {scheduling[0].id_status < 3 ? (
          <Button
            onClick={(e) => {
              e.preventDefault();
              openConfirmationModal({
                title: "Deseja realmente cancelar esse agendamento?",
                fnc: handleCancelSchedule,
              });
            }}
            bg="red"
          >
            Cancelar
          </Button>
        ) : (
          scheduling[0].id_status === 4 && (
            <span className="red-text">Este agendamento foi cancelado!</span>
          )
        )}
        {[1, 2, 3].includes(user.role) ? (
          scheduling[0].id_status === 1 ? (
            <Button
              onClick={(e) => {
                e.preventDefault();

                openConfirmationModal({
                  title:
                    "Deseja realmente iniciar o atendimento desse agendamento?",
                  fnc: handleMeetSchedule,
                });
              }}
              bg="green"
            >
              {" "}
              Atender
            </Button>
          ) : scheduling[0].id_status === 2 ? (
            <Button
              onClick={(e) => {
                e.preventDefault();

                openConfirmationModal({
                  title:
                    "Deseja realmente finalizar o atendimento desse agendamento?",
                  fnc: handleFinishSchedule,
                });
              }}
              bg="red"
            >
              Finalizar
            </Button>
          ) : (
            <Button
              onClick={(e) => {
                e.preventDefault();
                openConfirmationModal({
                  title: "Deseja realmente reabrir esse agendamento?",
                  fnc: handleReopenSchedule,
                });
              }}
              bg="red"
            >
              Reabrir
            </Button>
          )
        ) : (
          ""
        )}
        <Button
          onClick={(e) => {
            e.preventDefault();

            openConfirmationModal({
              title: "Deseja realmente salvar as alterações?",
              fnc: handleUpdateSchedule,
            });
          }}
        >
          Salvar
        </Button>
      </div>
    </form>
  );
}
