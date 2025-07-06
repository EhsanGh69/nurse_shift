import { useState, useEffect, useContext, createContext } from "react";

import { getUserData } from '../utils/services';

const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            const data = await getUserData()
            setUser(data)
            setLoading(false)
        }

        fetchUser()
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserData = () => useContext(UserContext)