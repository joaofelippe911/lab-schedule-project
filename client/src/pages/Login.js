import { useContext, useState } from 'react';
import logoImg from '../images/logo.png';

import { Context } from '../Contexts/AuthContext';
import api from '../api';

import '../styles/login.scss';
import history from '../history';

export default function Login() {
    const { authenticated, handleSetAuthenticated } = useContext(Context);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    if(authenticated){
        history.push("/admin/");
    }

    async function handleLogin(event) {
        event.preventDefault();
        if(username === ""){
            return setError("Informe o usuário!");
        }

        if(password === ""){
            return setError("Informe a senha");
        }
        api.post("/authenticate", {username, password}).then(({ data : { auth, user } }) => {
            if (auth) {
                handleSetAuthenticated();
                localStorage.setItem('user', JSON.stringify(user));
                history.push("/admin/agendamentos");
            }
        }).catch(() => {
            setError("Usuário ou senha incorretos!");
        });
    }

    return (
        <div id="login-page">
            <section className="login">
                <div className="login-card">
                    <div className="header">
                        <p>Login</p>
                        <img src={logoImg} alt="Logo Bioprev" />
                    </div>
                    <div className="form-container">
                        <form onSubmit={handleLogin}>
                            <input type="text" name="user" id="user" placeholder="Usuário" onChange={(event) => setUsername(event.target.value)} value={username} />
                            <input type="password" name="password" id="password" placeholder="Senha" onChange={(event) => setPassword(event.target.value)} value={password} />
                            <button type="submit" className="button">Logar</button>
                        </form>
                    </div>
                    {error !== "" && <div className='error-messages'><p>{error}</p></div>}
                </div>
            </section>
        </div>
    )
}