import { useState, useContext } from 'react'
import { Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

import { useCreateShift } from "../../api/shift.api";
import ShiftsContext from "../../context/ShiftsContext";
import handleApiErrors from '../../utils/apiErrors';

export default function SendShift({ setSnackbar, filledShifts, formOpen, handlerManager }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [shiftsDesc, setShiftsDesc] = useState('')
    const { mutateAsync: createMutate, isPending: createPending } = useCreateShift()
    const navigate = useNavigate()
    const { shiftMonth, shiftYear } = useContext(ShiftsContext)

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

    return (
        <>
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
        </>
    )
}
