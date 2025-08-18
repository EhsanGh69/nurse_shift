import { useEffect, useState, useRef } from "react";

import { useYearHolidays } from "../../api/json.api";
import generateMonthGrid from "../../utils/monthGrid";
import { shiftDays } from "../../constants/shifts";
import ShiftsContext from "../../context/ShiftsContext";


export default function ShiftsProvider ({ children }) {
    const [selectedDay, setSelectedDay] = useState(null);
    const [collapseOpen, setCollapseOpen] = useState(false);
    const [selectedShifts, setSelectedShifts] = useState({});
    const [holidays, setHolidays] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [userShift, setUserShift] = useState(null)

    const { monthGrid, shiftMonth, shiftYear, daysInMonth } = generateMonthGrid();
    const { data, isLoading } = useYearHolidays();
    const topBox = useRef();

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

    const allDaysHaveShift = () => {
        for (let i = 1; i <= daysInMonth; i++) {
        if (!getSelectedShiftDay(i)) return false;
        }
        return true
    }

    useEffect(() => {
        if (allDaysHaveShift()) {
            setFormOpen(true)
            setCollapseOpen(false)
        }
    }, [selectedShifts]);

    useEffect(() => {
        if (!isLoading && data)
            setHolidays(data.holidays.filter((item) => item.month === shiftMonth));
    }, [data, isLoading]);


  return (
    <ShiftsContext.Provider
        value={{
            userShift,
            setUserShift,
            topBox,
            formOpen,
            isLoading,
            monthGrid,
            shiftYear,
            shiftMonth,
            selectedDay,
            setSelectedDay,
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
