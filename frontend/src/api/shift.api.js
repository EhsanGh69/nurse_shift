import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import api from './api';

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

export const useUserShifts = (year, month) => {
    return useQuery({
        queryKey: ['userShifts', year, month],
        queryFn: async () => {
            const { data } = await api.get('/shifts/user', { params: { year, month } })
            return data
        },
        retry: 1
    })
}

export const useUserShift = (shiftId) => {
    return useQuery({
        queryKey: ['userShift', shiftId],
        queryFn: async () => {
            const { data } = await api.get(`/shifts/user/${shiftId}`)
            return data
        },
        retry: 0,
        staleTime: 0,
        enabled: !!shiftId
    })
}