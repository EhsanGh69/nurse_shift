import { Avatar, Box, Typography } from '@mui/material';
import { Phone } from '@mui/icons-material';

export default function GroupMember({ member }) {
    return (
        <Box
            sx={{
                mt: 2,
                backgroundColor: 'info.light',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                borderRadius: 1
            }}
        >
            <Avatar
                alt={`${member?.firstName} ${member?.lastName}`}
                src={member?.avatar && `http://127.0.0.1:4000${member?.avatar}`}
                sx={{ width: 50, height: 50, mr: 1 }}
            />
            <Typography variant='body1'
                sx={{ color: '#fff', borderRight: 1, pr: 1 }}>
                {`${member?.firstName} ${member?.lastName}`}
            </Typography>
            <Typography variant='body2'
                sx={{
                    color: 'whitesmoke', pl: 1, fontSize: 18,
                    display: 'flex', alignItems: 'center'
                }}>
                <Phone />
                {member?.mobile}
            </Typography>
        </Box>

    )
}
