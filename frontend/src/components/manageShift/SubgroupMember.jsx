import { DisabledByDefault } from '@mui/icons-material'
import { Avatar, Box, IconButton, Typography } from '@mui/material'
import { useTheme } from "@mui/material/styles";

export default function SubgroupMember({ member, handleRemoveMember }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    return (
        <Box
            display="flex" 
            bgcolor="warning.main" alignItems="center"
            padding={1}
            borderRadius={1}
            >
            <IconButton
                title='حذف از زیرگروه'
                sx={{color: "error.dark"}}
                onClick={() => handleRemoveMember(member.id)}
            >
                <DisabledByDefault fontSize='large' />
            </IconButton>
            <Box display="flex" flexDirection="column" borderLeft="1px solid whitesmoke" pl={1}>
                <Box display="flex" alignItems="center">
                    <Avatar
                        alt={member.fullName}
                        src={member.avatar && `http://127.0.0.1:4000${member.avatar}`}
                        sx={{ 
                            width: 50, height: 50, mr: 1,
                            backgroundColor: isDark ? '#9e9b9bff' : null
                        }}
                    />
                    <Typography
                        variant='h6'
                        sx={{ 
                                textTransform: 'uppercase', 
                                fontWeight: 'bold', color: "rgba(40, 39, 40, 0.77)" 
                            }}>
                        {member.fullName}
                    </Typography>
                </Box>
                <Box display="flex" mt={0} justifyContent="center">
                    <Typography
                        variant='body2'
                        sx={{ 
                            textTransform: 'uppercase', fontWeight: 'bold',
                            color: "rgba(40, 39, 40, 0.77)", borderRight: "2px solid whitesmoke",
                            pr: 2
                        }}>
                        <Typography component="span">سمت: </Typography>
                        <Typography component="span">{member.post}</Typography>
                    </Typography>
                    <Typography
                        variant='body2'
                        sx={{ 
                            textTransform: 'uppercase', fontWeight: 'bold', pl: 2, 
                            color: "rgba(40, 39, 40, 0.77)" 
                        }}>
                        <Typography component="span">سابقه: </Typography>
                        <Typography component="span">{member.experience}</Typography>
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}