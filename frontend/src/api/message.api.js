import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import api from './api';

export const useUserMessages = () => {
    return useQuery({
        queryKey: ['userMessages'],
        queryFn: async () => {
            const { data } = await api.get('/messages/conversations')
            return data
        },
        retry: 1
    })
}

export const useUserContacts = () => {
    return useQuery({
        queryKey: ['userContacts'],
        queryFn: async () => {
            const { data } = await api.get('/messages/contacts')
            return data
        },
        retry: 1
    })
}

export const useNewMessage = () => {
    return useMutation({
        mutationFn: async (data) => {
            await api.post('/messages/new', data)
        }
    })
}

export const useSeenMessages = () => {
    return useMutation({
        mutationFn: async (data) => {
            await api.put('/messages/seen', data)
        }
    })
}

export const useResponseMessage = (contactId) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (formData) => {
            await api.post(`/messages/response/${contactId}`, formData)
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userMessages'] })
    })
}