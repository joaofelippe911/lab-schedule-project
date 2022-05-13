import { useConfirmationModalContext } from "../../Contexts/ConfirmationModalContext";
import Button from "../Button";
import "./styles.scss";

export default function ConfirmationModal() {
  const {
    confirmationModalState: { visible, title, text, fnc, buttons },
    closeConfirmationModal,
  } = useConfirmationModalContext();

  if (!visible) {
    return null;
  }

  function handleConfirm() {
    closeConfirmationModal();
    fnc();
  }

  return (
    <div className="modal-wrapper visible confirmation-modal">
      <div className="modal-content modal-30">
        <div className="modal-header">
          <button onClick={closeConfirmationModal}>
            <i className="fa-solid fa-xmark"></i>
          </button>
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
            {buttons ? (
              <>
                <Button onClick={closeConfirmationModal} bg="red">
                  Cancelar
                </Button>
                <Button onClick={handleConfirm}>Confirmar</Button>
              </>
            ) : (
              <Button onClick={closeConfirmationModal}>Ok</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
