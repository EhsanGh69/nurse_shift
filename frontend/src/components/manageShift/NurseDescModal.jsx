import { useEffect, useState } from 'react'
import { Modal, Box, Typography, Button, Paper } from '@mui/material';
import { useTheme } from "@mui/material/styles";

import { modalBox } from '../../styles/globalStyles'
import { useNurseDescription } from '../../api/shiftManagement.api'

export default function NurseDescModal({ selectedShift, open, setModalOpen }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { isLoading, data } = useNurseDescription(selectedShift.shiftId)
  const [nurseDesc, setNurseDesc] = useState(null)

  useEffect(() => {
    if(!isLoading && data) setNurseDesc(data.description)
  }, [isLoading, data])

  return (
    <Modal open={open}>
        <Box sx={modalBox} width={{ xs: "80%", md: "60%", lg: "40%", xl: "35%" }}>
            <Typography 
              variant='h6' mb={2} sx={{ fontFamily: 'Vazir' }}
              color={isDark ? "#f5f5f5" : "#1e1e1e"}
            >
              {selectedShift.shiftUser}
            </Typography>
            
            <Box border="1px dotted red" p={2} mb={2}>
              <Typography 
                variant='body1' mb={2} sx={{ fontFamily: 'Vazir', textAlign: 'left' }}
                color={isDark ? "#f5f5f5" : "#1e1e1e"}
              >
                {nurseDesc ? nurseDesc : "بدون توضیحات"}
              </Typography>
            </Box>

            <Button color='secondary' variant='outlined' onClick={() => setModalOpen(false)}>بستن</Button>
        </Box>
    </Modal>
  )
}

