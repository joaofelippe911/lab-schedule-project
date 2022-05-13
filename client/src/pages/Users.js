import { useEffect, useState } from "react";
import api from "../api";
import Modal from "../components/Modal";
import UserForm from "../components/UserForm";
import UserModal from "../components/UserModal";
import UsersTable from "../components/UsersTable";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUpdatedUsers();
  }, []);

  async function getUpdatedUsers() {
    const { data } = await api.get("/api/user");

    setUsers(data);
  }

  return (
    <div id="users-page">
      <Modal>
        <UserModal onUpdatedUser={getUpdatedUsers} />
      </Modal>
      <UserForm onCreatedUser={getUpdatedUsers} />
      <UsersTable users={users} />
    </div>
  );
}
