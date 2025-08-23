import { Box, Grid, Input, Paper, Typography } from '@mui/material'
import { useTheme } from "@mui/material/styles";

export default function DayLimitBox({ dayLimit, handleDayLimit }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Grid size={{ xs: 12 }} mt={2}>
            <Paper
                elevation={3}
                sx={{
                    p: 2, border: '2px solid #1976d2',
                    display: 'flex', alignItems: 'center'
                }}
            >
                <Typography
                    variant='h6'
                    color='secondary'
                    sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                    مهلت ارسال :
                </Typography>

                <Box
                    sx={{
                        border: '1px solid #cfaeaeff',
                        borderRadius: 2,
                        padding: 1.5,
                        backgroundColor: '#f0f8ff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        mx: 2
                    }}
                >
                    <Input
                        type='number'
                        inputProps={{ min: 1, max: 30 }}
                        sx={{ color: "#000" }}
                        value={dayLimit}
                        onChange={(e) => handleDayLimit(Number(e.target.value))}
                    />
                </Box>
                <Typography
                    variant='h6' align='center' gutterBottom
                    sx={{ color: isDark ? '#f5f5f5' : '#1e1e1e' }}
                >
                    ام ماه
                </Typography>
            </Paper>
        </Grid>
    )
}
