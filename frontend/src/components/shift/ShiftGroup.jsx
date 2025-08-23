import { useContext, useEffect, useState } from 'react';
import { Grid, MenuItem, TextField, Typography } from '@mui/material'
import { useTheme } from "@mui/material/styles";

import { textFieldStyle } from '../../styles/globalStyles';
import ShiftsContext from '../../context/ShiftsContext';
import useShiftStore from '../../store/shiftStore';

export default function ShiftGroup() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [groups, setGroups] = useState(null)
    const [loading, setLoading] = useState(false)
    const [groupId, setGroupId] = useState(null)
    const { userGroups } = useContext(ShiftsContext)
    const { groupId: storedGroupId } = useShiftStore()

    useEffect(() => {
        setLoading(true)
        if(userGroups) {
            setGroups(userGroups)
            setGroupId(storedGroupId)
            setLoading(false)
        }
    }, [userGroups])

    useEffect(() => {
        if(groupId && groups) {
            const shiftGroup = groups.find(group => group._id === groupId)
            useShiftStore.getState().setParams({
                groupId,
                groupTitle: `${shiftGroup.province}-${shiftGroup.county} | ${shiftGroup.hospital}-${shiftGroup.department}`
            })
        }
    }, [groupId, groups])

    return (
        <Grid size={{ xs: 12 }} my={2}>
            {!groupId && (
                <Typography fontSize="1.3rem" color='error' mb={1}>
                    لطفا گروه خود را انتخاب نمایید
                </Typography>
            )}
            <TextField
                select
                label="انتخاب گروه"
                value={groupId ? groupId : ""}
                onChange={(e) => setGroupId(e.target.value)}
                sx={{
                    mb: 2, ...textFieldStyle(isDark),
                    width: { xs: "100%", sm: "70%", md: "50%", lg: "45%" }
                }}
            >
                {loading && <MenuItem value="">در حال دریافت گروه ها ...</MenuItem>}
                {groups && groups.map(group => (
                    <MenuItem key={group._id} value={group._id}>
                        {group.province}-{group.county} | {group.hospital}-{group.department}
                    </MenuItem>
                ))}
            </TextField>
        </Grid>
    )
}
