
import { createContext, useContext, useState } from "react";

const ReportsContext = createContext({});

function ReportsDataProvider({children}){

    const [reportsData, setReportsData] = useState({});

    function handleSetData(data){
        setReportsData(data);
    }

    return (
        <ReportsContext.Provider value={{handleSetData, reportsData}}>
            {children}
        </ReportsContext.Provider>
    )
}

function useReportsDataContext(){
    const context = useContext(ReportsContext);
    return context;
}

export { ReportsDataProvider, useReportsDataContext }