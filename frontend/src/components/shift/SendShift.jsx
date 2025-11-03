import { useState, useContext, useMemo } from 'react'
import { Box, Button, Collapse, MenuItem, Paper, TextField, Typography, useMediaQuery } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

import { useCreateShift } from "../../api/shift.api";
import ShiftsContext from "../../context/ShiftsContext";
import handleApiErrors from '../../utils/apiErrors';
import { GlobalContext } from "../../context/GlobalContext";
import useShiftStore from '../../store/shiftStore';
import { textFieldStyle } from '../../styles/globalStyles';

export default function SendShift({ setSnackbar, filledShifts, formOpen }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const isUpMd = useMediaQuery(theme.breakpoints.up('md'))
    const favCSItems = useMemo(() => ["ME", "MN", "NE", "EN", "NM"])
    const [shiftsDesc, setShiftsDesc] = useState('')
    const [favCS, setFavCS] = useState('')
    const { mutateAsync: createMutate, isPending: createPending } = useCreateShift()
    const navigate = useNavigate()
    const { shiftMonth, shiftYear, setFormOpen, sendBox } = useContext(ShiftsContext)
    const { getData } = useContext(GlobalContext)
    const user = getData("userData")
    const { groupId: shiftGroupId } = useShiftStore()

    const handleCreateShift = async (groupId) => {
      try {
        await createMutate({ 
          groupId, shiftDays: filledShifts, description: shiftsDesc,
          month: String(shiftMonth), year: String(shiftYear), favCS
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

    return (
      <Box mt={2} width="100%" ref={sendBox}>
        <Collapse in={formOpen} sx={{ mt: 2 }} onEntered={handleScrollBox}>
          <Paper sx={{ p: 2 }}>

            <TextField
              fullWidth
              select
              label="شیفت ترکیبی"
              name='favCS'
              value={favCS}
              onChange={(e) => setFavCS(e.target.value)}
              sx={{ mb: 0, ...textFieldStyle(isDark), width: isUpMd ? "50%" : "100%" }}
            >
              {favCSItems.map((favCSItem, index) => (
                <MenuItem key={index} value={favCSItem}>
                  {favCSItem}
                </MenuItem>
              ))}
            </TextField>
            <Typography variant="caption" color="info" component="p" mb={2}>
              شیفت ترکیبی مورد علاقه خود را انتخاب نمایید
            </Typography>

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

            {user?.role === 'MATRON'  
              ?(
                <Typography variant="caption" color="info" component="p" mb={2}>
                  پس از ثبت نهایی، شیفت ها در بخش شیفت های پرستاران قابل ویرایش می باشد
                </Typography>
              )
              :(
                <Typography variant="caption" color="warning" component="p" mb={2}>
                  پس از ارسال شیفت ها به سرپرستار امکان ویرایش وجود ندارد
                </Typography>
              )
            }

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
