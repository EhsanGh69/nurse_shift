import { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, Input, Divider } from '@mui/material';
import { useTheme } from "@mui/material/styles";

import { modalBox } from '../../styles/globalStyles'
import useShiftStore from '../../store/shiftStore';
import { useSubGroupShiftCount } from '../../api/group.api'
import handleApiErrors from '../../utils/apiErrors';


export default function SetSubgroupModal({ 
    open, closeHandler, setUpdateSubgroup, subsLength, handler, selectedOrder, setSnackbar
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [shiftCount, setShiftCount] = useState({ M: 1, E: 1, N: 1, CS: 1 })
  const { groupId } = useShiftStore()
  const { mutateAsync: shiftCountMutate } = useSubGroupShiftCount()

    const handleShiftCount = (shiftKey, value) => {
        setShiftCount(prev => ({
            ...prev,
            [shiftKey]: value
        }));
    };

    const getShiftCount = async (order) => {
        try {
            const data = await shiftCountMutate({ groupId, order })
            setShiftCount(prev => ({ ...prev, ...data._doc }))
        } catch (error) {
            const msg = handleApiErrors(error);
            setSnackbar({ open: true, message: msg, severity: 'error' })
        }
    }

    useEffect(() => {
        if(handler === "update" && selectedOrder)
            getShiftCount(selectedOrder)
    }, [handler, selectedOrder])

    useEffect(() => {
        if(handler === "set")
            setShiftCount({ M: 1, E: 1, N: 1, CS: 1 })
    }, [handler, selectedOrder])

  return (
    <Modal open={open}>
        <Box sx={modalBox} width={{ xs: "80%", md: "60%", lg: "40%", xl: "35%" }}>
            <Typography 
              variant='h6' mb={2} sx={{ fontFamily: 'Vazir' }}
              color={isDark ? "#f5f5f5" : "#1e1e1e"}
            >
              {handler === "set" ? "ایجاد زیر گروه جدید" : `ویرایش زیرگروه ${selectedOrder}`}
            </Typography>

            <Box
                sx={{
                    border: '1px solid #cfaeaeff',
                    borderRadius: 2,
                    padding: 1.5,
                    backgroundColor: '#f0f8ff',
                    display: 'flex',
                    alignItems: 'center',
                    width: "20%",
                    mb: 2
                }}
            >
                <Typography variant='body1'
                    sx={{ fontWeight: 'bold', color: "#18722aff", mr: 1 }}>
                    ترتیب   
                </Typography>
                <Divider orientation='vertical' flexItem
                    sx={{ backgroundColor: "#000" }} />

                <Typography variant='body1'
                    sx={{ fontWeight: 'bold', color: "#000", ml: 1 }}>
                    {handler === "set" ? subsLength + 1 : selectedOrder}
                </Typography>
            </Box>
            <Box
                sx={{
                    border: '2px dashed #ddd',
                    padding: 2,
                    marginTop: 2,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    mb: 2
                }}
            >
                {["M", "E", "N", "CS"].map((shiftItem, idx) => (
                    <Box
                        key={idx}
                        sx={{
                            border: '1px solid #cfaeaeff',
                            borderRadius: 2,
                            padding: 1.5,
                            backgroundColor: '#f0f8ff',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <Typography variant='body1'
                            sx={{ fontWeight: 'bold', color: "#18722aff", mr: 1 }}>
                            {shiftItem === 'CS' ? 'شیفت ترکیبی' : shiftItem}   
                        </Typography>
                        <Divider orientation='vertical' flexItem
                            sx={{ backgroundColor: "#000" }} />
                        <Input
                            type='number'
                            inputProps={{ min: 1 }}
                            sx={{ color: "#000", width: 50, ml: 1}}
                            value={shiftCount[shiftItem]}
                            onChange={(e) => handleShiftCount(shiftItem, Number(e.target.value))}
                        />
                    </Box>
                ))}
            </Box>
            <Button 
                onClick={() => {
                    if(handler === "set") setUpdateSubgroup(shiftCount, subsLength + 1)
                    else setUpdateSubgroup(shiftCount, selectedOrder)
                }}
                color='primary' sx={{ mr: 2, fontSize: "20px" }} variant='contained'>تایید</Button>
            <Button color='error' sx={{ fontSize: "20px" }} variant='outlined' onClick={closeHandler}>انصراف</Button>
        </Box>
    </Modal>
  )
}