import { useState } from "react";
import { PersonOff } from "@mui/icons-material";
import {
    Dialog, DialogTitle, DialogContent, TextField, List, ListItemButton, 
    ListItemText, Avatar, ListItemIcon, Typography
} from "@mui/material";

import { useAddSubGroupMember } from "../../api/group.api"
import useShiftStore from '../../store/shiftStore';
import handleApiErrors from '../../utils/apiErrors';


export default function MembersList({ 
    open, setOpen, unassignedMembers, membersLength, order, setSnackbar
}) {
    const [search, setSearch] = useState("")
    const { groupId } = useShiftStore()
    const { mutateAsync } = useAddSubGroupMember()

    const filteredMembers = unassignedMembers?.filter((member) =>
        member?.fullName?.toLowerCase().includes(search.toLowerCase())
    );

    const handleAddMember = async (memberId) => {
        try {
            await mutateAsync({ groupId, memberId, order, rank: membersLength + 1 })
        } catch (error) {
            const msg = handleApiErrors(error);
            setSnackbar({ open: true, message: msg, severity: 'error' })
        }finally {
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} fullWidth
            onClose={() => {
                setSearch("")
                setOpen(false)
            }}>
            <DialogTitle>انتخاب عضو</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="جستجوی عضو ..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <List sx={{ maxHeight: 300, overflowY: "auto" }}>
                    {filteredMembers?.length
                        ? filteredMembers.map(uMember => (
                            <ListItemButton sx={{ cursor: "pointer" }}
                                key={uMember.id}
                                onClick={() => handleAddMember(uMember.id)}
                            >
                                <ListItemIcon>
                                    <Avatar
                                        alt={uMember.fullName}
                                        src={uMember.avatar && `http://127.0.0.1:4000${uMember.avatar}`}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={uMember.fullName}
                                    secondary={`سمت : ${uMember.employment} | سابقه : ${uMember.experience}`}
                                />
                            </ListItemButton>
                        ))
                        : (
                            <Typography color='error' fontSize="1.2rem" fontWeight="800" display="flex">
                                <PersonOff />
                                عضوی جهت انتخاب وجود ندارد
                            </Typography>
                        )
                    }
                </List>
            </DialogContent>
        </Dialog>
    )
}
