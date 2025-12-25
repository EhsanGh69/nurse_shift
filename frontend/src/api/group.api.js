import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import api from './api';

export const useUserGroups = () => {
    return useQuery({
        queryKey: ['userGroups'],
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
        retry: 0,
        staleTime: 0,
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

export const useMaxShifts = (groupId) => {
    return useQuery({
        queryKey: ['maxShifts', groupId],
        queryFn: async () => {
            const { data } = await api.get(`/groups/max/${groupId}`)
            return data
        },
        retry: 0,
        staleTime: 0,
        enabled: !!groupId
    })
}

export const useSetMaxShifts = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data) => {
            await api.post(`/groups/max/set`, data)
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['maxShifts'] })
    })
}