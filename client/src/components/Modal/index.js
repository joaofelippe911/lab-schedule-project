import { useModalContext } from "../../Contexts/ModalContext";

import "./styles.scss";

export default function Modal({ children }) {
  const {
    modalState: { visible },
    closeModal,
  } = useModalContext();

  if (!visible) {
    return null;
  }

  return (
    <div className="modal-wrapper visible">
      <div className="modal-content">
        <div className="modal-header">
          <button onClick={closeModal}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="modal-main">{children}</div>
      </div>
    </div>
  );
}
