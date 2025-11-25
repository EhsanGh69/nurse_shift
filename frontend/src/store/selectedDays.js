import { create } from 'zustand';

const useSelectedDaysStore = create(
    (set) => ({
        selectedDays: null,
        setParams: (params) => set(params)
    })
)

export default useSelectedDaysStore;