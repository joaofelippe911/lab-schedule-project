import { useEffect, useState } from "react";
import api from "../../api";

import { useConfirmationModalContext } from "../../Contexts/ConfirmationModalContext";
import Button from "../Button";
import CustomInput from "../CustomInput";

export default function UserForm({ onCreatedUser }) {
  const [values, setValues] = useState({});
  const [roles, setRoles] = useState([]);

  const { openConfirmationModal } = useConfirmationModalContext();

  function handleChange(event) {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  }

  async function handleCreateUser(e) {
    e.preventDefault();

    if (!values.username) {
      return openConfirmationModal({
        title: "Preencha o usuário!",
        buttons: false,
      });
    }

    values.username = values.username.toLowerCase();

    if (!values.role) {
      return openConfirmationModal({
        title: "Selecione a função!",
        buttons: false,
      });
    }

    if (!values.password) {
      return openConfirmationModal({
        title: "Preencha a senha!",
        buttons: false,
      });
    }

    if (!values.passwordConfirm) {
      return openConfirmationModal({
        title: "Confirme a senha!",
        buttons: false,
      });
    }

    if (values.password !== values.passwordConfirm) {
      return openConfirmationModal({
        title: "Senhas diferentes!",
        buttons: false,
      });
    }

    await api
      .post("/api/user/", values)
      .then((result) => {
        if (result.data.code !== 1062) {
          openConfirmationModal({
            title: "Usuário criado com sucesso!",
            buttons: false,
            timer: 2000,
          });
          onCreatedUser();
          setValues({});
        } else {
          openConfirmationModal({
            title: "Usuário já existe!",
            buttons: false,
          });
        }
      })
      .catch(() => {
        openConfirmationModal({
          title:
            "Houve um erro ao criar o usuário! Por favor, entre em contato com um administrador.",
          buttons: false,
        });
      });
  }

  useEffect(() => {
    api.get("/api/role").then((result) => {
      setRoles(result.data);
    });
  }, []);

  return (
    <form
      onSubmit={handleCreateUser}
      className="create-user-form"
      autoComplete="off"
    >
      <CustomInput
        type="text"
        name="username"
        label="Usuário"
        id="username"
        onChange={handleChange}
        minLength="4"
        placeholder="Digite o usuário"
        value={values.username || ""}
      />
      <div className="input-container">
        <label htmlFor="role">Função:</label>
        <select
          name="role"
          id="role"
          onChange={handleChange}
          value={values.role || 0}
        >
          <option value="0">Selecione a função</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>
      <CustomInput
        type="password"
        name="password"
        label="Senha"
        id="password"
        placeholder="Digite a senha"
        value={values.password || ""}
        minLength="4"
        onChange={handleChange}
      />
      <CustomInput
        type="password"
        name="passwordConfirm"
        label="Confirme a senha"
        id="passwordConfirm"
        placeholder="Digite novamente a senha"
        value={values.passwordConfirm || ""}
        minLength="4"
        onChange={handleChange}
      />
      <div className="buttons-container">
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}
