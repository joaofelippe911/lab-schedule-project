import { useEffect, useState } from "react";
import api from "../../api";

import { useConfirmationModalContext } from "../../Contexts/ConfirmationModalContext";
import { useModalContext } from "../../Contexts/ModalContext";

import Button from "../Button";
import CustomInput from "../CustomInput";

export default function UserModal({ onUpdatedUser }) {
  const [user, setUser] = useState({});
  const [roles, setRoles] = useState([]);
  const [changePass, setChangePass] = useState(false);

  const {
    modalState: { id },
    closeModal,
  } = useModalContext();

  const { openConfirmationModal } = useConfirmationModalContext();

  useEffect(() => {
    setChangePass(false);
    (async () => {
      api.get(`/api/user/${id}`).then((result) => {
        setUser(result.data[0]);
      });
    })();

    api.get("/api/role").then((result) => {
      setRoles(result.data);
    });
  }, []);

  if (Object.keys(user).length === 0) {
    return <p>Loading...</p>;
  }

  function handleUpdateUser() {
    if (user.newPassword) {
      if (user.newPasswordConfirm) {
        if (user.newPassword !== user.newPasswordConfirm) {
          return openConfirmationModal({
            title: "Senhas diferentes!",
            buttons: false,
          });
        }
      } else {
        return openConfirmationModal({
          title: "Confirme a senha!",
          buttons: false,
        });
      }
    }

    api
      .patch(`/api/user/${id}`, user)
      .then((result) => {
        if (result.data.code === 1062) {
          openConfirmationModal({
            title: "Usuário já existe!",
            buttons: false,
          });
        } else {
          openConfirmationModal({
            title: "Usuário atualizado com sucesso!",
            buttons: false,
            timer: 2000,
          });
          onUpdatedUser();
          closeModal();
        }
      })
      .catch(() => {
        openConfirmationModal({
          title:
            "Houve um erro ao atualizar o usuário! Por favor, entre em contato com um administrador.",
          buttons: false,
        });
      });
  }

  function handleChange(e) {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  }

  function handleTogglePassChange() {
    setChangePass((value) => !value);
  }

  function handleInactivateUser() {
    api
      .patch(`/api/user/inactivate/${id}`)
      .then(() => {
        openConfirmationModal({
          title: "Usuário inativado com sucesso!",
          buttons: false,
          timer: 2000,
        });
        closeModal();
      })
      .catch(() => {
        openConfirmationModal({
          title:
            "Houve um erro ao inativar o usuário! Por favor, entre em contato com um administrador.",
          buttons: false,
        });
      });
  }

  function handleActivateUser() {
    api
      .patch(`/api/user/activate/${id}`)
      .then(() => {
        openConfirmationModal({
          title: "Usuário ativado com sucesso!",
          buttons: false,
          timer: 2000,
        });
        closeModal();
      })
      .catch(() => {
        openConfirmationModal({
          title:
            "Houve um erro ao ativar o usuário! Por favor, entre em contato com um administrador.",
          buttons: false,
        });
      });
  }

  return (
    <>
      <form autoComplete="off">
        <CustomInput
          type="text"
          name="username"
          label="Usuário"
          id="username"
          placeholder="Digite o usuário"
          defaultValue={user.username}
          onChange={handleChange}
        />
        <div className="input-container">
          <label htmlFor="role">Função:</label>
          <select
            name="role"
            id="role"
            value={user.role}
            onChange={handleChange}
          >
            <option value="0">Selecione a função</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        {changePass && (
          <>
            <CustomInput
              type="password"
              name="newPassword"
              label="Nova senha"
              id="newPassword"
              placeholder="Digite a nova senha"
              onChange={handleChange}
            />
            <CustomInput
              type="password"
              name="newPasswordConfirm"
              label="Confirme a nova senha"
              id="newPasswordConfirm"
              placeholder="Digite novamente a nova senha"
              onChange={handleChange}
            />
          </>
        )}
      </form>
      <div className="buttons-container">
        <Button onClick={handleTogglePassChange} bg="orange">
          Alterar senha
        </Button>
        {user.active ? (
          <Button
            onClick={() => {
              openConfirmationModal({
                title: "Deseja realmente inativar este usuário?",
                text: "Quando inativo, o usuário não terá mais acesso ao sistema!",
                fnc: handleInactivateUser,
              });
            }}
            bg="red"
          >
            Inativar
          </Button>
        ) : (
          <Button
            onClick={() => {
              openConfirmationModal({
                title: "Deseja realmente ativar este usuário?",
                text: "Quando ativo, o usuário terá acesso ao sistema!",
                fnc: handleActivateUser,
              });
            }}
            bg="green"
          >
            Ativar
          </Button>
        )}
        <Button
          onClick={() => {
            openConfirmationModal({
              title: "Deseja realmente salvar as alterações?",
              fnc: handleUpdateUser,
            });
          }}
        >
          Salvar
        </Button>
      </div>
    </>
  );
}
