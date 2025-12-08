import { useQuery, useMutation } from '@tanstack/react-query';

import api from './api';

export const useDayLimit = (groupId) => {
    return useQuery({
        queryKey: ['dayLimit', groupId],
        queryFn: async () => {
            const { data } = await api.get(`/shifts/day_limit/${groupId}`)
            return data
        },
        retry: 0,
        staleTime: 0,
        enabled: !!groupId
    })
}

export const useSaveShift = () => {
    return useMutation({
        mutationFn: async (formData) => {
            await api.post('/shifts/save', formData)
        }
    })
}

export const useCreateShift = () => {
    return useMutation({
        mutationFn: async (formData) => {
            await api.post('/shifts/create', formData)
        }
    })
}

export const useShiftExpire = () => {
    return useMutation({
        mutationFn: async (shiftId) => {
            await api.put(`/shifts/expire/${shiftId}`)
        }
    })
}

export const useUserShifts = (groupId, year, month) => {
    return useQuery({
        queryKey: ['userShifts', groupId, year, month],
        queryFn: async () => {
            const { data } = await api.get(`/shifts/user/all/${groupId}`, { 
                params: { year, month }
            })
            return data
        },
        retry: 1,
        enabled: !!groupId
    })
}

export const useUserShift = (shiftId) => {
    return useQuery({
        queryKey: ['userShift', shiftId],
        queryFn: async () => {
            const { data } = await api.get(`/shifts/user/${shiftId}`)
            return data
        },
        retry: 1,
        staleTime: 0,
        enabled: !!shiftId
    })
}