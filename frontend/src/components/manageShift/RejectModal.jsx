import { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { useTheme } from "@mui/material/styles";

import { modalBox } from '../../styles/globalStyles'
import { useRejectShift, useRejectedShifts } from '../../api/shiftManagement.api'
import useShiftStore from "../../store/shiftStore";
import handleApiErrors from '../../utils/apiErrors';
import { getShiftDay } from '../../utils/shiftsData'


export default function RejectModal({ open, closeHandler, selectedShift, setSnackbar }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { groupId } = useShiftStore();
  const { mutateAsync, isPending } = useRejectShift(selectedShift.shiftId)
  const { isLoading, data } = useRejectedShifts(selectedShift.shiftId, groupId)
  const [rejectModalMsg, setRejectModalMsg] = useState(null)

  useEffect(() => {
    if(!isLoading && data) {
      if (data.rejects.length){
        setRejectModalMsg(
            <>
                <p style={{ color: "red" }}>رد شیفت {getShiftDay(selectedShift.shiftDay)[0]} {" "}
                  روز {getShiftDay(selectedShift.shiftDay)[1]} ام</p>
                <p>شیفت {selectedShift.shiftUser} را قبلا رد کرده اید</p>
                <p>آیا باز هم می خواهید رد کنید؟</p>
            </>
          );
      }
      else setRejectModalMsg(`آیا از رد کردن شیفت ${selectedShift.shiftUser} اطمینان دارید؟`);
    }
  }, [isLoading, data])

  const handleRejectShift = async () => {
    try {
      if(selectedShift.shiftId){
        await mutateAsync({ groupId, shiftDay: selectedShift.shiftDay })
        setSnackbar({ open: true, message: 'شیفت پرستار با موفقیت رد شد', severity: 'success' })
      }
    } catch (error) {
      closeHandler()
      const msg = handleApiErrors(error);
      setSnackbar({ open: true, message: msg, severity: 'error' })
    }
  }

  return (
    <Modal open={open}>
        <Box sx={modalBox} width={{ xs: "80%", md: "60%", lg: "40%", xl: "35%" }}>
            <Typography 
              variant='h6' mb={2} sx={{ fontFamily: 'Vazir' }}
              color={isDark ? "#f5f5f5" : "#1e1e1e"}
            >
              {rejectModalMsg && rejectModalMsg}
            </Typography>
            <Button onClick={handleRejectShift} disabled={isPending}
              color='primary' sx={{ mr: 2 }} variant='contained'>بله</Button>
            <Button color='secondary' variant='outlined' onClick={closeHandler}>خیر</Button>
        </Box>
    </Modal>
  )
}
