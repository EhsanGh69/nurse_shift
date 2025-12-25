import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import api, { logout } from './api';

export const useLogin = () => {
    return useMutation({
        mutationFn: async (formData) => {
            const { data } = await axios.post('/auth/login', formData)
            localStorage.setItem("refreshToken", data.refreshToken)
            return data
        }
    })
}

export const useLogout = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => await logout(),
        onSuccess: () => queryClient.clear()
    })
}

export const useRegister = () => {
    return useMutation({
        mutationFn: async (variables) => {
            await api.post(`/auth/register/${variables.role}`, variables.formData)
        }
    })
}

export const useCurrentUser = () => {
    const hasToken = !!localStorage.getItem("refreshToken")
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            if(!hasToken) return null
            const { data } = await api.get('/auth/me')
            return data
        },
        retry: 1,
        enabled: true
    })
}