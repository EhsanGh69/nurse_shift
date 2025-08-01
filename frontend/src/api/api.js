import axios from "axios";

let currentAccessToken = null
let isRefreshing = false
let refreshSubscribers = []

const api = axios.create({
    baseURL: "http://127.0.0.1:4000",
    withCredentials: true
})

const onRefreshed = (token) => {
    refreshSubscribers.forEach(cb => cb(token))
    refreshSubscribers = []
}

const addSubscriber = (cb) => {
    refreshSubscribers.push(cb)
}

api.interceptors.request.use((config) => {
    if (currentAccessToken) {
        config.headers.Authorization = `Bearer ${currentAccessToken}`
    }
    return config;
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        const isRefreshRoute = originalRequest.url.includes('/auth/refresh_token')

        if (error.response?.status === 401 && !isRefreshRoute && !originalRequest._retry) {
            originalRequest._retry = true

            const refreshToken = localStorage.getItem("refreshToken");

            if (!isRefreshing && refreshToken) {
                isRefreshing = true
                try {
                    const { data } = await api.post("/auth/refresh_token", {})
                    currentAccessToken = data.accessToken
                    onRefreshed(data.accessToken)
                    return api(originalRequest)
                } catch (error) {
                    localStorage.removeItem("refreshToken")
                    return Promise.reject(error);
                } finally {
                    isRefreshing = false
                }
            }

            return new Promise((resolve) => {
                addSubscriber((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`
                    resolve(api(originalRequest))
                })
            })
        }

        return Promise.reject(error)
    }
)

export default api;