import { useMemo, useContext } from 'react'
import { Typography, TextField, MenuItem, Grid } from '@mui/material';
import { useTheme } from "@mui/material/styles";

import { textFieldStyle } from '../../styles/globalStyles'
import { checkLeapYear } from '../../utils/shiftsData'
import ShiftsContext from '../../context/ShiftsContext';
import { shiftDays } from '../../constants/shifts'


export default function ShiftDayInput({ 
  selectedShiftType, selectedShiftDay, selectedNurseName, shiftType, setShiftType, monthDay, setMonthDay
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const monthDays = useMemo(() => [...Array(31).keys()].map(i => String(i + 1)))
  const { shiftMonth, shiftYear, checkHoliday } = useContext(ShiftsContext)

  const generateMonthDays = () => {
    if(shiftMonth >= 1 && shiftMonth <= 6) return monthDays
    else if (shiftMonth >= 7 && shiftMonth <= 11) return monthDays.slice(0, 30)
    else if(shiftMonth === 12){
      if(checkLeapYear(shiftYear)) return monthDays.slice(0, 29)
      else return monthDays.slice(0, 30)
    }
  }

  const generateShiftDays = () => {
    if(monthDay){
        if(checkHoliday(Number(monthDay))) 
          return shiftDays.filter(sd => sd.includes("H") || sd.includes("OFF") || sd.includes("V"))
        else return shiftDays.filter(sd => !sd.includes("H"))
    }else if(selectedShiftType){
        if(checkHoliday(Number(selectedShiftDay))) 
          return shiftDays.filter(sd => sd.includes("H") || sd.includes("OFF") || sd.includes("V"))
        else return shiftDays.filter(sd => !sd.includes("H"))
    }
  }

  return (
    <>
      <Grid size={{ xs:12 }}>
          <Typography 
              variant='h6' mb={2} sx={{ fontFamily: 'Vazir' }}
              color={isDark ? "#f5f5f5" : "#1e1e1e"}
              >
              تغییر شیفت
              {" "}<b>{selectedNurseName}</b>
          </Typography>
      </Grid>

      <Grid size={{ xs: 12, lg: 6 }}>
          <TextField
              select
              label="روز شیفت"
              value={!monthDay && selectedShiftDay ? selectedShiftDay : monthDay}
              onChange={(e) => setMonthDay(e.target.value)}
              sx={{
                  mb: 2, 
                  ...textFieldStyle(isDark),
                  width: { xs: "100%", sm: "70%", md: "50%", lg: "45%" }
              }}
          >
              {generateMonthDays().map(day => (
                  <MenuItem key={day} value={day}>
                      {day}
                  </MenuItem>
              ))}
          </TextField>
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
          <TextField
              select
              label="نوع شیفت"
              value={!shiftType && selectedShiftType ? selectedShiftType : shiftType}
              onChange={(e) => setShiftType(e.target.value)}
              sx={{
                  mb: 2, 
                  ...textFieldStyle(isDark),
                  width: { xs: "100%", sm: "70%", md: "50%", lg: "45%" }
              }}
          >
              {generateShiftDays()?.map(sDay => (
                  <MenuItem key={sDay} value={sDay}>
                      {sDay}
                  </MenuItem>
              ))}
          </TextField>
      </Grid>
    </>
  )
}