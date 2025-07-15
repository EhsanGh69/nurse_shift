import { Box, Typography } from '@mui/material';
import {  LocationOn, LocalHospital, MonitorHeart } from '@mui/icons-material';

export default function GroupBox({ province, county, hospital, department }) {
    return (
        <>
            <Box sx={{ mb: 1 }} display="flex" alignItems="center">
                <LocationOn fontSize="large" />
                <Typography variant='h6' ml={1}>
                    {province} - {county}
                </Typography>
            </Box>

            <Box sx={{ mb: 1 }} display="flex" alignItems="center">
                <LocalHospital fontSize="large" />
                <Typography variant='h6' ml={1}>
                    {hospital}
                </Typography>
            </Box>

            <Box sx={{ mb: 1 }} display="flex" alignItems="center">
                <MonitorHeart fontSize="large" />
                <Typography variant='h6' ml={1}>
                    {department}
                </Typography>
            </Box>
        </>
    )
}
