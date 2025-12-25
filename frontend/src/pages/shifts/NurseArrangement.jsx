import { useContext, useMemo, useState, useEffect } from "react"
import { Alert, Backdrop, Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { AddTask, Clear, DataUsage, EventAvailable, PermContactCalendar } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

import ShiftsContext from '../../context/ShiftsContext';
import AppHeader from "../../components/AppHeader";
import ShiftGroup from "../../components/shift/ShiftGroup";
import MainLayout from "../../mui/MainLayout";
import { Link } from "react-router-dom";
import { clickBox } from "../../styles/globalStyles";
import { useCheckSchedule, useCreateFinalSchedule } from "../../api/shiftSchedule.api"
import useShiftStore from '../../store/shiftStore';
import useSelectedDaysStore from "../../store/selectedDays";
import useScheduleResultStore from "../../store/scheduleResult";
import SnackAlert from "../../components/SnackAlert";
import handleApiErrors from "../../utils/apiErrors";

export default function NurseArrangement() {
  const weekDays = useMemo(() => ["شنبه", "یک شنبه", "دو شنبه", "سه‌ شنبه", "چهار شنبه", "پنج‌ شنبه", "جمعه"]);
  const { monthGrid, shiftMonth, shiftYear, checkHoliday } = useContext(ShiftsContext)
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { groupId } = useShiftStore()
  const { selectedDays } = useSelectedDaysStore()
  const { scheduleResult } = useScheduleResultStore()

  const [checkedDays, setCheckedDays] = useState(selectedDays || [])
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [executeSchedule, setExecuteSchedule] = useState(null)

  const { isLoading, data } = useCheckSchedule(groupId, shiftMonth)
  const { mutateAsync, isPending } = useCreateFinalSchedule()

  const handleFinalSchedule = async () => {
    try {
      const result = await mutateAsync({ groupId, month: shiftMonth, year: shiftYear })
      useScheduleResultStore.getState().setParams({ scheduleResult: result })
      setSnackbar({ open: true, message: 'درخواست های پرستاران با موفقیت اعمال شد', severity: 'success' })
    } catch (error) {
      const msg = handleApiErrors(error);
      setSnackbar({ open: true, message: msg, severity: 'error' })
    }
  }

  useEffect(() => {
    if (!isLoading && data) setExecuteSchedule(data.executable)
  }, [isLoading, data])

  const checkHandler = (dayKey) => {
    if (!checkedDays.includes(dayKey))
      setCheckedDays(prev => [...prev, dayKey])
  }

  useEffect(() => {
    if (!!checkedDays.length) useSelectedDaysStore.getState().setParams({ selectedDays: checkedDays })
  }, [checkedDays])

  const setDayColor = (day, rowIndex, colIndex) => {
    if (checkHoliday(day) || colIndex === 6) return "red"
    else if (checkedDays.includes(`${rowIndex}-${colIndex}`)) return 'darkgreen'
    return 'black'
  }

  return (
    <MainLayout title="روزهای چینش پرستاران">
      <AppHeader />
      <Grid container width="100%">
          <Backdrop open={isPending} sx={{ zIndex: (them) => them.zIndex.drawer + 1 }}>
            <CircularProgress color="warning" />
          </Backdrop>
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

        {executeSchedule !== null && !!executeSchedule
          ? (
            <Grid container spacing={3} width="100%" mt={3}>
              <Grid size={{ xs: 12 }}>
                <Typography
                  variant='h4' align='center' gutterBottom
                  sx={{ color: isDark ? '#f5f5f5' : '#1e1e1e' }}
                >
                  چینش پرستاران
                </Typography>
              </Grid>

              <Grid size={{ xs: 12 }} textAlign="center">
                <Button
                  variant="contained"
                  color="warning"
                  sx={{ mb: 2, backgroundColor: "#1017daff", p: 3 }}
                  size="large"
                  onClick={handleFinalSchedule}
                >
                  <AddTask sx={{ mr: 1, color: "#c9cad3ff" }} />
                  <Typography variant="h6" fontSize={30} color="#c9cad3ff">چینش خودکار</Typography>
                </Button>
              </Grid>

              {!!scheduleResult && (
                <Grid size={{ xs: 12 }}>
                  <Alert color="warning" severity="info" icon={<DataUsage fontSize="large" />}
                    sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Typography variant="h6" textAlign="center" component="span">
                      <span>مازاد :</span> <span>{scheduleResult.surplus}</span>
                    </Typography>
                    <Typography variant="h6" textAlign="center" component="span" ml={5}>
                      <span>کمبود :</span> <span>{scheduleResult.shortage * -1}</span>
                    </Typography>
                  </Alert>
                </Grid>
              )}

              {monthGrid.map((week, rowIndex) => (
                week.map((day, colIndex) => {
                  if (day) return (
                    <Grid
                      size={{ xs: 6, md: 4, lg: 3, xl: 2 }}
                      key={`${rowIndex}-${colIndex}`}
                      sx={{
                        ...clickBox, p: 2,
                        backgroundColor: checkedDays.includes(`${rowIndex}-${colIndex}`) ? 'warning.main' : 'success.main',
                        color: setDayColor(day, rowIndex, colIndex),
                        '&:hover': { backgroundColor: 'warning.main', color: setDayColor(day, rowIndex, colIndex) }
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
          ) : (
            <Alert color="error" severity="error" icon={<Clear fontSize="large" />}
              sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 2 }}>
              <Typography variant="h5" textAlign="center">
                {!!groupId 
                  ? <span>درخواست شیفت های پرستاران هنوز اعمال نشده است</span>
                  : <span>گروه انتخاب نشده است</span>
                }
              </Typography>
            </Alert>
          )
        }
      </Grid>
      <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
    </MainLayout>
  )
}
