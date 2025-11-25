import { useState } from 'react'
import { Modal, Button, Grid } from '@mui/material';

import { modalBox } from '../../styles/globalStyles'
import { useEditShiftSchedule } from '../../api/shiftSchedule.api'
import useShiftStore from "../../store/shiftStore";
import handleApiErrors from '../../utils/apiErrors';
import ShiftDayInput from './ShiftDayInput';

export default function EditNurseShiftModal({ open, setEditModalOpen, selectedNurse, setSnackbar }) {
  const [shiftType, setShiftType] = useState('')
  const [monthDay, setMonthDay] = useState('')
  const { groupId } = useShiftStore();
  const { mutateAsync, isPending } = useEditShiftSchedule()

  const handleChangeShift = async () => {
    try {
      if(selectedNurse.nurseId && selectedNurse.shiftDay && selectedNurse.shiftType){
        await mutateAsync({ 
            groupId, memberId: selectedNurse.nurseId,
            shiftDay: monthDay ? monthDay : selectedNurse.shiftDay, 
            shiftType: shiftType ? shiftType : selectedNurse.shiftType
        })
        setSnackbar({ open: true, message: 'پرستار با موفقیت منتقل شد ویرایش شد', severity: 'success' })
        setTimeout(() => setEditModalOpen(false), 500)
      }else {
        setEditModalOpen(false)
      }
    } catch (error) {
      const msg = handleApiErrors(error);
      setSnackbar({ open: true, message: msg, severity: 'error' })
    }
  }

  return (
    <Modal open={open}>
        <Grid container sx={modalBox} width={{ xs: "80%", md: "60%", lg: "40%", xl: "35%" }}>
            <ShiftDayInput 
              selectedNurseName={selectedNurse.nurseName}
              selectedShiftDay={selectedNurse.shiftDay}
              selectedShiftType={selectedNurse.shiftType}
              shiftType={shiftType} setShiftType={setShiftType}
              monthDay={monthDay} setMonthDay={setMonthDay}
            />

            <Grid size={{ xs: 12 }} mt={2}>
                <Button onClick={handleChangeShift} disabled={isPending}
                color='primary' sx={{ mr: 2 }} variant='contained'>ذخیره تغییرات</Button>
                <Button color='secondary' variant='outlined' onClick={() => setEditModalOpen(false)}>انصراف</Button>
            </Grid>
        </Grid>
    </Modal>
  )
}