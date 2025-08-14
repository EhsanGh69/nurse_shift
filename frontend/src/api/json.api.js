import { useQuery } from '@tanstack/react-query';

import api from './api';

export const useYearHolidays = () => {
    return useQuery({
        queryKey: ['monthDays'],
        queryFn: async () => {
            const { data } = await api.get('/json/holidays')
            return data
        },
        retry: 1
    })
}