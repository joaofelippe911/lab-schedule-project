import { useCallback, useState } from "react";
import api from "../../api";
import { useConfirmationModalContext } from "../../Contexts/ConfirmationModalContext";
import Button from "../Button";
import CustomInput from "../CustomInput";

export default function TimeForm({ onCreatedTime }) {
  const [hour, setHour] = useState("");

  const { openConfirmationModal } = useConfirmationModalContext();

  const handleChange = useCallback((event) => {
    setHour(event.target.value);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    if (hour === "") {
      return openConfirmationModal({
        title: "Informe o horário!",
        buttons: false,
      });
    }

    if (hour.length < 5) {
      return openConfirmationModal({
        title: "Horário inválido!",
        text: "Exemplo de horário aceito: 14:00",
        buttons: false,
      });
    }

    api
      .post("/api/time", { hour: hour })
      .then((result) => {
        if (result.data.code === 1062) {
          return openConfirmationModal({
            title: "Horário já existe!",
            buttons: false,
          });
        }
        setHour("");
        openConfirmationModal({
          title: "Horário inserido com sucesso!",
          buttons: false,
          timer: 2000,
        });
        onCreatedTime();
      })
      .catch(() => {
        openConfirmationModal({
          title:
            "Houve um erro ao inserir o horário! Por favor, entre em contato com um administrador.",
          buttons: false,
        });
      });
  }

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <CustomInput
        type="text"
        name="hour"
        label="Horário"
        id="hour"
        mask="99:99"
        value={hour}
        onChange={handleChange}
      />
      <div className="buttons-container">
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}
