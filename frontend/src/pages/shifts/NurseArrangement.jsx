import { useContext, useMemo, useState, useEffect } from "react"
import { Backdrop, Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { EventAvailable, PermContactCalendar } from "@mui/icons-material";

import ShiftsContext from '../../context/ShiftsContext';
import AppHeader from "../../components/AppHeader";
import ShiftGroup from "../../components/shift/ShiftGroup";
import MainLayout from "../../mui/MainLayout";
import { Link } from "react-router-dom";
import { clickBox } from "../../styles/globalStyles";
import useSelectedDaysStore from "../../store/selectedDays"
import { useCreateShiftSchedule } from "../../api/shiftSchedule.api"
import useShiftStore from '../../store/shiftStore';
import SnackAlert from "../../components/SnackAlert";
import handleApiErrors from "../../utils/apiErrors";

export default function NurseArrangement() {
  const weekDays = useMemo(() => [ "شنبه", "یک شنبه", "دو شنبه", "سه‌ شنبه", "چهار شنبه", "پنج‌ شنبه", "جمعه"]);
  const { monthGrid, shiftMonth, shiftYear, checkHoliday } = useContext(ShiftsContext)
  const { selectedDays } = useSelectedDaysStore()
  const [checkedDays, setCheckedDays] = useState(selectedDays || [])
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const { groupId } = useShiftStore()
  // const { mutateAsync, isPending } = useCreateShiftSchedule()

  // const createShiftSchedule = async () => {
  //   try {
  //     await mutateAsync({ groupId, month: shiftMonth, year: shiftYear })
  //   } catch (error) {
  //     const msg = handleApiErrors(error);
  //     setSnackbar({ open: true, message: msg, severity: 'error' })
  //   }
  // }

  // useEffect(() => {
  //   if(groupId) createShiftSchedule()
  // }, [groupId])

  const checkHandler = (dayKey) => {
    if(!checkedDays.includes(dayKey))
      setCheckedDays(prev => [ ...prev, dayKey ])
  }

  useEffect(() => {
    if(!!checkedDays.length) useSelectedDaysStore.getState().setParams({ selectedDays: checkedDays })
  }, [checkedDays])

  const setDayColor = (day, rowIndex, colIndex) => {
    if(checkHoliday(day) || colIndex === 6) return "red"
    else if(checkedDays.includes(`${rowIndex}-${colIndex}`)) return 'darkgreen'
    return 'black'
  }

  return (
    <MainLayout title="روزهای چینش پرستاران">
      <AppHeader />
      <Grid container width="100%">
          {/* <Backdrop open={isPending} sx={{ zIndex: (them) => them.zIndex.drawer + 1 }}>
            <CircularProgress color="inherit" />
          </Backdrop> */}
          <Grid size={{ xs: 12 }}>
              <Button
                  color="info"
                  variant="contained"
                  sx={{ mb: 2 }}
                  LinkComponent={Link}
                  size="large"
                  to="/shifts/matron"
                  >
                      <PermContactCalendar sx={{ mr: 1 }} />
                      <Typography variant="h6">بازگشت به مدیریت شیفت ها</Typography>
              </Button>
          </Grid>
          
          <ShiftGroup />

          <Grid container spacing={3} width="100%" mt={3}>
              {monthGrid.map((week, rowIndex) => (
                  week.map((day, colIndex) => {
                    if(day) return (
                      <Grid
                          size={{ xs: 6, md: 4, lg: 3 }}
                          key={`${rowIndex}-${colIndex}`}
                          sx={{ ...clickBox, p: 2,
                            backgroundColor: checkedDays.includes(`${rowIndex}-${colIndex}`) ? 'warning.main' : 'success.main', 
                            color: setDayColor(day, rowIndex, colIndex),
                            '&:hover': { backgroundColor: 'warning.main', color: setDayColor(day, rowIndex, colIndex)}
                          }}
                          component={Link}
                          to={`/shifts/matron/arrange/${day}`}
                        >
                        <Box sx={{ mb: 1 }} onClick={() => checkHandler(`${rowIndex}-${colIndex}`)}>
                          <EventAvailable fontSize='large' />
                          <Typography variant='h5'>{weekDays[colIndex]}</Typography>
                          <Typography variant='h6'>{`${shiftYear}/${shiftMonth}/${day}`}</Typography>
                        </Box>
                      </Grid>
                    )
                  })
                )
              )}
          </Grid>
      </Grid>
      <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
    </MainLayout>
  )
}
