import { useMutation, useQuery } from '@tanstack/react-query';

import api from './api';

export const useMatronGroups = () => {
    return useQuery({
        queryKey: ['matronGroups'],
        queryFn: async () => {
            const { data } = await api.get('/groups')
            return data
        },
        retry: 1
    })
}

export const useGroupDetails = (groupId) => {
    return useQuery({
        queryKey: ['groupDetails', groupId],
        queryFn: async () => {
            const { data } = await api.get(`/groups/${groupId}`)
            return data
        },
        enabled: !!groupId
    })
}

export const useGroupInvitees = (groupId) => {
    return useQuery({
        queryKey: ['groupInvitees', groupId],
        queryFn: async () => {
            const { data } = await api.get(`/groups/invitees/${groupId}`)
            return data
        },
        enabled: !!groupId
    })
}

export const useCreateGroup = () => {
    return useMutation({
        mutationFn: async (formData) => {
            await api.post('/groups/create', formData)
        }
    })
} 

export const useInviteMember = () => {
    return useMutation({
        mutationFn: async (formData) => {
            await api.post('/groups/invite', formData)
        }
    })
} 