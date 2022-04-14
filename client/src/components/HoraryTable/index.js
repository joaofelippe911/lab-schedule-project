import { useState, useEffect } from 'react';

import api from '../../api';
import { EditButton } from '../EditButton';

export default function HoraryTable(){
    const [times, setTimes] = useState([]);

    useEffect(() => {
        api.get("/api/times/").then((result) => {
            setTimes(result.data);
            console.log(result);
        })
    }, [])

    function inactivateHorary(id){
        api.patch(`/api/times/inactivate/${id}`).then(() => {
            console.log("updated");
        }).catch(() => {
            console.log("failed")
        })
    }
    return (
        
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Horário</th>
                        <th>Total</th>
                        <th>status</th>
                        <th>ações</th>
                    </tr>
                </thead>
                <tbody>
                    {times.map((time) => (
                        <tr>
                            <td>{time.hour.slice(0, 5)}</td>
                            <td>{time.total}</td>
                            <td>{time.status == 1 ? "Ativo" : "Inativo"}</td>
                            <td><EditButton onClick={() => {console.log("editandinhio")}} /></td>
                            {/* <td><button className='button red-button' onClick={() => {inactivateHorary(time.id)}}>Inativar</button> <button className='button'>Editar</button></td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}