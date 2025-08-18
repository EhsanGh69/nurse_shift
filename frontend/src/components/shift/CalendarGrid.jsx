import { useMemo, useContext } from 'react'
import { Grid, Paper, Typography } from '@mui/material';

import ShiftsContext from "../../context/ShiftsContext";

export default function CalendarGrid() {
    const weekDays = useMemo(() => [ "شنبه", "یک شنبه", "دو شنبه", "سه‌ شنبه", "چهار شنبه", "پنج‌ شنبه", "جمعه"]);
    const { 
        monthGrid, selectedDay, setSelectedDay, checkHoliday, 
        getSelectedShiftDay, setCollapseOpen, userShift
    } = useContext(ShiftsContext)

    const handleDayClick = (day) => {
        if (day) {
            setSelectedDay(day);
            setCollapseOpen(true)
        }
    };

    const handleShiftShow = (day) => {
        if(getSelectedShiftDay(day) && userShift?.shiftDays[day]){
            if(getSelectedShiftDay(day) !== userShift?.shiftDays[day])
                return getSelectedShiftDay(day)
            else
                return userShift?.shiftDays[day]
        }
        else if(getSelectedShiftDay(day))
            return getSelectedShiftDay(day)
        else
            return userShift?.shiftDays[day]
    }

  return (
    <>
        {weekDays.map((day, index) => (
            <Grid size={{ xs: 1.7 }} key={index}>
            <Paper
                sx={{
                height: 50,
                display: "flex",
                alignItems: "center",
                padding: 1,
                justifyContent: "center",
                backgroundColor: "#1976d2",
                color: "#fff",
                }}
            >
                <Typography textAlign="center">{day}</Typography>
            </Paper>
            </Grid>
        ))}
        {monthGrid.map((week, rowIndex) =>
            week.map((day, colIndex) => (
                <Grid size={{ xs: 1.7 }} key={`${rowIndex}-${colIndex}`}>
                    <Paper
                    elevation={day ? 3 : 0}
                    sx={{
                        height: 50,
                        padding: 1.5,
                        display: day ? "flex" : "none",
                        alignItems: "center",
                        flexDirection: "column",
                        justifyContent: "center",
                        cursor: day ? "pointer" : "default",
                        backgroundColor: day === selectedDay ? "#1976d2" : "#f5f5f5",
                        color: day === selectedDay ? "#fff" : "#000",
                    }}
                    onClick={() => {
                        if(!!userShift && (!userShift?.temporal || userShift?.expired)) return
                        handleDayClick(day)
                    }}
                    >
                    {checkHoliday(day) ? (
                        <Typography variant="h6" mb={0} color="error" fontWeight={800}>
                            {day}
                        </Typography>
                    ) : (
                        <Typography variant="h6" mb={0} fontWeight={800}>
                            {day}
                        </Typography>
                    )}
                    {(!!getSelectedShiftDay(day) || !!userShift?.shiftDays[day]) && (
                        <Typography
                        variant="subtitle2"
                        color="warning"
                        fontWeight={800}
                        >
                            {handleShiftShow(day)}
                        </Typography>
                    )}
                    </Paper>
                </Grid>
            ))
        )}
    </>
  )
}
