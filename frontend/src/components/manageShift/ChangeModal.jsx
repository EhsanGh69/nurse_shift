import { useState, useMemo, useContext } from 'react'
import { Modal, Typography, Button, TextField, MenuItem, Grid } from '@mui/material';
import { useTheme } from "@mui/material/styles";

import { modalBox, textFieldStyle } from '../../styles/globalStyles'
import { useChangeShift } from '../../api/shiftManagement.api'
import useShiftStore from "../../store/shiftStore";
import handleApiErrors from '../../utils/apiErrors';
import { getShiftDay, checkLeapYear } from '../../utils/shiftsData'
import ShiftsContext from '../../context/ShiftsContext';
import { shiftDays } from '../../constants/shifts'


export default function ChangeModal({ open, setChangeModalOpen, selectedShift, setSnackbar }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const monthDays = useMemo(() => [...Array(31).keys()].map(i => String(i + 1)))
  const [shiftType, setShiftType] = useState('')
  const [monthDay, setMonthDay] = useState('')
  const { groupId } = useShiftStore();
  const { shiftMonth, shiftYear, checkHoliday } = useContext(ShiftsContext)
  const { mutateAsync, isPending } = useChangeShift(selectedShift.shiftId)

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
        if(checkHoliday(Number(monthDay))) return shiftDays.filter(sd => sd.includes("H"))
        else return shiftDays.filter(sd => !sd.includes("H"))
    }else if(selectedShift.shiftDay){
        if(checkHoliday(Number(getShiftDay(selectedShift.shiftDay)[1]))) return shiftDays.filter(sd => sd.includes("H"))
        else return shiftDays.filter(sd => !sd.includes("H"))
    }
  }

  const handleChangeShift = async () => {
    let updateShift = ""
    if(!shiftType && monthDay) updateShift = `${getShiftDay(selectedShift.shiftDay)[0]}${monthDay}`
    else if(shiftType && !monthDay) updateShift = `${shiftType}${getShiftDay(selectedShift.shiftDay)[1]}`
    else if(shiftType && monthDay) updateShift = `${shiftType}${monthDay}`

    try {
      if(selectedShift.shiftId && updateShift){
        await mutateAsync({ 
            groupId, shiftDay: {update: updateShift, current: selectedShift.shiftDay} 
        })
        setSnackbar({ open: true, message: 'شیفت پرستار با موفقیت ویرایش شد', severity: 'success' })
        setTimeout(() => setChangeModalOpen(false), 500)
      }else {
        setChangeModalOpen(false)
      }
    } catch (error) {
      const msg = handleApiErrors(error);
      setSnackbar({ open: true, message: msg, severity: 'error' })
    }
  }

  return (
    <Modal open={open}>
        <Grid container sx={modalBox} width={{ xs: "80%", md: "60%", lg: "40%", xl: "35%" }}>
            <Grid size={{ xs:12 }}>
                <Typography 
                    variant='h6' mb={2} sx={{ fontFamily: 'Vazir' }}
                    color={isDark ? "#f5f5f5" : "#1e1e1e"}
                    >
                    تغییر شیفت
                    {" "}<b>{selectedShift.shiftUser}</b>
                </Typography>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
                <TextField
                    select
                    label="روز شیفت"
                    value={!monthDay && selectedShift.shiftDay ? getShiftDay(selectedShift.shiftDay)[1] : monthDay}
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
                    value={!shiftType && selectedShift.shiftDay ? getShiftDay(selectedShift.shiftDay)[0] : shiftType}
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

            <Grid size={{ xs: 12 }} mt={2}>
                <Button onClick={handleChangeShift} disabled={isPending}
                color='primary' sx={{ mr: 2 }} variant='contained'>ذخیره تغییرات</Button>
                <Button color='secondary' variant='outlined' onClick={() => setChangeModalOpen(false)}>انصراف</Button>
            </Grid>
        </Grid>
    </Modal>
  )
}