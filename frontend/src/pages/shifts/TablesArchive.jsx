import { useState, useEffect, useContext } from "react";
import { 
    Grid, Typography, CircularProgress, Backdrop, Alert, Button
} from '@mui/material';

import { EditCalendar, EventBusy, PermContactCalendar } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';
import { useShiftsTables, useRefreshShiftsTables } from "../../api/shiftManagement.api";
import ShiftsFilter from "../../components/shift/ShiftsFilter";
import ShiftGroup from "../../components/shift/ShiftGroup";
import useShiftStore from '../../store/shiftStore';
import ShiftsContext from "../../context/ShiftsContext";
import handleApiErrors from "../../utils/apiErrors";
import SnackAlert from "../../components/SnackAlert";
import TableDateBox from "../../components/shiftTable/TableDateBox";


export default function TablesArchive() {
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const { shiftYear } = useContext(ShiftsContext)
    const [shiftsTables, setShiftsTables] = useState(null)
    const [selectedYear, setSelectedYear] = useState(shiftYear)
    const [selectedMonth, setSelectedMonth] = useState('')
    const { groupId } = useShiftStore()
    const { data, isLoading } = useShiftsTables(groupId, selectedYear, selectedMonth)
    const { isPending, mutateAsync } = useRefreshShiftsTables()

    const handleRefreshTables = async () => {
      try {
        await mutateAsync({ groupId, month: String(selectedMonth), year: String(selectedYear) })
        setSnackbar({ open: true, message: 'جداول با موفقیت به روزرسانی شدند', severity: 'success' })
      } catch (error) {
        console.log(error)
        const msg = handleApiErrors(error);
        setSnackbar({ open: true, message: msg, severity: 'error' })
      }
    }

    useEffect(() => {
        if (data && !isLoading) setShiftsTables(data)
    }, [data, isLoading])


    return (
        <MainLayout title="آرشیو جداول">
            <AppHeader />
            <Grid container width="100%">
                <Backdrop open={isLoading} sx={{ zIndex: (them) => them.zIndex.drawer + 1 }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
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

                <ShiftsFilter
                    selectedYear={selectedYear} setSelectedYear={setSelectedYear}
                    selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}
                    shiftYear={shiftYear}
                />

                {selectedMonth && (
                  <Grid size={{ xs: 12 }}>
                    <Button
                        color="success"
                        variant="contained"
                        sx={{ mb: 2, mr: 2 }}
                        size="large"
                        disabled={isPending}
                        onClick={handleRefreshTables}
                        >
                          <EditCalendar sx={{ mr: 1 }} />
                          <Typography variant="h6">به روز رسانی جدول ها</Typography>
                      </Button>
                  </Grid>
                )}

                {shiftsTables?.length
                    ? shiftsTables.map((sTable, index) => <TableDateBox key={index} table={sTable} />)
                    : (
                        <Alert color="error" severity="error" icon={<EventBusy fontSize="large" />}
                            sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                            <Typography variant="h5" textAlign="center">جدولی وجود ندارد</Typography>
                        </Alert>
                    )
                }
            </Grid>
            <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
        </MainLayout>
    )
}