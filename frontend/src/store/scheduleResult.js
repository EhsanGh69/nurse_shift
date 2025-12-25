import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useScheduleResultStore = create(
    persist(
        (set) => ({
            scheduleResult: null,
            setParams: (params) => set(params)
        }),
        {
            name: 'schedule-storage',
            getStorage: () => localStorage
        }
    )
)

export default useScheduleResultStore;