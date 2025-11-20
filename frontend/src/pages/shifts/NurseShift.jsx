import { useContext, useEffect, useState } from "react";
import { Backdrop, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CalendarMonth } from "@mui/icons-material";

import MainLayout from "../../mui/MainLayout";
import AppHeader from "../../components/AppHeader";
import ShiftCalendar from "../../components/shift/ShiftCalendar";
import ShiftSelect from "../../components/shift/ShiftSelect";
import ShiftsContext from "../../context/ShiftsContext";
import { useUserShift, useShiftExpire, useDayLimit } from "../../api/shift.api";
import useShiftStore from "../../store/shiftStore";

export default function NurseShift() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const { setUserShift, userShift, setPrevDesc } = useContext(ShiftsContext)
    const navigate = useNavigate()
    const { shiftId } = useParams()
    const { isLoading, data, isError, error } = useUserShift(shiftId)
    const { mutate: mutateExpire } = useShiftExpire()
    const [shiftLimit, setShiftLimit] = useState(null)
    const { groupTitle, groupId } = useShiftStore()
    const { isLoading: limitLoading, data: limitData } = useDayLimit(groupId)

    useEffect(() => {
        if(!isLoading && isError && error.status === 404)
            navigate('/404', { state: { backTo: "/shifts" } })
        else if(!isLoading && data)
            setUserShift(data)
    }, [isLoading, data, isError, error])

    useEffect(() => {
    if(!limitLoading && limitData)
        setShiftLimit(limitData)
  }, [limitLoading, limitData])

    useEffect(() => {
        if(userShift && !userShift?.expired) {
            mutateExpire(userShift?._id)
            setPrevDesc(userShift?.description)
        }
    }, [userShift])

    return (
        <MainLayout title="شیفت پرستار">
            <AppHeader />
            <Grid container width="100%">
                <Grid size={{ xs: 12 }}>
                <Button
                    color="success"
                    variant="contained"
                    sx={{ mb: 2 }}
                    LinkComponent={Link}
                    size="large"
                    to="/shifts"
                >
                    <CalendarMonth sx={{ mr: 1 }} />
                    <Typography variant="h6">بازگشت به شیفت ها</Typography>
                </Button>
                </Grid>
                <Grid size={{ xs: 12, md: 10, lg: 8 }} mx="auto">
                    <Backdrop
                        open={isLoading}
                        sx={{ zIndex: (them) => them.zIndex.drawer + 1 }}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>

                    <Typography
                        variant="h5"
                        align="center"
                        gutterBottom
                        mb={2}
                        color={isDark ? "#f5f5f5" : "#1e1e1e"}
                    >
                        شیفت های {userShift?.year}/{userShift?.month}
                    </Typography>
                    <Typography
                        variant="h6"
                        align="center"
                        gutterBottom
                        mb={1}
                        color="info"
                        >
                        گروه : {' '}{groupTitle}
                    </Typography>
                    {userShift?.temporal && (
                        <>
                            <Typography
                            variant="subtitle1"
                            align="center"
                            gutterBottom
                            color={isDark ? "#f5f5f5" : "#1e1e1e"}
                            >
                            برای انتخاب شیفت بر روی روز مورد نظر کلیک کنید
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                align="center"
                                gutterBottom
                                mb={5}
                                color="warning"
                            >
                                {shiftLimit && <b>آخرین مهلت ارسال شیفت ها {shiftLimit.dayLimit} ام ماه جاری می باشد</b>}
                            </Typography>
                        </>
                    )}
                    
                    <ShiftCalendar />

                    <ShiftSelect />
                </Grid>
            </Grid>
        </MainLayout>
    )
}
