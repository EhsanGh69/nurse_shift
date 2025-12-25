import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import api from './api';
import { useThemeStore } from '../store/themeStore'
import generateTheme from '../mui/themes/theme';


export const useCurrentSettings = (userId) => {
    return useQuery({
        queryKey: ['currentSettings'],
        queryFn: async () => {
            const { data } = await api.get(`/settings`)
            const newTheme = generateTheme({
                fontFamily: data.fontFamily, fontSize: data.fontSize, themeMode: data.themeMode
            })
            useThemeStore.getState().setTheme(newTheme)
            return data
        },
        retry: 1,
        enabled: !!userId
    })
}

export const useChangeSettings = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (formData) => {
            await api.post(`/settings/change`, formData)
        },
        onSuccess: () => queryClient.invalidateQueries(['currentSettings'])
    })
}

export const useChangeTheme = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            await api.put(`/settings/theme`)
        },
        onSuccess: () => queryClient.resetQueries(['currentSettings'])
    })
}
