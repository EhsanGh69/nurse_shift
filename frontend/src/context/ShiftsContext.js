import { createContext } from "react";

const ShiftsContext = createContext({
    userGroups: null,
    userShift: null,
    prevDesc: "",
    setPrevDesc: () => {},
    setUserShift: () => {},
    selectBox: null,
    sendBox: null,
    formOpen: false,
    setFormOpen: () => {},
    isLoading: false,
    monthGrid: [],
    shiftYear: 1,
    shiftMonth: 1,
    daysInMonth: 1,
    selectedDay: null,
    setSelectedDay: () => {},
    weekDay: null,
    setWeekDay: () => {},
    collapseOpen: false,
    setCollapseOpen: () => {},
    selectedShifts: null,
    setSelectedShifts: () => {},
    removedDays: [],
    setRemovedDays: () => {},
    checkHoliday: () => {},
    getSelectedShiftDay: () => {}
})

export default ShiftsContext