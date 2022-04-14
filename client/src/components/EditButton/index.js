
import './styles.scss';

export function EditButton({...props}){
    return (
        <button {...props} className="edit-button"><i className="fa-solid fa-pen"></i></button>
    )
}