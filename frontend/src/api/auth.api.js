import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import api from './api';

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
        mutationFn: async () => {
            await api.post('/auth/logout')
            localStorage.removeItem("refreshToken")
        },
        onSuccess: () => queryClient.removeQueries({ queryKey: ['currentUser'] })
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
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const { data } = await api.get('/auth/me')
            return data
        },
        retry: 1,
        enabled: !!localStorage.getItem("refreshToken")
    })
}