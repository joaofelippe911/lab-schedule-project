import { useConfirmationModalContext } from "../../Contexts/ConfirmationModalContext";
import "./styles.scss";

export default function ConfirmationModal(){

    const { confirmationModalState: { visible, title, text, fnc, buttons }, closeConfirmationModal } = useConfirmationModalContext();

    if(!visible) {
        return null;
    }

    function handleConfirm(){
        closeConfirmationModal();
        fnc();
    }

    return (
        <div className="modal-wrapper visible confirmation-modal">
            <div className="modal-content modal-30">
                <div className="modal-header">
                    <button onClick={closeConfirmationModal}><i className="fa-solid fa-xmark"></i></button>
                </div>
                <div className="modal-body">
                    <div className="modal-title">
                        <h2>{title}</h2>
                    </div>
                    <div className="modal-text">
                        <p>{text}</p>
                    </div>
                </div>
                <div className="modal-footer">
                    <div className="buttons-container">
                        {
                            buttons ? 
                            <>
                                <button className="button red-button" onClick={closeConfirmationModal}>Cancelar</button>
                                <button className="button" onClick={handleConfirm}>Confirmar</button>
                            </> 
                            : 
                            <button className="button" onClick={closeConfirmationModal}>Ok</button>
                        }
                    </div>
                </div>
                
            </div>
            
        </div>
    )
}