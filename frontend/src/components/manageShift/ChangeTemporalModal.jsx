import { Modal, Box, Typography, Button, Paper } from '@mui/material';
import { useTheme } from "@mui/material/styles";

import { modalBox } from '../../styles/globalStyles'
import { useChangeTemporal, useChangeConfirm } from '../../api/shiftManagement.api'
import handleApiErrors from '../../utils/apiErrors';
import useShiftStore from '../../store/shiftStore';

export default function ChangeTemporalModal({ open, closeHandler, shiftId, status, modalType, setSnackbar }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { groupId } = useShiftStore();

  const { mutateAsync: temporalMutate } = useChangeTemporal()
  const { mutateAsync: confirmMutate } = useChangeConfirm()

  const handleChangeTemporalConfirm = async () => {
    try {
      if(modalType === "temporal") {
        await temporalMutate({ groupId, shiftId })
        setSnackbar({ 
          open: true, 
          message: status ? 'ویرایش پرستار با موفقیت غیرفعال شد' : 'ویرایش پرستار با موفقیت فعال شد', 
          severity: 'success' 
        })
      }
      else if(modalType === "confirm") {
        await confirmMutate({ groupId, shiftId })
        setSnackbar({ 
          open: true, 
          message: status ? 'تایید درخواست های پرستار با موفقیت لغو شد' : 'درخواست های پرستار با موفقیت تایید شد', 
          severity: 'success' 
        })
      }
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
                {modalType === "temporal"
                  ? (
                    <span>
                      {status 
                        ? "آیا از غیرفعال سازی ویرایش پرستار اطمینان دارید؟"
                        : "آیا از فعال سازی ویرایش پرستار اطمینان دارید؟"
                      }
                    </span>
                  ) : (
                    <span>
                      {status 
                        ? "آیا از لغو تایید درخواست های پرستار اطمینان دارید؟"
                        : "آیا از تایید درخواست های پرستار اطمینان دارید؟"
                      }
                    </span>
                  )
                }
              </Typography>
              {!status && (
                <Typography 
                  component="p"
                  variant='body1' mb={2} sx={{ fontFamily: 'Vazir' }}
                  color="error"
                >
                 {modalType === "temporal"
                  ? <span> با فعال سازی ویرایش پرستار تا ارسال مجدد شیفت ها امکان تغییر آنها را نخواهید داشت</span>
                  : <span> با تایید درخواست های پرستار تا زمان لغو تایید امکان تغییر آنها را نخواهید داشت</span>
                 }
                </Typography>
              )}
            </Box>

            <Box>
              <Button color='primary' sx={{ mr: 2 }} variant='contained'
              onClick={handleChangeTemporalConfirm}>تایید</Button>
              <Button color='secondary' variant='outlined' onClick={closeHandler}>انصراف</Button>
            </Box>
        </Box>
    </Modal>
  )
}