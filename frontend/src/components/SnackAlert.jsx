import { Snackbar, Alert } from '@mui/material';

export default function SnackAlert({ snackbar, setSnackbar }) {
    return (
        <Snackbar
            open={snackbar.open}
            autoHideDuration={5000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
                {snackbar.message}
            </Alert>
        </Snackbar>
    )
}
