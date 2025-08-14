import { useState, useEffect } from "react";
import { Backdrop, CircularProgress, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import MainLayout from "../../mui/MainLayout";
import AppHeader from "../../components/AppHeader";
import generateMonthGrid from "../../utils/monthGrid";
import { useYearHolidays } from "../../api/json.api";
import { shiftDays } from "../../constants/shifts";
import ShiftCalendar from "../../components/shift/ShiftCalendar";
import ShiftSelect from "../../components/shift/ShiftSelect";

export default function CreateShift() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [holidays, setHolidays] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedShifts, setSelectedShifts] = useState({});
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  
  const { monthGrid, shiftMonth, shiftYear, daysInMonth } = generateMonthGrid();
  const { data, isLoading } = useYearHolidays();

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
    for(let i = 1; i <= daysInMonth; i++){
      if(!getSelectedShiftDay(i)) return false;
    }
    return true
  }

  useEffect(() => {
    if (!isLoading && data)
      setHolidays(data.holidays.filter((item) => item.month === shiftMonth));
  }, [data, isLoading]);


  useEffect(() => {
    if (allDaysHaveShift()) {
      setFormOpen(true)
      setCollapseOpen(false)
    }
  }, [selectedShifts]);

  return (
    <MainLayout title="شیفت های پرستار">
      <AppHeader />
      <Grid size={{ xs: 12, md: 10, lg: 8 }}>
        <Backdrop
          open={isLoading}
          sx={{ zIndex: (them) => them.zIndex.drawer + 1 }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <Typography
          variant="h5"
          align="center"
          gutterBottom
          mb={1}
          color={isDark ? "#f5f5f5" : "#1e1e1e"}
        >
          شیفت های {shiftYear}/{shiftMonth}
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          gutterBottom
          mb={5}
          color={isDark ? "#f5f5f5" : "#1e1e1e"}
        >
          برای انتخاب شیفت بر روی روز مورد نظر کلیک کنید
        </Typography>

        <ShiftCalendar 
          monthGrid={monthGrid} selectedDay={selectedDay} setSelectedDay={setSelectedDay}
          setCollapseOpen={setCollapseOpen} checkHoliday={checkHoliday} shiftYear={shiftYear} shiftMonth={shiftMonth}
          getSelectedShiftDay={getSelectedShiftDay} formOpen={formOpen} selectedShifts={selectedShifts}
        />

        <ShiftSelect
          collapseOpen={collapseOpen} setCollapseOpen={setCollapseOpen} checkHoliday={checkHoliday}
          shiftYear={shiftYear} shiftMonth={shiftMonth} selectedDay={selectedDay} selectedShifts={selectedShifts}
          getSelectedShiftDay={getSelectedShiftDay}  setSelectedShifts={setSelectedShifts}
        />

      </Grid>
    </MainLayout>
  );
}
