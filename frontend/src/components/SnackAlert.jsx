import { Snackbar, Alert, Typography } from '@mui/material';
import { Info, Warning, Error, CheckCircle } from '@mui/icons-material';

const severityIcons = {
  info: <Info sx={{ fontSize: 25 }} />,
  warning: <Warning sx={{ fontSize: 25 }} />,
  error: <Error sx={{ fontSize: 25 }} />,
  success: <CheckCircle sx={{ fontSize: 25 }} />,
}

export default function SnackAlert({ snackbar, setSnackbar }) {
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
                <Typography mr={1} sx={{ fontSize: 20, fontFamily: 'Vazir' }}>
                    {snackbar.message}
                </Typography>
            </Alert>
        </Snackbar>
    )
}
