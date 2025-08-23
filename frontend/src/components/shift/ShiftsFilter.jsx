import { Grid, MenuItem, TextField } from '@mui/material'
import { useTheme } from "@mui/material/styles";

import { textFieldStyle } from '../../styles/globalStyles';

export default function ShiftsFilter(
    { selectedYear, setSelectedYear, selectedMonth, setSelectedMonth, shiftYear }
) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const getYearItems = () => {
        const years = []
        let initialYear = 1404
        let different = shiftYear > initialYear ? shiftYear - initialYear : 0
        for (let i = 0; i <= different; i++) {
            years.push(initialYear + i)
        }
        return years
    }

    return (
        <Grid size={{ xs: 12 }} my={2}>
            <TextField
                select
                label="سال"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                sx={{
                    mb: 2, ...textFieldStyle(isDark),
                    width: { xs: "100%", md: "45%", lg: "20%" }
                }}
            >
                {getYearItems().map(year => (
                    <MenuItem key={year} value={year} selected={year === shiftYear}>
                        {year}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                select
                label="ماه"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                sx={{
                    mb: 2, ...textFieldStyle(isDark), ml: { xs: 0, md: 2 },
                    width: { xs: "100%", md: "45%", lg: "20%" }
                }}
            >
                <MenuItem value="" selected={true}>
                    همه ماه ها
                </MenuItem>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                    <MenuItem key={month} value={month}>
                        {month}
                    </MenuItem>
                ))}
            </TextField>
        </Grid>
    )
}
