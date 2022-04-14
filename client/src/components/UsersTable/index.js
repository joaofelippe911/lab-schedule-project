import { memo, useEffect, useState } from "react"
import api from "../../api";
import { useUserModalContext } from "../../Contexts/UserModalContext";
import { EditButton } from "../EditButton";

function UsersTable(){
    const [users, setUsers] = useState([]);

    const { userModalState: { visible }, openModal } = useUserModalContext();

    useEffect(() => {
        (async () => {
            const { data } = await api.get("/api/users");

            setUsers(data);
        })()
    }, [visible])

    function handleOpenModal(userId){
        openModal(userId)
    }

    return (
        <div className="table-container">
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
                                <EditButton 
                                    onClick={
                                        () => handleOpenModal(user.uid)
                                    } 
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
    )
}

export default memo(UsersTable);