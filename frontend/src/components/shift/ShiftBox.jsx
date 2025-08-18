import { Box, Grid, Typography } from "@mui/material";
import { 
    CalendarMonth, DateRange, EventAvailable, EventRepeat, LocalHospital, LocationOn 
} from "@mui/icons-material";
import { Link } from "react-router-dom";

import { clickBox } from '../../styles/globalStyles';


export default function ShiftBox({ shift }) {
    return (
        <Grid
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            size={{ xs: 12 }}
            sx={{ 
                ...clickBox, 
                flexDirection: { xs: "column", md: "row" }, mb: 2,
                cursor: "pointer"
            }}
            component={Link}
            to={`/shifts/${shift._id}`}
        >
            <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                <LocationOn fontSize="large" />
                <Typography variant='h6' ml={1}>
                    {shift.group.province}{" - "}
                    {shift.group.county}
                </Typography>
            </Box>
            <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                <LocalHospital fontSize="large" />
                <Typography variant='h6' ml={1}>
                    {shift.group.hospital}{" - "}
                    {shift.group.department}
                </Typography>
            </Box>

            <Box sx={{ mb: 1 }} display="flex" alignItems="center">
                <CalendarMonth fontSize="large" />
                <Typography variant='h6' ml={1}>
                    {`${shift.year}/${shift.month}`}
                </Typography>
            </Box>

            <Box sx={{ mb: 1 }} display="flex" alignItems="center">
                {shift.temporal
                    ? (
                        <>
                            <DateRange fontSize="large" />
                            <Typography variant='h6' ml={1}>تکمیل نشده</Typography>
                        </>
                    )
                    : !shift.expired
                        ? (
                            <>
                                <EventAvailable fontSize="large" />
                                <Typography variant='h6' ml={1}>ارسال شده</Typography>
                            </>
                        )
                        : (
                            <>
                                <EventRepeat fontSize="large" />
                                <Typography variant='h6' ml={1}>منقضی شده</Typography>
                            </>
                        )
                }
            </Box>

        </Grid>
    )
}
