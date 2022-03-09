import React, { createContext, useContext, useState } from "react";

const ScheduleModalContext = createContext({});

function ScheduleModalProvider({ children }){
    const [modalState, setState] = useState({visible: false});

    function openModal({ id }){
        setState({id: id, visible: true});
    }

    function closeModal(){
        setState({visible: false});
    }

    return (
        <ScheduleModalContext.Provider value={{ modalState, openModal, closeModal }}>
            {children}
        </ScheduleModalContext.Provider>
    )
}

function useScheduleModalContext(){
    const context = useContext(ScheduleModalContext)
    return context;
}
export { useScheduleModalContext, ScheduleModalProvider }