import { useState, useEffect, useCallback } from 'react'
import AppHeader from '../../components/AppHeader'
import { Alert, Button, Grid, Typography } from '@mui/material'
import { useTheme } from "@mui/material/styles";
import { PermContactCalendar } from '@mui/icons-material'
import { Link } from 'react-router-dom'

import MainLayout from '../../mui/MainLayout'
import ShiftGroup from '../../components/shift/ShiftGroup'
import useShiftStore from '../../store/shiftStore';
import { useGroupDetails, useSetMaxShifts, useMaxShifts } from '../../api/group.api'
import SnackAlert from '../../components/SnackAlert';
import handleApiErrors from '../../utils/apiErrors';
import MaxShiftsMember from '../../components/manageShift/MaxShiftsMember';

export default function SubGroups() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const { groupId } = useShiftStore()
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const { isLoading: groupLoading, data: groupData } = useGroupDetails(groupId)
    const { isLoading: maxLoading, data: maxData } = useMaxShifts(groupId)
    const { mutateAsync } = useSetMaxShifts()
    const [groupMembers, setGroupMembers] = useState(null)
    const [maxShifts, setMaxShifts] = useState(null)
    const [usersMaxCount, setUsersMaxCount] = useState({})
    const [usersMutable, setUsersMutable] = useState({})
    const [resetMax, setResetMax] = useState(false)

    useEffect(() => {
        if (!groupLoading && groupData)
            setGroupMembers(groupData.members)
    }, [groupLoading, groupData])

    useEffect(() => {
        if (!maxLoading && maxData)
            setMaxShifts(maxData.members)
    }, [maxLoading, maxData])

    const setInitialMaxCounts = useCallback(() => {
        const maxUsers = {}
        const mutableUsers = {}
        groupMembers.forEach(member => {
            const userMax = maxShifts?.find(maxMember => maxMember.user === member._id)
            maxUsers[member._id] = userMax ? { ...userMax.maxCounts } : { M: 0, E: 0, N: 0, CS: 0 }
            mutableUsers[member._id] = userMax ? userMax.isMutable : true
        })
        setUsersMaxCount(maxUsers)
        setUsersMutable(mutableUsers)
    }, [groupMembers, maxShifts])

    useEffect(() => {
        if (groupMembers?.length && maxShifts) {
            setInitialMaxCounts()
        }
    }, [setInitialMaxCounts])

    useEffect(() => {
        if (resetMax) {
            setInitialMaxCounts()
            setResetMax(false)
        }
    }, [resetMax])

    const handleSetMaxShifts = async (memberId) => {
        try {
            await mutateAsync({ memberId, groupId, isMutable: usersMutable[memberId], maxCounts: usersMaxCount[memberId] })
            setSnackbar({ open: true, message: 'تغییرات با موفقیت ذخیره شد', severity: 'success' })
        } catch (error) {
            const msg = handleApiErrors(error);
            setSnackbar({ open: true, message: msg, severity: 'error' })
            setResetMax(true)
        }
    }


    const changeMaxCount = (memberId, shiftItem, value) => {
        setUsersMaxCount(prev => ({
            ...prev,
            [memberId]: { ...prev[memberId], [shiftItem]: value }
        }))
    }

    const changeMutable = (memberId, checked) => {
        setUsersMutable(prev => ({
            ...prev,
            [memberId]: checked
        }))
        if (!checked) {
            setUsersMaxCount(prev => ({
                ...prev,
                [memberId]: { M: 0, E: 0, N: 0, CS: 0 }
            }))
        } else setInitialMaxCounts()
    }


    return (
        <MainLayout title="زیر گروه ها">
            <AppHeader />
            <Grid container width="100%">
                <Grid size={{ xs: 12 }}>
                    <Button
                        color="info"
                        variant="contained"
                        sx={{ mb: 2 }}
                        LinkComponent={Link}
                        size="large"
                        to="/shifts/matron"
                    >
                        <PermContactCalendar sx={{ mr: 1 }} />
                        <Typography variant="h6">بازگشت به مدیریت شیفت ها</Typography>
                    </Button>
                </Grid>

                <ShiftGroup />

                {groupMembers?.length && Object.values(usersMaxCount).length
                    ? (
                        <>
                            <Grid size={{ xs: 12 }}>
                                <Typography
                                    variant='h4' align='center' gutterBottom
                                    sx={{ color: isDark ? '#f5f5f5' : '#1e1e1e' }}
                                >
                                    حداکثر شیفت ها
                                </Typography>
                            </Grid>
                            {groupMembers.map(member => (
                                <MaxShiftsMember
                                    key={member._id}
                                    member={member}
                                    userMaxCount={usersMaxCount[member._id]}
                                    userMutable={usersMutable[member._id]}
                                    changeMaxCount={changeMaxCount}
                                    changeMutable={changeMutable}
                                    setResetMax={setResetMax}
                                    handleSetMaxShifts={handleSetMaxShifts}
                                />
                            ))}
                        </>
                    ): (
                        <Grid size={{ xs: 12 }}>
                            <Alert color="error" severity="error" sx={{ display: "flex", justifyContent: "center" }}>
                                <Typography variant="h5">هیچ عضوی وجود ندارد</Typography>
                            </Alert>
                        </Grid>
                    )
                }
                <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
            </Grid>
        </MainLayout>
    )
}