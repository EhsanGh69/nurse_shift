import { Modal, Box, Typography, Button, Paper } from '@mui/material';
import { useTheme } from "@mui/material/styles";

import { modalBox } from '../../styles/globalStyles'
import { useChangeTemporal } from '../../api/shiftManagement.api'
import handleApiErrors from '../../utils/apiErrors';
import useShiftStore from '../../store/shiftStore';

export default function NurseDescModal({ open, closeHandler, shiftId, temporal, setSnackbar }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { groupId } = useShiftStore();

  const { isPending, mutateAsync } = useChangeTemporal()

  const handleChangeTemporal = async () => {
    try {
      await mutateAsync({ groupId, shiftId })
        setSnackbar({ 
          open: true, 
          message: temporal ? 'ویرایش پرستار با موفقیت غیرفعال شد' : 'ویرایش پرستار با موفقیت فعال شد', 
          severity: 'success' 
        })
    } catch (error) {
        const msg = handleApiErrors(error);
        setSnackbar({ open: true, message: msg, severity: 'error' })
    }finally {
      setTimeout(() => closeHandler(), 500)
    }
  }
  
  return (
    <Modal open={open}>
        <Box sx={modalBox} width={{ xs: "80%", md: "60%", lg: "40%", xl: "35%" }}>
            <Box p={2} mb={2} component="div">
              <Typography 
                component="p"
                variant='h6' mb={2} sx={{ fontFamily: 'Vazir' }}
                color={isDark ? "#f5f5f5" : "#1e1e1e"}
              >
                {temporal 
                  ? "آیا از غیرفعال سازی ویرایش پرستار اطمینان دارید؟"
                  : "آیا از فعال سازی ویرایش پرستار اطمینان دارید؟"
                }
              </Typography>
              {!temporal && (
                <Typography 
                  component="p"
                  variant='body1' mb={2} sx={{ fontFamily: 'Vazir' }}
                  color="error"
                >
                  با فعال سازی ویرایش پرستار تا ارسال مجدد شیفت ها امکان تغییر آنها را نخواهید داشت
                </Typography>
              )}
            </Box>

            <Box>
              <Button color='primary' sx={{ mr: 2 }} variant='contained' disabled={isPending}
              onClick={handleChangeTemporal}>تایید</Button>
              <Button color='secondary' variant='outlined' onClick={closeHandler}>انصراف</Button>
            </Box>
        </Box>
    </Modal>
  )
}