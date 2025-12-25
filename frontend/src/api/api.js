import axios from "axios";

import { BACKEND_URL } from "../config"

let currentAccessToken = null
let isRefreshing = false
let refreshSubscribers = []

const api = axios.create({
    baseURL: BACKEND_URL,
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
                addSubscriber(() => {
                    resolve(api(originalRequest))
                })
            })
        }

        return Promise.reject(error)
    }
)

export const logout = async () => {
    try {
        await api.post("/auth/logout");
    } catch (err) {
        console.error("Logout request failed:", err);
    } finally {
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("shift-storage");
        currentAccessToken = null;
    }
};

export default api;