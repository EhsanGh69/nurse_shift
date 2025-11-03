import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import api from './api';


export const useCurrentSettings = (enabled) => {
    return useQuery({
        queryKey: ['currentSettings'],
        queryFn: async () => {
            const { data } = await api.get('/settings')
            return data
        },
        retry: 1,
        enabled
    })
}

export const useChangeSettings = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (formData) => {
            await api.post('/settings/change', formData)
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['currentSettings'] })
    })
}

export const useChangeTheme = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            await api.put('/settings/theme')
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['currentSettings'] })
    })
}
