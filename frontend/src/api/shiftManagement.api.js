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

export const useNursesShifts = (groupId, year, month) => {
    return useQuery({
        queryKey: ['nursesShifts', groupId, year, month],
        queryFn: async () => {
            const { data } = await api.get(`/shifts/report/${groupId}/${year}/${month}`)
            return data
        },
        retry: 0,
        staleTime: 0,
        enabled: !!groupId
    })
}


export const useRejectedShifts = (shiftId, groupId) => {
    return useQuery({
        queryKey: ['rejectedShifts', shiftId, groupId],
        queryFn: async () => {
            const { data } = await api.get(`/shifts/reject/${groupId}/${shiftId}`)
            return data
        },
        retry: 0,
        staleTime: 0,
        enabled: !!shiftId && !!groupId
    })
}

export const useNurseDescription = (shiftId) => {
    return useQuery({
        queryKey: ['nurseDescription', shiftId],
        queryFn: async () => {
            const { data } = await api.get(`/shifts/user/desc/${shiftId}`)
            return data
        },
        retry: 0,
        staleTime: 0,
        enabled: !!shiftId
    })
}

export const useRejectShift = (shiftId) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data) => {
            await api.put(`/shifts/reject/${shiftId}`, data)
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['nursesShifts'] })
    })
}

export const useChangeShift = (shiftId) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data) => {
            await api.put(`/shifts/update/${shiftId}`, data)
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['nursesShifts'] })
    })
}

export const useShiftsTables = (groupId, year, month) => {
    return useQuery({
        queryKey: ['shiftsTables', groupId, year, month],
        queryFn: async () => {
            const { data } = await api.get(`/shifts/tables/all/${groupId}`, { params: { year, month } })
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
            const { data } = await api.get(`/shifts/tables/${tableId}`)
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
            await api.post(`/shifts/tables/refresh`, data)
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['shiftsTables'] })
    })
}
