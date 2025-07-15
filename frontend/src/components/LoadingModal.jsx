import { Modal, Box, Typography, CircularProgress } from '@mui/material';

const LoadingModal = ({ open, message }) => {
    return (
        <Modal open={open}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    textAlign: 'center'
                }}
            >
                <Typography variant='h6' mb={2} sx={{ fontFamily: 'Vazir' }} >{message}</Typography>
                <CircularProgress color='success' size={55} thickness={5} />
            </Box>
        </Modal>
    )
}

export default LoadingModal;