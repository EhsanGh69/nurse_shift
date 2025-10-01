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

export const useSubGroups = (groupId) => {
    return useQuery({
        queryKey: ['subGroups', groupId],
        queryFn: async () => {
            const { data } = await api.get(`/groups/subs/${groupId}`)
            return data
        },
        retry: 0,
        staleTime: 0,
        enabled: !!groupId
    })
}

export const useSetSubGroup = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data) => {
            await api.post(`/groups/subs`, data)
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subGroups'] })
    })
}

export const useRemoveSubGroup = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data) => {
            await api.put(`/groups/subs/remove`, data)
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subGroups'] })
    })
}

export const useUpdateSubGroup = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data) => {
            await api.put(`/groups/subs/update`, data)
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subGroups'] })
    })
}

export const useSubGroupShiftCount = () => {
    return useMutation({
        mutationFn: async (data) => {
            const { data: shiftsData } = await api.post(`/groups/subs/shifts`, data)
            return shiftsData
        }
    })
}

export const useUnassignedSubGroupMembers = (groupId) => {
    return useQuery({
        queryKey: ['unassignedMembers', groupId],
        queryFn: async () => {
            const { data } = await api.get(`/groups/subs/unassigned/${groupId}`)
            return data
        },
        retry: 0,
        staleTime: 0,
        enabled: !!groupId
    })
}

export const useRemoveSubGroupMember = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data) => {
            await api.put(`/groups/subs/member/remove`, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subGroups'] })
            queryClient.invalidateQueries({ queryKey: ['unassignedMembers'] })
        }
    })
}

export const useAddSubGroupMember = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data) => {
            await api.put(`/groups/subs/member/add`, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subGroups'] })
            queryClient.invalidateQueries({ queryKey: ['unassignedMembers'] })
        }
    })
}