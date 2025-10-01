import { useState, useEffect } from 'react'
import AppHeader from '../../components/AppHeader'
import { Alert, Button, Grid, Typography } from '@mui/material'
import { PermContactCalendar, GroupAdd } from '@mui/icons-material'
import { Link } from 'react-router-dom'

import MainLayout from '../../mui/MainLayout'
import ShiftGroup from '../../components/shift/ShiftGroup'
import SubGroupBox from '../../components/manageShift/SubGroupBox'
import useShiftStore from '../../store/shiftStore';
import { useSubGroups, useSetSubGroup, useUpdateSubGroup } from '../../api/group.api'
import SnackAlert from '../../components/SnackAlert';
import SetSubgroupModal from '../../components/manageShift/SetSubgroupModal'

export default function SubGroups() {
    const [subOpen, setSubOpen] = useState(false)
    const { groupId } = useShiftStore()
    const [handler, setHandler] = useState("")
    const [selectedOrder, setSelectedOrder] = useState(null)
    const { isLoading, data } = useSubGroups(groupId)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const [subgroups, setSubgroups] = useState(null)
    const { mutateAsync: setMutate } = useSetSubGroup()
    const { mutateAsync: updateMutate } = useUpdateSubGroup()

    useEffect(() => {
        if(!isLoading && data)
            setSubgroups(data)
    }, [isLoading, data])

    const setUpdateSubgroup = async (shiftCount, order) => {
        try {
            if(handler === "set") await setMutate({ groupId, shiftCount, order })
            else await updateMutate({ groupId, shiftCount, order })
            setSnackbar({ 
                open: true, 
                message: handler === "set" ? 'زیرگروه جدید با موفقیت ایجاد شد' : 'زیرگروه با موفقیت ویرایش شد', 
                severity: 'success' 
            })
        } catch (error) {
            const msg = handleApiErrors(error);
            setSnackbar({ open: true, message: msg, severity: 'error' })
        }finally {
            setSubOpen(false)
        }
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

            <Grid size={{ xs: 12 }}>
                <Button
                    color="success"
                    variant="contained"
                    sx={{ mb: 2 }}
                    size="large"
                    onClick={() => {
                        setSubOpen(true)
                        setHandler("set")
                        setSelectedOrder(null)
                    }}
                >
                    <GroupAdd sx={{ mr: 1 }} />
                    <Typography variant="h6">افزودن زیر گروه</Typography>
                </Button>
            </Grid>

            <SetSubgroupModal
                open={subOpen}
                closeHandler={() => setSubOpen(false)}
                setSnackbar={setSnackbar}
                subsLength={subgroups?.length}
                handler={handler}
                setUpdateSubgroup={setUpdateSubgroup}
                selectedOrder={selectedOrder}
            />

            {subgroups
                ? subgroups.map(sub => (
                    <SubGroupBox 
                        key={sub.order} 
                        shiftCount={sub.shiftCount} 
                        members={sub.members} 
                        order={sub.order}
                        setSnackbar={setSnackbar}
                        setHandler={setHandler}
                        setSubOpen={setSubOpen}
                        setSelectedOrder={setSelectedOrder}
                    />
                ))
                : (
                    <Grid size={{ xs: 12 }}>
                        <Alert color="error" severity="error" sx={{ display: "flex", justifyContent: "center" }}>
                            <Typography variant="h5">زیر گروهی وجود ندارد</Typography>
                        </Alert>
                    </Grid>
                )
            }
            <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
        </Grid>
    </MainLayout>
  )
}