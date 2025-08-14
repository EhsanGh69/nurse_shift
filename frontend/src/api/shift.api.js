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