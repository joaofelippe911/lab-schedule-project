import { useEffect, useState } from "react";
import api from "../api";
import UserModal from "../components/UserModal";
import UsersTable from "../components/UsersTable";
import { useConfirmationModalContext } from "../Contexts/ConfirmationModalContext";
import { useUserModalContext } from "../Contexts/UserModalContext";

import "../styles/users.scss";

export default function Users() {
    const [roles, setRoles] = useState([]);
    const [values, setValues] = useState([]);

    const { userModalState: {userId, visible} } = useUserModalContext();
    const { openConfirmationModal } = useConfirmationModalContext();

    useEffect(() => {
        api.get("/api/roles").then((result) => {
            setRoles(result.data);
        })
    }, [])

    function handleChange(event) {
        setValues(
            {
                ...values, 
                [event.target.name]: event.target.value
            });
    }

    async function handleCreateUser(e) {
        e.preventDefault();

        if(!values.username) {
            return openConfirmationModal({title: "Preencha o usuário!", buttons: false})
        } else {
            values.username = values.username.toLowerCase();
        }

        if(!values.role) {
            return openConfirmationModal({title: "Selecione a função!", buttons: false})
        }

        if(!values.password){
            return openConfirmationModal({title: "Preencha a senha!", buttons: false})
        }

        if(!values.passwordConfirm){
            return openConfirmationModal({title: "Confirme a senha!", buttons: false})
        }

        if(values.password !== values.passwordConfirm) {
            return openConfirmationModal({title: "Senhas diferentes!", buttons: false})
        }       

        await api.post("/api/users/", values).then((result) => {
            if(result.data.code !== 1062) {
                openConfirmationModal({title: "Usuário criado com sucesso!", buttons: false, timer: 2000})
                setValues([]);
                setTimeout(() => {
                    window.location.reload();
                }, 2000)
            } else {
                openConfirmationModal({title: "Usuário já existe!", buttons: false});

            }
            
        }).catch((err) => {
            openConfirmationModal({title: "Houve um erro ao criar o usuário! Por favor, entre em contato com um administrador.", buttons: false})
        })
    }

    return (
        <main>
            <div id="users-page">
                <UserModal visible={visible} userId={userId} />
                <form onSubmit={handleCreateUser} className="create-user-form" autoComplete="off">
                    <div className="input-container">
                        <div className="single-input-container">
                            <label htmlFor="username">Usuário:</label>
                            <input type="text" name="username" id="username" onChange={handleChange} placeholder="Digite o usuário" value={values.username}/>
                        </div>
                        <div className="single-input-container">
                            <label htmlFor="role">Função:</label>
                            <select name="role" id="role" onChange={handleChange} value={values.role} >
                                <option value="0">Selecione a função</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="input-container">
                        <div className="single-input-container">
                            <label htmlFor="password">Senha:</label>
                            <input type="password" name="password" id="password" placeholder="Digite a senha" onChange={handleChange} />
                        </div>
                        <div className="single-input-container">
                            <label htmlFor="passwordConfirm">Confirme a senha:</label>
                            <input type="password" name="passwordConfirm" id="passwordConfirm" placeholder="Digite novamente a senha" onChange={handleChange} />
                        </div>
                    </div>
                    <input type="submit" value="Salvar" className="save-button" />
                </form>
                <div className="users-container">
                    <div className="users-title">
                        <h2>Lista de usuários</h2>
                    </div>
                    <UsersTable />
                </div>
            </div>
        </main>
    )
}