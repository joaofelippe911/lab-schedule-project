const { createContext, useState, useContext } = require("react");

const UserModalContext = createContext({});

function UserModalProvider({children}) {
    const [userModalState, setUserModalState] = useState({visible: false});

    function openModal(userId) {
        setUserModalState({userId: userId, visible: true});
    }

    function closeModal() {
        setUserModalState({visible: false});
    }

    return (
        <UserModalContext.Provider value={{ userModalState, openModal, closeModal }} >
            {children}
        </UserModalContext.Provider>
    )
}

function useUserModalContext() {
    const context = useContext(UserModalContext);
    return context;
}

export { useUserModalContext, UserModalProvider };

