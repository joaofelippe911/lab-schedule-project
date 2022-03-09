import api from "../api";

// import { useHistory } from "react-router-dom";
import { useState, useEffect, useContext } from "react";

import { Context } from "../Contexts/AuthContext";

import Sidebar from "../components/Sidebar";

export function Admin() {
    const { handleLogout } = useContext(Context);

    // const history =  useHistory();

    // Axios.defaults.withCredentials = true;

    const [ user, setUser ] = useState([]);
    // const [ loading, setLoading ] = useState(true);
    const [ schedules, setSchedules ] = useState([]);

    useEffect(() => {
        // const userData = JSON.parse(localStorage.getItem('user'));

        // setUser(userData);

        (async ()=> {
            const { data } = await api.get("/admin/");

            setSchedules(data);
        })();

        // setLoading(false);
    }, []);

    // if (loading) {
    //     return <p>Carregando...</p>;
    // }

    // if (!user) {
    //     window.location.reload();
    //     history.push("/admin/login");
    // }

    return (
    <div className="container">
        <Sidebar />
        <ul>
            {schedules.map((schedule)=> (
                <li key={schedule.schedule_id}>{schedule.patient_name}</li>
            ))}
        </ul>
            
            <p>{user.name}</p>
            <button className="button" type="button" onClick={handleLogout}>Sair</button>
    </div>
    );
}