import { createContext } from "react";

const ShiftsContext = createContext({
    userGroups: null,
    userShift: null,
    setUserShift: () => {},
    topBox: null,
    formOpen: false,
    isLoading: false,
    monthGrid: [],
    shiftYear: 1,
    shiftMonth: 1,
    selectedDay: null,
    setSelectedDay: () => {},
    collapseOpen: false,
    setCollapseOpen: () => {},
    selectedShifts: null,
    setSelectedShifts: () => {},
    checkHoliday: () => {},
    getSelectedShiftDay: () => {}
})

export default ShiftsContext