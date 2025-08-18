import { useState, useEffect, useContext } from "react";
import { Button, Grid } from "@mui/material";

import { shiftDays } from "../../constants/shifts";
import { useUserGroups } from "../../api/group.api";
import { useSaveShift } from "../../api/shift.api";
import GroupsModal from "./GroupsModal";
import SnackAlert from "../SnackAlert";
import handleApiErrors from "../../utils/apiErrors";
import ShiftsContext from "../../context/ShiftsContext";
import CalendarGrid from "./CalendarGrid";
import SendShift from "./SendShift";


export default function ShiftCalendar() {
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const [groups, setGroups] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [filledShifts, setFilledShifts] = useState({})
    const [activeHandler, setActiveHandler] = useState(null)
    
    const { data, isLoading } = useUserGroups()
    const { mutateAsync: saveMutate, isPending: savePending } = useSaveShift()
    
    const { formOpen, selectedShifts, shiftYear, shiftMonth, userShift } = useContext(ShiftsContext)

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
        await saveMutate({ 
          groupId, shiftDays: filledShifts, month: String(shiftMonth), year: String(shiftYear) 
        })
        setModalOpen(false)
        setSnackbar({ open: true, message: 'تغییرات با موفقیت ذخیره شد', severity: 'success' })
      } catch (error) {
        const msg = handleApiErrors(error);
        setSnackbar({ open: true, message: msg, severity: 'error' })
      }
    }

    const handlerManager = (handler) => {
      setActiveHandler(() => handler)
      setModalOpen(true)
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

      <SendShift 
        setSnackbar={setSnackbar} filledShifts={filledShifts} 
        formOpen={formOpen} handlerManager={handlerManager}
      />

      <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
    </Grid>
  );
}
