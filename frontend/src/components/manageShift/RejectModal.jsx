import { Modal, Box, Typography, Button } from '@mui/material';
import { useTheme } from "@mui/material/styles";

import { modalBox } from '../../styles/globalStyles'
import { useRejectShift } from '../../api/shiftManagement.api'
import useShiftStore from "../../store/shiftStore";
import handleApiErrors from '../../utils/apiErrors';


export default function RejectModal({ open, msg, closeHandler, selectedShift, setSnackbar }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { groupId } = useShiftStore();
  const { mutateAsync, isPending } = useRejectShift(selectedShift.shiftId)

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
              {msg}
            </Typography>
            <Button onClick={handleRejectShift} disabled={isPending}
              color='primary' sx={{ mr: 2 }} variant='contained'>بله</Button>
            <Button color='secondary' variant='outlined' onClick={closeHandler}>خیر</Button>
        </Box>
    </Modal>
  )
}
