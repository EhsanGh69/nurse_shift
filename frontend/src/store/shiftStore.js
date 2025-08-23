import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useShiftStore = create(
    persist(
        (set) => ({
            haveShift: null,
            groupId: null,
            groupTitle: null,
            setParams: (params) => set(params)
        }),
        {
            name: 'shift-storage',
            getStorage: () => localStorage
        }
    )
)

export default useShiftStore;