import { useState, useContext, useEffect } from 'react'
import { Box, Button, Collapse, Paper, TextField } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

import { useCreateShift } from "../../api/shift.api";
import ShiftsContext from "../../context/ShiftsContext";
import handleApiErrors from '../../utils/apiErrors';
import { GlobalContext } from "../../context/GlobalContext";
import useShiftStore from '../../store/shiftStore';

export default function SendShift({ setSnackbar, filledShifts, formOpen }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [shiftsDesc, setShiftsDesc] = useState('')
    const { mutateAsync: createMutate, isPending: createPending } = useCreateShift()
    const navigate = useNavigate()
    const { shiftMonth, shiftYear, setFormOpen, sendBox, prevDesc } = useContext(ShiftsContext)
    const { getData } = useContext(GlobalContext)
    const user = getData("userData")
    const { groupId: shiftGroupId } = useShiftStore()

    const handleCreateShift = async (groupId) => {
      try {
        await createMutate({ 
          groupId, shiftDays: filledShifts, description: shiftsDesc,
          month: String(shiftMonth), year: String(shiftYear)
        })
        setFormOpen(false)
        setSnackbar({ open: true, message: 'شیفت ها با موفقیت ارسال شد', severity: 'success' })
        setTimeout(() => navigate('/shifts'), 500)
      } catch (error) {
        const msg = handleApiErrors(error);
        setSnackbar({ open: true, message: msg, severity: 'error' })
      }
    }

    const handleScrollBox = () => {
      if(sendBox.current)
        sendBox.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    useEffect(() => {
      if(prevDesc) setShiftsDesc(prevDesc)
    }, [prevDesc])

    return (
      <Box mt={2} width="100%" ref={sendBox}>
        <Collapse in={formOpen} sx={{ mt: 2 }} onEntered={handleScrollBox}>
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

            <Button
              sx={{
                  py: "8px",
                  px: "16px",
                  mt: 1,
                  bgcolor: "secondary.dark",
                  color: "whitesmoke",
              }}
              onClick={() => handleCreateShift(shiftGroupId)}
              disabled={createPending}
            >
              {user?.role === 'MATRON' ? 'ثبت نهایی' : 'ارسال به سرپرستار'}
            </Button>
            <Button
              sx={{
                  py: "8px",
                  px: "16px",
                  mt: 1,
                  ml: 1,
                  bgcolor: "error.dark",
                  color: "whitesmoke",
              }}
              onClick={() => setFormOpen(false)}
            >
              انصراف
            </Button>
          </Paper>
        </Collapse>
      </Box>
    )
}
