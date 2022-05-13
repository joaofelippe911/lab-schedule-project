import { createContext, useContext, useState } from "react";

const ModalContext = createContext({});

function ModalProvider({ children }) {
  const [modalState, setModalState] = useState({ visible: false });

  function openModal({ id }) {
    setModalState({ id: id, visible: true });
  }

  function closeModal() {
    setModalState({ visible: false });
  }

  return (
    <ModalContext.Provider value={{ modalState, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

function useModalContext() {
  const context = useContext(ModalContext);
  return context;
}

export { ModalProvider, useModalContext };
