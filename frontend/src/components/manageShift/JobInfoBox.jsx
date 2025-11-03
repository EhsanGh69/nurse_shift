import { useState, useEffect } from 'react';
import { Avatar, Box, Divider, Grid, Input, Paper, Typography, Button, TextField, MenuItem } from '@mui/material';
import { useTheme } from "@mui/material/styles";
import { textFieldStyle } from '../../styles/globalStyles';
import { postTitles, employTitles } from '../../constants/shifts';


export default function JobInfoBox({ 
    member, fields, nurseInfos, setNurseInfos, handleSetJobInfo, onCancel
}) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [isEdit, setIsEdit] = useState(false)

    const handleChangeInfos = (field, value) => {
        setNurseInfos(prev => ({ ...prev, [member._id]: { ...prev[member._id], [field]: value } }))
        setIsEdit(true)
    }

    return (
        <Grid size={{ xs: 12 }} mt={2}>
            <Paper
                elevation={3}
                sx={{ p: 2, border: '2px solid #1976d2' }}
            >
                <Box display="flex" alignItems="center">
                    <Avatar
                        alt={member.firstName}
                        src={member.avatar && `http://127.0.0.1:4000${member.avatar}`}
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
                
                <Box
                    sx={{
                        border: '2px dashed #ddd',
                        padding: 2,
                        marginTop: 2,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 2
                    }}
                >
                    {fields?.map((field, idx) => (
                        <Box key={idx}
                            sx={{
                                border: '1px solid #cfaeaeff',
                                borderRadius: 2,
                                padding: 1.5,
                                backgroundColor: '#f0f8ff',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                            }}
                        >
                            <Typography sx={{ fontWeight: 'bold', color: "#726d6dff", fontSize: 16 }}>
                                {field.title}
                            </Typography>
                            <Divider orientation='vertical' flexItem
                                sx={{ backgroundColor: "#000" }} />

                            {field.name === 'post' && (
                                <TextField
                                    fullWidth
                                    select
                                    name='post'
                                    value={nurseInfos[field.name]}
                                    onChange={(e) => handleChangeInfos(field.name, Number(e.target.value))}
                                    sx={{
                                            ...textFieldStyle(isDark),
                                            display: isEdit ? 'inherit' : 'none',
                                            p: 0
                                        }}
                                >
                                {postTitles.map((pTitle, index) => (
                                    <MenuItem key={index} value={index + 1}>
                                        {pTitle}
                                    </MenuItem>
                                ))}
                                </TextField>
                            )}

                            {field.name === 'employment' && (
                                <TextField
                                    fullWidth
                                    select
                                    name='employment'
                                    value={nurseInfos[field.name]}
                                    onChange={(e) => handleChangeInfos(field.name, Number(e.target.value))}
                                    sx={{...textFieldStyle(isDark), display: isEdit ? 'inherit' : 'none'}}
                                >
                                    {employTitles.map((eTitle, index) => (
                                        <MenuItem key={index} value={index + 1}>
                                            {eTitle}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}

                            {field.name !== 'employment' && field.name !== 'post' && (
                                <Input
                                    type='number'
                                    inputProps={{ min: 1 }}
                                    sx={{ 
                                        color: "#000", width: 50, ml: 1,
                                        display: isEdit ? 'inherit' : 'none' 
                                    }}
                                    value={nurseInfos[field.name]}
                                    onChange={(e) => handleChangeInfos(field.name, Number(e.target.value))}
                                />
                            )}
                            <Typography 
                                sx={{ 
                                    fontWeight: 'bold', color: "#726d6dff", pr: 2, pl: 1,
                                    display: isEdit ? 'none' : 'inherit'
                                }}
                            >
                                {field.name === 'post' && postTitles[nurseInfos[field.name] - 1]}
                                {field.name === 'employment' && employTitles[nurseInfos[field.name] - 1]}
                                {field.name !== 'employment' && field.name !== 'post' && nurseInfos[field.name]}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                <Box display="flex" alignItems="center">
                    <Button variant='contained' color='info'
                        sx={{ 
                            fontSize: 20, color: "#0e0e0e", px: 5, mr: 1, mt: 1,
                            display: isEdit ? 'none' : 'inherit'
                        }}
                        onClick={() => {
                            setIsEdit(true)
                            onCancel(false)
                        }}
                    >
                        ویرایش
                    </Button>
                
                    <Button variant='contained' color='success'
                        sx={{ 
                            fontSize: 20, color: "#0e0e0e", px: 5, mt: 1, mr: 1,
                            display: isEdit ? 'inherit' : 'none'
                        }}
                        onClick={() => {
                            handleSetJobInfo(member._id)
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
                            onCancel(true)
                        }}
                    >
                        انصراف
                    </Button>
                </Box>
            </Paper>
        </Grid>
    )
}
