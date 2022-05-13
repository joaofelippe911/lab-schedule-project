import { memo } from "react";
import { useModalContext } from "../../Contexts/ModalContext";
import { EditButton } from "../EditButton";

function UsersTable({ users }) {
  const { openModal } = useModalContext();

  function handleOpenModal(userId) {
    openModal({ id: userId });
  }

  return (
    <div className="table-container">
      <div className="table-title">
        <h2>Lista de usuários</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Função</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid}>
              <td>{user.username}</td>
              <td>{user.rname}</td>
              <td>{user.active === 1 ? "Ativo" : "Inativo"}</td>
              <td>
                <EditButton onClick={() => handleOpenModal(user.uid)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default memo(UsersTable);
