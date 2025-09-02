import { useState, useContext } from 'react';
import { Grid, Button, Paper, Typography, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from 'react-router-dom';
import { escape } from 'he';

import MainLayout from '../mui/MainLayout';
import AppHeader from '../components/AppHeader';
import SnackAlert from '../components/SnackAlert';
import BackButton from '../components/BackButton';
import { useSendUserPoll } from '../api/poll.api';
import handleApiErrors from '../utils/apiErrors';
import { GlobalContext } from '../context/GlobalContext';


export default function SendPoll() {
    const [text, setText] = useState("");
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const navigate = useNavigate()
    const { mutateAsync, isPending } = useSendUserPoll()
    const { getData } = useContext(GlobalContext)
    const user = getData("userData")
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'

    const handleSendPoll = async () => {
        try {
            if (text) {
                await mutateAsync({ opinion: escape(text.trimEnd()) })
                setSnackbar({ open: true, message: 'نظر شما با موفقیت ارسال شد', severity: 'success' })
                if (user?.role === 'MATRON' || user?.role === 'ADMIN')
                    setTimeout(() => navigate('/matron'), 500)
                if (user?.role === 'NURSE')
                    setTimeout(() => navigate('/nurse'), 500)
            }
        }
        catch (error) {
            const msg = handleApiErrors(error);
            setSnackbar({ open: true, message: msg, severity: 'error' })
        }
    }

    return (
        <MainLayout title="نظرات و پیشنهادات">
            <AppHeader />
            <Typography
                variant='h4' align='center' gutterBottom
                sx={{ color: isDark ? '#f5f5f5' : '#1e1e1e' }}
            >
                انتقادات و پیشنهادات شما
            </Typography>
            <Grid size={{ xs: 12, lg: 7 }} mx="auto" mt={2}>
                <Paper
                    elevation={3}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        flexFlow: 'column',
                        p: 1,
                        borderRadius: 3,
                        bgcolor: isDark ? "#888282ff" : "#dddddd",
                    }}
                >
                    <TextField
                        value={text}
                        onChange={(e) => setText(e.target.value.trimStart())}
                        label="نظر خود را بنویسید ..."
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        sx={{
                            "& .MuiInputBase-input": {
                                textAlign: "left"
                            },
                            bgcolor: isDark ? "#1e1e1e" : null
                        }}
                    />
                    <Button
                        fullWidth
                        variant='contained'
                        color='primary'
                        type='button'
                        sx={{ my: 2, fontSize: 20 }}
                        onClick={handleSendPoll}
                        disabled={text && !isPending ? false : true}
                    >
                        <SendIcon />
                        <Typography>ارسال</Typography>
                    </Button>
                    <BackButton backUrl={user?.role === 'NURSE' ? '/nurse' : '/matron'} />
                </Paper>
            </Grid>

            <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
        </MainLayout>
    )
}