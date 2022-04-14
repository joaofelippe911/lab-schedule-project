
import { useEffect, useState } from "react";
import api from "../../api";

import { useUserModalContext } from "../../Contexts/UserModalContext";
import { useConfirmationModalContext } from "../../Contexts/ConfirmationModalContext";

export default function UserModal({visible, userId}) {
    const [user, setUser] = useState({});
    const [roles, setRoles] = useState([]);
    const [changePass, setChangePass] = useState(false);

    const { closeModal } = useUserModalContext();
    const { openConfirmationModal } = useConfirmationModalContext();

    useEffect(() => {
        setChangePass(false);
        (async () => {
            api.get(`/api/users/${userId}`).then((result) => {
                setUser(result.data[0]);
            })
        })()

        api.get("/api/roles").then((result) => {
            setRoles(result.data)
        })
    }, [visible]);

    if(!visible || user === undefined) {
        return (
            <div className="modal-wrapper">
                <p>Nothing here...</p>
            </div>
        )
    }

    function handleUpdateUser(){
        if(user.newPassword) {
            if(user.newPasswordConfirm) {
                if(user.newPassword !== user.newPasswordConfirm) {
                    return openConfirmationModal({title: "Senhas diferentes!", buttons: false})
                } 
            } else {
                return openConfirmationModal({title: "Confirme a senha!", buttons: false})
            }
        }

        api.put(`/api/users/${userId}`, user).then((result) => {
            if(result.data.code === 1062) {
                openConfirmationModal({title: "Usuário já existe!", buttons: false})
            } else {
                openConfirmationModal({title: "Usuário atualizado com sucesso!", buttons: false, timer: 2000})
                closeModal();
            }
        }).catch(() => {
            openConfirmationModal({title: "Houve um erro ao atualizar o usuário! Por favor, entre em contato com um administrador.", buttons: false})
        })
    }

    function handleChange(e){
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    function handleTogglePassChange(){
        setChangePass(value => !value);
    }

    function handleInactivateUser(){
        
        api.put(`/api/users/inactivate/${userId}`).then(() => {
            openConfirmationModal({title: "Usuário inativado com sucesso!", buttons: false, timer: 2000})
            closeModal()
        }).catch(() => {
            openConfirmationModal({title: "Houve um erro ao inativar o usuário! Por favor, entre em contato com um administrador.", buttons: false})
        })
    }

    function handleActivateUser(){
        api.put(`/api/users/activate/${userId}`).then(() => {
            openConfirmationModal({title: "Usuário ativado com sucesso!", buttons: false, timer: 2000})
            closeModal()
        }).catch(() => {            
            openConfirmationModal({title: "Houve um erro ao ativar o usuário! Por favor, entre em contato com um administrador.", buttons: false})
        })
    }

    if(!visible || user === undefined) {
        return (
            <div className="modal-wrapper">
                <p>Nothing here...</p>
            </div>
        )
    }

    return (
        <div className={visible ? "visible modal-wrapper" : "modal-wrapper"}>
            <div className="modal-content">
                <div className="modal-header">
                    <button onClick={closeModal}><i className="fa-solid fa-xmark"></i></button>
                </div>
                <div className="modal-main">
                    <form autoComplete="off">
                        <div className="input-container" id="user-edit">
                            <div className="single-input-container">
                                <label htmlFor="username">Usuário:</label>
                                <input type="text" name="username" id="username" placeholder="Digite o usuário" value={user?.username} onChange={handleChange}/>
                            </div>
                            <div className="single-input-container">
                                <label htmlFor="role">Função:</label>
                                <select name="role" id="role" value={user.role} onChange={handleChange}>
                                    <option value="0">Selecione a função</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id} >{role.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </form>
                    { changePass ? 
                        <form id="change-pass" >
                            <div className="input-container">
                                <div className="single-input-container">
                                    <label htmlFor="newPassword">Nova senha:</label>
                                    <input type="password" name="newPassword" id="newPassword" placeholder="Digite a nova senha" onChange={handleChange}/>
                                </div>
                                <div className="single-input-container">
                                    <label htmlFor="newPasswordConfirm">Confirme a nova senha:</label>
                                    <input type="password" name="newPasswordConfirm" id="newPasswordConfirm" placeholder="Digite novamente a nova senha" onChange={handleChange} />
                                </div>
                            </div>
                            
                        </form> 
                        : ''
                    }
                    <div className="buttons-container">
                        <button className="button orange-button" onClick={handleTogglePassChange}>Alterar senha</button>
                        {user.active ? <button className="button red-button" onClick={() => {
                            openConfirmationModal({
                                title: "Deseja realmente inativar este usuário?", 
                                text: "Quando inativo, o usuário não terá mais acesso ao sistema!", 
                                fnc: handleInactivateUser});
                        }}>Inativar</button> : <button className="button green-button" onClick={() => {
                            openConfirmationModal({
                                title: "Deseja realmente ativar este usuário?", 
                                text: "Quando ativo, o usuário terá acesso ao sistema!", 
                                fnc: handleActivateUser});
                        }}>Ativar</button>}
                        <button className="button" onClick={() => {
                            openConfirmationModal({
                                title: "Deseja realmente salvar as alterações?",
                                fnc: handleUpdateUser
                            })
                        }}>Salvar</button>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}