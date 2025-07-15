import { useState, useEffect, useContext, createContext } from "react";

import { useCurrentUser } from '../api/auth.api'

const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const { data, isLoading } = useCurrentUser()

    useEffect(() => {
        if(!isLoading && data)
            setUser(data)
        setLoading(isLoading)
    }, [isLoading, data])

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserData = () => useContext(UserContext)