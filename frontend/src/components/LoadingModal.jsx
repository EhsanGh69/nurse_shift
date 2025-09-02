import { Modal, Box, Typography, CircularProgress } from '@mui/material';
import { modalBox } from '../styles/globalStyles'

const LoadingModal = ({ open, message }) => {
    return (
        <Modal open={open}>
            <Box sx={modalBox}>
                <Typography variant='h6' mb={2} sx={{ fontFamily: 'Vazir' }} >{message}</Typography>
                <CircularProgress color='success' size={55} thickness={5} />
            </Box>
        </Modal>
    )
}

export default LoadingModal;