import { Box, Grid, Typography } from "@mui/material";
import { DateRange, EventAvailable, EventRepeat, Save, Outbox, Inbox } from "@mui/icons-material";
import { Link } from "react-router-dom";

import { clickBox } from '../../styles/globalStyles';


export default function ShiftBox({ shift }) {
    return (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Box 
                display="flex" justifyContent="space-between" alignItems="center"
                sx={{ 
                    ...clickBox, 
                    flexDirection: "column", mb: 2,
                    cursor: "pointer"
                }}
                component={Link}
                to={`/shifts/${shift._id}`}
            >
                <Box sx={{ mb: 1 }} display="flex" alignItems="center">
                    <Typography variant='h6' ml={1}>
                        {`${shift.year}/${shift.month}`}
                    </Typography>
                </Box>

                <Box sx={{ mb: 1 }} display="flex" alignItems="center">
                    {shift.temporal
                        ? (
                            <>
                                <Save fontSize="large" />
                                <Typography variant='h6' ml={1}>ذخیره شده</Typography>
                            </>
                        )
                        : !shift.expired
                            ? (
                                <>
                                    <Outbox fontSize="large" />
                                    <Typography variant='h6' ml={1}>ارسال شده</Typography>
                                </>
                            )
                            : (
                                <>
                                    <Inbox fontSize="large" />
                                    <Typography variant='h6' ml={1}>منقضی شده</Typography>
                                </>
                            )
                    }
                </Box>
            </Box>
        </Grid>
    )
}