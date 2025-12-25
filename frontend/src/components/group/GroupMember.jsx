import { Avatar, Box, Typography } from '@mui/material';
import { Phone } from '@mui/icons-material';
import { BACKEND_URL } from "../../config"

export default function GroupMember({ member, inviteCode }) {
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
                src={member?.avatar && `${BACKEND_URL}${member?.avatar}`}
                sx={{ width: 50, height: 50, mr: 1 }}
            />
            <Typography variant='body1'
                sx={{ color: '#fff', borderRight: 1, pr: 1 }}>
                {`${member?.firstName} ${member?.lastName}`}
            </Typography>
            <Typography variant='body2'
                sx={{
                    color: 'whitesmoke', px: 1, fontSize: 18,
                    display: 'flex', alignItems: 'center'
                }}>
                <Phone />
                {member?.mobile}
            </Typography>
            {inviteCode && (
                <Typography variant='body1'
                    sx={{ color: '#fff', borderLeft: 1, pl: 1 }}>
                    <span>کد دعوت : </span> <span>{inviteCode}</span>
                </Typography>
            )}
        </Box>

    )
}
