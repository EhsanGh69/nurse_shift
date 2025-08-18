import { useMemo } from "react";
import { Snackbar, Alert, Typography } from '@mui/material';
import { Info, Warning, Error, CheckCircle } from '@mui/icons-material';
import { useTheme } from "@mui/material/styles";


export default function SnackAlert({ snackbar, setSnackbar }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const color = useMemo(() => isDark ? "#f5f5f5" : "#1e1e1e")

    const severityIcons = useMemo(() => ({
        info: <Info sx={{ fontSize: 25, color }} />,
        warning: <Warning sx={{ fontSize: 25, color }} />,
        error: <Error sx={{ fontSize: 25, color }} />,
        success: <CheckCircle sx={{ fontSize: 25, color }} />,
    }))

    return (
        <Snackbar
            open={snackbar.open}
            autoHideDuration={5000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert
                severity={snackbar.severity}
                icon={severityIcons[snackbar.severity]}
                sx={{
                    width: '100%',
                    alignItems: 'center'
                }}
                variant="filled">
                <Typography
                    mr={1}
                    sx={{ fontSize: 20, fontFamily: 'Vazir', color }}
                >
                    {snackbar.message}
                </Typography>
            </Alert>
        </Snackbar>
    )
}
