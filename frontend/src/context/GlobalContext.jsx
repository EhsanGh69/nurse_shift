import { useState, useContext, createContext } from "react";

const GlobalContext = createContext();

export const GlobalContextProvider = ({children}) => {
    const [dataMap, setDataMap] = useState({})

    const setData = (key, value) => {
        setDataMap((prev) => ({ ...prev, [key]: value }))
    }

    const getData = (key) => dataMap[key]

    return (
        <GlobalContext.Provider value={{ setData, getData }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalData = () => useContext(GlobalContext)