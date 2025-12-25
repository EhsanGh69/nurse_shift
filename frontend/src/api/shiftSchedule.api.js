import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import api from './api';

export const useShiftsTables = (groupId, year, month) => {
    return useQuery({
        queryKey: ['shiftsTables', groupId, year, month],
        queryFn: async () => {
            const { data } = await api.get(`/schedule/tables/all/${groupId}`, { params: { year, month } })
            return data
        },
        retry: 0,
        staleTime: 0,
        enabled: !!groupId
    })
}

export const useShiftsTable = (tableId) => {
    return useQuery({
        queryKey: ['shiftsTable', tableId],
        queryFn: async () => {
            const { data } = await api.get(`/schedule/tables/${tableId}`)
            return data
        },
        retry: 0,
        staleTime: 0,
        enabled: !!tableId
    })
}

export const useRefreshShiftsTables = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data) => {
            await api.post(`/schedule/tables/refresh`, data)
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['shiftsTables'] })
    })
}

export const useShiftSchedule = (groupId, day) => {
    return useQuery({
        queryKey: ['shiftSchedule', groupId, day],
        queryFn: async () => {
            const { data } = await api.get(`/schedule/get/${groupId}/${day}`)
            return data
        },
        retry: 0,
        staleTime: 0,
        enabled: !!groupId
    })
}

export const useCreatePrimarySchedule = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data) => {
            await api.post(`/schedule/create/primary`, data)
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['shiftSchedule'] })
    })
}

export const useCreateFinalSchedule = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data) => {
            const { data: scheduleData } = await api.post(`/schedule/create/final`, data)
            return scheduleData
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['shiftSchedule'] })
    })
}

export const useCheckSchedule = (groupId, month) => {
    return useQuery({
        queryKey: ['checkSchedule', groupId, month],
        queryFn: async () => {
            const { data } = await api.get(`/schedule/check/${groupId}/${month}`)
            return data
        },
        retry: 0,
        staleTime: 0,
        enabled: !!groupId
    })
}

export const useEditShiftSchedule = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data) => {
            await api.put(`/schedule/update`, data)
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['shiftSchedule'] })
    })
}