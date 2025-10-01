import { Modal, Box, Typography, Button } from '@mui/material';
import { useTheme } from "@mui/material/styles";

import { modalBox } from '../../styles/globalStyles'
import { useRemoveSubGroup } from '../../api/group.api'
import useShiftStore from "../../store/shiftStore";
import handleApiErrors from '../../utils/apiErrors';


export default function RemoveSubgroupModal({ open, closeHandler, order }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { groupId } = useShiftStore();
  const { mutateAsync, isPending } = useRemoveSubGroup()

    const handleRemoveSubgroup = async () => {
        try {
            await mutateAsync({ groupId, order })
            setSnackbar({ open: true, message: "زیرگروه با موفقیت حذف شد", severity: 'success' })
        } catch (error) {
            const msg = handleApiErrors(error);
            setSnackbar({ open: true, message: msg, severity: 'error' })
        }finally {
            closeHandler()
        }
    }

  return (
    <Modal open={open}>
        <Box sx={modalBox} width={{ xs: "80%", md: "60%", lg: "40%", xl: "35%" }}>
            <Typography 
              variant='h6' mb={2} sx={{ fontFamily: 'Vazir' }}
              color={isDark ? "#f5f5f5" : "#1e1e1e"}
            >
              آیا از حذف این زیرگروه اطمینان دارید؟
            </Typography>
            <Button onClick={handleRemoveSubgroup} disabled={isPending}
              color='primary' sx={{ mr: 2 }} variant='contained'>بله</Button>
            <Button color='secondary' variant='outlined' onClick={closeHandler}>خیر</Button>
        </Box>
    </Modal>
  )
}
