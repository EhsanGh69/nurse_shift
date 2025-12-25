import { useState } from 'react';
import { Box, Button, Checkbox, Divider, Grid, Input, Paper, Typography, Avatar } from '@mui/material'
import { Remove, Check, Clear } from '@mui/icons-material'
import { useTheme } from "@mui/material/styles";
import { BACKEND_URL } from "../../config"


export default function MaxShiftsMember({ 
    member, userMutable, userMaxCount, changeMaxCount, changeMutable, handleSetMaxShifts, setResetMax
}) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [isEdit, setIsEdit] = useState(false)

    return (
        <Grid size={{ xs: 12, lg: 6 }} mt={2}>
            <Paper
                elevation={3}
                sx={{ p: 2, border: '2px solid #1976d2', width: "90%" }}
            >
                <Box display="flex" alignItems="center">
                    <Avatar
                        alt={member.firstName}
                        src={member.avatar && `${BACKEND_URL}${member.avatar}`}
                        sx={{ 
                            width: 50, height: 50, mr: 1,
                            backgroundColor: isDark ? '#9e9b9bff' : null
                        }}
                    />
                    <Typography
                        variant='h6'
                        color='secondary'
                        sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                        {`${member.firstName} ${member.lastName}`}
                    </Typography>
                </Box>

                <Box display="flex" flexWrap="wrap" mt={2}>
                    {["M", "E", "N", "CS"].map((shiftItem, idx) => (
                        <Box
                            key={idx}
                            sx={{
                                border: '1px solid #cfaeaeff',
                                borderRadius: 2,
                                padding: 1,
                                mr: 1,
                                mt: 1,
                                backgroundColor: '#f0f8ff',
                                display: 'flex',
                                alignItems: 'center',
                                width: shiftItem === 'CS' ? '30%' : '12%',
                                height: "45px"
                            }}
                        >
                            <Typography variant='body1'
                                sx={{ fontWeight: 'bold', color: "#18722aff", mr: 0.5 }}>
                                {shiftItem === 'CS' ? 'شیفت ترکیبی' : shiftItem}
                            </Typography>
                            <Divider orientation='vertical' flexItem
                                sx={{ backgroundColor: "#000" }} />
                            {userMutable
                                ? (
                                    <>
                                        <Input
                                            type='text'
                                            inputProps={{ min: 0 }}
                                            sx={{
                                                color: "#000", ml: 1,
                                                display: isEdit ? "inherit" : "none",
                                                width: "20%"
                                            }}
                                            value={userMaxCount[shiftItem]}
                                            onChange={(e) => {
                                                if (isNaN(e.target.value))
                                                    changeMaxCount(member._id, shiftItem, 0)
                                                else
                                                    changeMaxCount(member._id, shiftItem, Number(e.target.value))
                                            }}
                                        />
                                        <Typography variant='body1'
                                            sx={{
                                                fontWeight: 'bold', color: "#183372ff", mr: 0, p: 1,
                                                display: isEdit ? "none" : "inherit"
                                            }}>
                                            {userMaxCount[shiftItem]}
                                        </Typography>
                                    </>
                                ) : (
                                    <Typography variant='body1'
                                        sx={{ fontWeight: 'bold', color: "#183372ff", mr: 1, p: 1 }}>
                                        <Remove />
                                    </Typography>
                                )
                            }
                        </Box>
                    ))}

                    <Box
                        sx={{
                            border: '1px solid #cfaeaeff',
                            borderRadius: 2,
                            padding: 1,
                            mr: 1,
                            mt: 1,
                            backgroundColor: '#f0f8ff',
                            display: 'flex',
                            alignItems: 'center',
                            width: '25%'
                        }}
                    >
                        <Checkbox
                            checked={userMutable}
                            sx={{
                                color: "#000", width: 50, ml: 1,
                                display: isEdit ? 'inherit' : 'none'
                            }}
                            onChange={(e) => changeMutable(member._id, e.target.checked)}
                        />
                        <Typography display={isEdit ? 'none' : 'inherit'}>
                            {userMutable ? <Check color='success' /> : <Clear color='error' />}
                        </Typography>
                        <Typography sx={{ fontWeight: 'bold', color: "#726d6dff", fontSize: 16 }}>
                            برنامه متغیر
                        </Typography>
                    </Box>
                </Box>

                <Box display="flex" alignItems="center">
                    <Button variant='contained' color='info'
                        sx={{
                            fontSize: 20, color: "#0e0e0e", px: 5, mr: 1, mt: 1,
                            display: isEdit ? 'none' : 'inherit'
                        }}
                        onClick={() => setIsEdit(true)}
                    >
                        ویرایش
                    </Button>

                    <Button variant='contained' color='success'
                        sx={{
                            fontSize: 20, color: "#0e0e0e", px: 5, mt: 1, mr: 1,
                            display: isEdit ? 'inherit' : 'none'
                        }}
                        onClick={() => {
                            handleSetMaxShifts(member._id)
                            setIsEdit(false)
                        }}
                    >
                        ذخیره تغییرات
                    </Button>

                    <Button variant='contained' color='error'
                        sx={{
                            fontSize: 20, color: "#0e0e0e", px: 5, mt: 1,
                            display: isEdit ? 'inherit' : 'none'
                        }}
                        onClick={() => {
                            setIsEdit(false)
                            setResetMax(true)
                        }}
                    >
                        انصراف
                    </Button>
                </Box>
            </Paper>
        </Grid>
    )
}