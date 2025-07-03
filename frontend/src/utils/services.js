import axios from "axios";

const attachAuthHeader = (accessToken) => {
    axios.interceptors.request.use((config) => {
        if(accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config;
    })
}

export const refreshToken = async (navigate) => {
    axios.post("/auth/refresh_token", {}, { withCredentials: true })
        .then(({ data }) => attachAuthHeader(data.accessToken))
        .catch(() => navigate('/login'))
}

export const getUserData = async () => {
    try {
        const { data } = await axios.get('/auth/me', { withCredentials: true })
        return data
    } catch (error) {}
}

export const userNavigate = async (navigate) => {
    try {
        const { role } = await getUserData()
        if (role === 'ADMIN')
            navigate('/matron')
        else if (role === 'MATRON')
            navigate('/matron')
        else
            navigate('/nurse')
    } catch (error) {}
}