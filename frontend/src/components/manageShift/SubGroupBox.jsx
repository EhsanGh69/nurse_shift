import { useEffect, useState } from 'react';
import { Avatar, Box, Button, Grid, Paper, Typography, IconButton, Alert } from '@mui/material'
import { DisabledByDefault, PersonAdd, Delete, Edit } from '@mui/icons-material'
import { useTheme } from "@mui/material/styles";

import { 
    useRemoveSubGroupMember, useUnassignedSubGroupMembers
} from '../../api/group.api'
import useShiftStore from '../../store/shiftStore';
import handleApiErrors from '../../utils/apiErrors';
import MembersList from './MembersList';
import RemoveSubgroupModal from './RemoveSubgroupModal';


export default function SubGroupBox({ 
    shiftCount, members, order, setSnackbar, setHandler, setSubOpen, setSelectedOrder
}) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [open, setOpen] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [unassignedMembers, setUnassignedMembers] = useState(null)
    const { groupId } = useShiftStore()
    const { isPending, mutateAsync } = useRemoveSubGroupMember()
    const { isLoading, data } = useUnassignedSubGroupMembers(groupId)
    
    useEffect(() => {
        if(!isLoading && data)
            setUnassignedMembers(data)
    }, [isLoading, data])

    const handleRemoveMember = async (memberId) => {
        try {
            await mutateAsync({ groupId, memberId, order })
        } catch (error) {
            const msg = handleApiErrors(error);
            setSnackbar({ open: true, message: msg, severity: 'error' })
        }
    }

  return (
    <Grid size={{ xs: 12 }} mt={2}>
        <Paper
            elevation={3}
            sx={{ p: 2, border: '2px solid #1976d2' }}
        >
            <Box mb={2} mt={1}>
                <Typography 
                variant='h5' bgcolor="secondary.main" p={0.75}
                component="span" borderRadius={1.5}>زیر گروه {order}</Typography>
            </Box>
            <Box display="flex" alignItems="center">
                {Object.entries(shiftCount).map((shift, idx) => (
                    <Typography
                        key={idx}
                        variant='h6'
                        color='warning'
                        sx={{ 
                            textTransform: 'uppercase', fontWeight: 'bold', mr: 2, pl: 2,
                            borderLeft: isDark ? "2px solid white" : "2px solid gray"
                        }}>
                        {shift[0] === 'CS' ? 'شیفت ترکیبی' : shift[0] }: {shift[1]}
                    </Typography>
                ))}
            </Box>
            
            <Box
                sx={{
                    border: '2px dashed #ddd',
                    padding: 2,
                    marginTop: 2,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2
                }}
            >
                {!!members.length
                    ? members.map(member => (
                        <Box 
                            key={member.rank}
                            display="flex" 
                            bgcolor="secondary.main" alignItems="center"
                            padding={1}
                            borderRadius={1}
                            >
                                <IconButton
                                    title='حذف از زیرگروه'
                                    disabled={isPending}
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
                                                    fontWeight: 'bold', color: "whitesmoke" 
                                                }}>
                                            {member.fullName}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" mt={0} justifyContent="center">
                                        <Typography
                                            variant='body2'
                                            sx={{ 
                                                textTransform: 'uppercase', fontWeight: 'bold',
                                                color: "whitesmoke", borderRight: "2px solid whitesmoke",
                                                pr: 2
                                            }}>
                                            <Typography component="span">سمت: </Typography>
                                            <Typography component="span">{member.employment}</Typography>
                                        </Typography>
                                        <Typography
                                            variant='body2'
                                            sx={{ 
                                                textTransform: 'uppercase', fontWeight: 'bold', pl: 2, 
                                                color: "whitesmoke" 
                                            }}>
                                            <Typography component="span">سابقه: </Typography>
                                            <Typography component="span">{member.experience}</Typography>
                                        </Typography>
                                    </Box>
                                </Box>
                        </Box>
                    ))
                    : (
                        <Alert color="warning" severity="info" 
                            sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                            <Typography variant="h5">بدون عضو</Typography>
                        </Alert>
                    )
                }
            </Box>

            <Box display="flex" alignItems="center">
                {!!unassignedMembers?.length && (
                    <>
                        <Box display="flex" alignItems="center">
                            <Button variant='contained' color='info'
                                sx={{ fontSize: 20, color: "#0e0e0e", px: 5, mr: 1, mt: 1 }}
                                onClick={() => setOpen(true)}
                            >
                                <PersonAdd />
                                <Typography sx={{ ml: 1 }}>افزودن</Typography>
                            </Button>
                        </Box>

                        <MembersList
                            open={open}
                            setOpen={setOpen}
                            unassignedMembers={unassignedMembers}
                            membersLength={members.length}
                            order={order}
                            setSnackbar={setSnackbar}
                        />
                    </>
                )}

                <Box display="flex" alignItems="center">
                    <Button variant='contained' color='secondary'
                        sx={{ fontSize: 20, color: "#0e0e0e", px: 5, mr: 1, mt: 1 }}
                        onClick={() => {
                            setSubOpen(true)
                            setHandler("update")
                            setSelectedOrder(order)
                        }}
                    >
                        <Edit />
                        <Typography sx={{ ml: 1 }}>ویرایش</Typography>
                    </Button>
                </Box>

                <Box display="flex" alignItems="center">
                    <Button variant='contained' color='error'
                        sx={{ fontSize: 20, color: "#0e0e0e", px: 5, mr: 1, mt: 1 }}
                        onClick={() => setModalOpen(true)}
                    >
                        <Delete />
                        <Typography sx={{ ml: 1 }}>حذف</Typography>
                    </Button>

                    <RemoveSubgroupModal
                        open={modalOpen}
                        closeHandler={() => setModalOpen(false)}
                        order={order}
                    />
                </Box>
            </Box>
        </Paper>
    </Grid>
  )
}
