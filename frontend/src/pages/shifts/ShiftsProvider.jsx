import { useEffect, useState, useRef } from "react";

import { useYearHolidays } from "../../api/json.api";
import generateMonthGrid from "../../utils/monthGrid";
import { shiftDays } from "../../constants/shifts";
import ShiftsContext from "../../context/ShiftsContext";
import { useUserGroups } from "../../api/group.api";


export default function ShiftsProvider ({ children }) {
    const [selectedDay, setSelectedDay] = useState(null);
    const [weekDay, setWeekDay] = useState(null);
    const [collapseOpen, setCollapseOpen] = useState(false);
    const [selectedShifts, setSelectedShifts] = useState({});
    const [holidays, setHolidays] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [userShift, setUserShift] = useState(null)
    const [userGroups, setUserGroups] = useState(null)

    const { monthGrid, shiftMonth, shiftYear, daysInMonth } = generateMonthGrid();
    const { data: holidaysData, isLoading: holidaysLoading } = useYearHolidays();
    const { data: groupsData, isLoading: groupsLoading } = useUserGroups()
    const selectBox = useRef();
    const sendBox = useRef();

    const checkHoliday = (day) => {
        if (holidays) return holidays.find((holiday) => holiday.day === day);
        return null
    };

    const getSelectedShiftDay = (day) => {
        for (const shift of shiftDays) {
          if (selectedShifts[shift] && selectedShifts[shift].includes(day)) return shift;
        }
        return null;
    };

    // const allDaysHaveShift = () => {
    //     for (let i = 1; i <= daysInMonth; i++) {
    //         if (!getSelectedShiftDay(i)) return false;
    //     }
    //     return true
    // }

    // useEffect(() => {
    //     if (allDaysHaveShift()) {
    //         setFormOpen(true)
    //         setCollapseOpen(false)
    //     }
    // }, [selectedShifts]);

    useEffect(() => {
        if (!holidaysLoading && holidaysData)
            setHolidays(holidaysData.holidays.filter((item) => item.month === shiftMonth));
    }, [holidaysData, holidaysLoading]);

    useEffect(() => {
        if(!groupsLoading && groupsData) setUserGroups(groupsData)
    }, [groupsData, groupsLoading])


  return (
    <ShiftsContext.Provider
        value={{
            userGroups,
            userShift,
            setUserShift,
            selectBox,
            sendBox,
            formOpen,
            setFormOpen,
            isLoading: holidaysLoading,
            monthGrid,
            shiftYear,
            shiftMonth,
            selectedDay,
            setSelectedDay,
            weekDay,
            setWeekDay,
            collapseOpen,
            setCollapseOpen,
            selectedShifts,
            setSelectedShifts,
            checkHoliday,
            getSelectedShiftDay
        }}
    >
        {children}
    </ShiftsContext.Provider>
  )
}
