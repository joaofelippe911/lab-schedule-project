import { createContext, useContext, useState } from "react"

const ConfirmationModalContext = createContext({});

function ConfirmationModalProvider({children}){

    const [confirmationModalState, setConfirmationModalState] = useState({visible: false});
    const [closeModalTimeout, setCloseModalTimeout] = useState({});

    function openConfirmationModal({title, text = '', fnc, buttons = true, timer = undefined}){
        setConfirmationModalState({visible: true, title: title, text: text, fnc: fnc, buttons: buttons});
        if(timer !== undefined) {
            const closeTimeout = setTimeout(() => {
                closeConfirmationModal();
            }, timer);
            setCloseModalTimeout({closeTimeout});
        }
    }

    function closeConfirmationModal(){
        if(Object.keys(closeModalTimeout).length > 0) {
            clearTimeout(closeModalTimeout.closeTimeout);
            setCloseModalTimeout({});
        }
        setConfirmationModalState({visible: false});
    }

    return (
        <ConfirmationModalContext.Provider value={{confirmationModalState, openConfirmationModal, closeConfirmationModal}} >
            {children}
        </ConfirmationModalContext.Provider>
    )
}

function useConfirmationModalContext(){
    const context = useContext(ConfirmationModalContext);
    return context
}

export { ConfirmationModalProvider, useConfirmationModalContext }