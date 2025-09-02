import { useState, useEffect, useContext } from "react";
import { Button, Grid } from "@mui/material";

import { shiftDays } from "../../constants/shifts";
import { useSaveShift } from "../../api/shift.api";
import SnackAlert from "../SnackAlert";
import handleApiErrors from "../../utils/apiErrors";
import ShiftsContext from "../../context/ShiftsContext";
import CalendarGrid from "./CalendarGrid";
import SendShift from "./SendShift";
import useShiftStore from "../../store/shiftStore";


export default function ShiftCalendar() {
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const [filledShifts, setFilledShifts] = useState({})
    const { groupId: shiftGroupId } = useShiftStore()
    const { mutateAsync: saveMutate, isPending: savePending } = useSaveShift()
    
    const { formOpen, selectedShifts, shiftYear, shiftMonth, userShift, setCollapseOpen } 
    = useContext(ShiftsContext)

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
        await saveMutate({ 
          groupId, shiftDays: filledShifts, month: String(shiftMonth), year: String(shiftYear) 
        })
        setSnackbar({ open: true, message: 'تغییرات با موفقیت ذخیره شد', severity: 'success' })
        setCollapseOpen(false)
      } catch (error) {
        const msg = handleApiErrors(error);
        setSnackbar({ open: true, message: msg, severity: 'error' })
      }
    }

    const anyDayHasShift = () => {
        return shiftDays.some(shiftDay => (selectedShifts[shiftDay] || []).length > 0)
    }

  return (
    <Grid container spacing={1} justifyContent="center" mt={1}>
      <CalendarGrid />

      {anyDayHasShift() && (
        <Grid size={{ xs: 12 }} mt={2}>
          <Button
            sx={{
              py: "8px",
              px: "16px",
              bgcolor: "success.dark",
              color: "whitesmoke",
              display: !!userShift && (!userShift?.temporal || userShift?.expired) ? "none" : "inherit"
            }}
            onClick={() => handleSaveShift(shiftGroupId)}
            disabled={savePending}
          >
            ذخیره تغییرات
          </Button>
        </Grid>
      )}

      {!userShift?.expired && (
        <SendShift 
          setSnackbar={setSnackbar} filledShifts={filledShifts} formOpen={formOpen}
        />
      )}
      
      <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
    </Grid>
  );
}
