import { useState, useMemo, useEffect } from "react";
import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

import { shiftDays } from "../../constants/shifts";
import { useUserGroups } from "../../api/group.api";
import { useSaveShift, useCreateShift } from "../../api/shift.api";
import GroupsModal from "./GroupsModal";
import SnackAlert from "../SnackAlert";
import handleApiErrors from "../../utils/apiErrors";


export default function ShiftCalendar({ 
    monthGrid, selectedDay, setSelectedDay, setCollapseOpen, checkHoliday, 
    getSelectedShiftDay, formOpen, selectedShifts, shiftYear, shiftMonth
}) {
    const weekDays = useMemo(() => [ "شنبه", "یک شنبه", "دو شنبه", "سه‌ شنبه", "چهار شنبه", "پنج‌ شنبه", "جمعه"]);
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const [groups, setGroups] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [filledShifts, setFilledShifts] = useState({})
    const [activeHandler, setActiveHandler] = useState(null)
    const [shiftsDesc, setShiftsDesc] = useState('')
    const { data, isLoading } = useUserGroups()
    const { mutateAsync: saveMutate, isPending: savePending } = useSaveShift()
    const { mutateAsync: createMutate, isPending: createPending } = useCreateShift()
    const navigate = useNavigate()

    useEffect(() => {
      if(!isLoading, data) setGroups(data)
    }, [data, isLoading])

    useEffect(() => {
      if(selectedShifts) getFilledShifts()
    }, [selectedShifts])

    const getFilledShifts = () => {
      const fills = {}
      for(const shift of shiftDays){
        if(selectedShifts[shift]?.length > 0) fills[shift] = selectedShifts[shift]
      }
      setFilledShifts({ ...fills })
    }

    const handleSaveShift = async (groupId) => {
      try {
        await saveMutate({ groupId, shiftDays: filledShifts, month: String(shiftMonth), year: String(shiftYear) })
        setModalOpen(false)
        setSnackbar({ open: true, message: 'تغییرات با موفقیت ذخیره شد', severity: 'success' })
      } catch (error) {
        const msg = handleApiErrors(error);
        setSnackbar({ open: true, message: msg, severity: 'error' })
      }
    }

    const handleCreateShift = async (groupId) => {
      try {
        await createMutate({ 
          groupId, shiftDays: filledShifts, description: shiftsDesc,
          month: String(shiftMonth), year: String(shiftYear) 
        })
        setModalOpen(false)
        setSnackbar({ open: true, message: 'شیفت ها با موفقیت ارسال شد', severity: 'success' })
        setTimeout(() => navigate('/shifts'), 500)
      } catch (error) {
        const msg = handleApiErrors(error);
        setSnackbar({ open: true, message: msg, severity: 'error' })
      }
    }

    const handlerManager = (handler) => {
      setActiveHandler(() => handler)
      setModalOpen(true)
    }

    const handleDayClick = (day) => {
        if (day) {
            setSelectedDay(day);
            setCollapseOpen(true)
        }
    };

    const anyDayHasShift = () => {
        return shiftDays.some(shiftDay => (selectedShifts[shiftDay] || []).length > 0)
    }

  return (
    <Grid container spacing={1} justifyContent="center" mt={1}>
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
              onClick={() => handleDayClick(day)}
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
              {!!getSelectedShiftDay(day) && (
                <Typography
                  variant="subtitle2"
                  color="warning"
                  fontWeight={800}
                >
                  {getSelectedShiftDay(day)}
                </Typography>
              )}
            </Paper>
          </Grid>
        ))
      )}

      {anyDayHasShift() && (
        <Grid size={{ xs: 12 }} mt={2}>
          <Button
            sx={{
              py: "8px",
              px: "16px",
              bgcolor: "success.dark",
              color: "whitesmoke",
            }}
            onClick={() => handlerManager(handleSaveShift)}
            disabled={savePending}
          >
            ذخیره تغییرات
          </Button>
        </Grid>
      )}

      <GroupsModal 
        open={modalOpen} onClose={() => setModalOpen(false)} 
        handleConfirm={activeHandler} groups={groups}
      />

      {formOpen && (
        <Grid size={{ xs: 12 }} mt={2}>
          <Paper sx={{ p: 2 }}>
            <TextField
              value={shiftsDesc}
              onChange={(e) => setShiftsDesc(e.target.value.trimStart())}
              label="توضیحات ..."
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiInputBase-input": {
                  textAlign: "left",
                },
                bgcolor: isDark ? "#1e1e1e" : null,
              }}
            />

            <Typography variant="caption" color="warning" component="p">
              پس از ارسال شیفت ها به سرپرستار امکان ویرایش وجود ندارد
            </Typography>

            <Button
              sx={{
                py: "8px",
                px: "16px",
                mt: 1,
                bgcolor: "success.dark",
                color: "whitesmoke",
              }}
              onClick={() => handlerManager(handleCreateShift)}
              disabled={createPending}
            >
              ارسال به سرپرستار
            </Button>
          </Paper>
        </Grid>
      )}

      <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
    </Grid>
  );
}
