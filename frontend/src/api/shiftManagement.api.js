import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import api from './api';


export const useShiftSettings = (groupId) => {
    return useQuery({
        queryKey: ['shiftSettings', groupId],
        queryFn: async () => {
            const { data } = await api.get(`/shifts/settings/${groupId}`)
            return data
        },
        retry: 0,
        staleTime: 0,
        enabled: !!groupId
    })
}

export const useSetShiftSettings = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data) => {
            await api.post('/shifts/settings', data)
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['shiftSettings'] })
    })
}

export const useJobInfos = (groupId) => {
    return useQuery({
        queryKey: ['jobInfos', groupId],
        queryFn: async () => {
            const { data } = await api.get(`/shifts/infos/${groupId}`)
            return data
        },
        retry: 0,
        staleTime: 0,
        enabled: !!groupId
    })
}

export const useSetJobInfo = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data) => {
            await api.post('/shifts/infos', data)
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobInfos'] })
    })
}
