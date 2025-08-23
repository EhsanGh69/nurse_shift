import { useContext, useEffect } from "react";
import { Backdrop, Button, CircularProgress, Grid, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { CalendarMonth } from "@mui/icons-material";

import MainLayout from "../../mui/MainLayout";
import AppHeader from "../../components/AppHeader";
import ShiftCalendar from "../../components/shift/ShiftCalendar";
import ShiftSelect from "../../components/shift/ShiftSelect";
import ShiftsContext from "../../context/ShiftsContext";
import ShiftGroup from "../../components/shift/ShiftGroup";
import useShiftStore from "../../store/shiftStore";

export default function CreateShift() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { isLoading, shiftMonth, shiftYear } = useContext(ShiftsContext)
  const navigate = useNavigate()
  const { groupTitle, haveShift } = useShiftStore()
  
  useEffect(() => {
    if(haveShift) navigate('/shifts')
  }, [haveShift])

  return (
    <MainLayout title="شیفت های پرستار">
      <AppHeader />
      <Box display="none"><ShiftGroup /></Box>
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
              <Typography variant="h6">بازگشت به شیفت های من</Typography>
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
              mb={1}
              color={isDark ? "#f5f5f5" : "#1e1e1e"}
            >
              شیفت های {shiftYear}/{shiftMonth}
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
            <Typography
              variant="subtitle1"
              align="center"
              gutterBottom
              mb={5}
              color={isDark ? "#f5f5f5" : "#1e1e1e"}
            >
              <i>برای انتخاب شیفت بر روی روز مورد نظر کلیک کنید</i>
            </Typography>

            <ShiftCalendar />

            <ShiftSelect />

          </Grid>
      </Grid>
    </MainLayout>
  );
}
