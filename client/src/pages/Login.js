import { useContext, useState } from 'react';
import logoImg from '../images/logo.png';
import Cookies from 'js-cookie';

import { useHistory } from "react-router-dom";

import { Context } from '../Contexts/AuthContext';

import '../styles/login.scss';

export default function Login() {
    const { authenticated, handleLogin } = useContext(Context);

    // Axios.defaults.withCredentials = true;

    // const history = useHistory();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // async function handleLogin(event) {
    //     event.preventDefault();

    //     const { data: { authenticated, user } } = await Axios.post("http://localhost:3001/authenticate", {username, password}).catch(()=> {
    //         window.location.reload();
    //         return "Error!";
    //     }); 
        
    //     localStorage.setItem('user', JSON.stringify(user));

    //     if (authenticated) {
    //         history.push("/admin/");
    //     }      
    // }

    return (
        <div id="login-page">
            <section className="login">
                <div className="login-card">
                    <div className="header">
                        <p>Login</p>
                        <img src={logoImg} alt="Logo Bioprev" />
                    </div>
                    <div className="form-container">
                        <form /*method="post" onSubmit={handleLogin(username, password)}*/>
                            <input type="text" name="user" id="user" placeholder="Usuário" onChange={(event) => setUsername(event.target.value)} value={username} />
                            <input type="password" name="password" id="password" placeholder="Senha" onChange={(event) => setPassword(event.target.value)} value={password} />
                            <button type="button" className="button" onClick={() => handleLogin(username, password)}>Logar</button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    )
}