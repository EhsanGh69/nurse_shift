import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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

export const useLeapYear = (year) => {
    return useQuery({
        queryKey: ['leapYear', year],
        queryFn: async () => {
            const { data } = await axios.get(`https://api.ineo-team.ir/kabiseh.php?year=${year}`)
            return data
        },
        retry: 1
    })
}