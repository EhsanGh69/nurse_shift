import axios from "axios";

let currentAccessToken = null;

axios.interceptors.request.use((config) => {
    if (currentAccessToken) {
        config.headers.Authorization = `Bearer ${currentAccessToken}`
    }
    return config;
})

export const refreshToken = async () => {
    try {
        const { data } = await axios.post("/auth/refresh_token", {}, { withCredentials: true });
        currentAccessToken = data.accessToken;
        return data.accessToken;
    } catch (error) {
        if (error.status === 403 || error.status === 401)
            window.location.href = '/login'
        else {
            window.location.href = '/'
            alert("❌ خطایی رخ داد")
        }
    }
}

export const getUserData = async () => {
    try {
        const { data } = await axios.get('/auth/me', { withCredentials: true })
        return data
    } catch (error) {}
}

export const userNavigate = async () => {
    try {
        const { role } = await getUserData()
        if (role === 'ADMIN')
            window.location.href = '/matron'
        else if (role === 'MATRON')
            window.location.href = '/matron'
        else
            window.location.href = '/nurse'
    } catch (error) {}
}

export const getMatronGroups = async (setLoading) => {
    try {
        setLoading(true)
        const { data } = await axios.get('/matron/groups', { withCredentials: true })
        setLoading(false)
        return data
    } catch (error) {
        setLoading(false)
        if (error.status === 403)
            userNavigate()
        else {
            window.location.href = '/'
            alert("❌ خطایی رخ داد")
        }
    }
}

export const getMatronGroupDetails = async (groupId, setLoading) => {
    try {
        setLoading(true)
        const { data } = await axios.get(`/matron/groups/${groupId}`, { withCredentials: true })
        setLoading(false)
        return data
    } catch (error) {
        setLoading(false)
        if (error.status === 403 || error.status === 404)
            userNavigate()
        else {
            window.location.href = '/'
            alert("❌ خطایی رخ داد")
        }
    }
}