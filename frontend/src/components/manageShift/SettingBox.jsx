import { Box, Divider, Grid, Input, Paper, Typography } from '@mui/material'


export default function SettingBox({ 
        title,  shiftKeys, limitCount, handleChangeCount, inputValue 
    }) {
    return (
        <Grid size={{ xs: 12 }} mt={2}>
            <Paper
                elevation={3}
                sx={{ p: 2, border: '2px solid #1976d2' }}
            >
                <Typography 
                    variant='h6'
                    color='secondary' 
                    sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                    {title} :
                </Typography>

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
                    {shiftKeys.map(shift => (
                        <Box key={shift}
                            sx={{
                                border: '1px solid #cfaeaeff',
                                borderRadius: 2,
                                padding: 1.5,
                                backgroundColor: '#f0f8ff',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5
                            }}
                        >
                            <Typography sx={{ fontWeight: 'bold', color: "#726d6dff" }}>
                                {shift}
                            </Typography>
                            <Divider orientation='vertical' flexItem
                                sx={{ backgroundColor: "#000" }} />
                            <Input
                                type='number'
                                inputProps={{ min: 1, max: limitCount }}
                                sx={{ color: "#000" }}
                                value={inputValue[shift]}
                                onChange={(e) => handleChangeCount(shift, Number(e.target.value))}
                            />
                        </Box>
                    ))}
                </Box>
            </Paper>
        </Grid>
    )
}
