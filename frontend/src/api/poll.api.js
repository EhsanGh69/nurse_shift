import { useMutation } from '@tanstack/react-query';

import api from './api';

export const useSendUserPoll = () => {
    return useMutation({
        mutationFn: async (formData) => await api.post('/polls/send', formData) 
    })
}



