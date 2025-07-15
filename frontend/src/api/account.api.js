import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from './api';

export const useChangePassword = () => {
    return useMutation({
        mutationFn: async (formData) => {
            await api.post('/account/change_password', formData)
        }
    })
}

export const useEditAccount = () => {
    return useMutation({
        mutationFn: async (formData) => {
            await api.put('/account/edit', formData, { headers: 'multipart/form-data' })
        }
    })
}

export const useRemoveAvatar = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            await api.delete('/account/avatar/remove')
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    })
}