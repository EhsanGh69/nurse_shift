import { Box, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import { clickBox } from '../../styles/globalStyles';

export default function TableDateBox({ table }) {
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
            to={`/shifts/matron/tables/${table._id}`}
        >
            <Box sx={{ mb: 1 }} display="flex" alignItems="center">
                <Typography variant='h6' ml={1}>
                    {`${table.year}/${table.month}`}
                </Typography>
            </Box>
        </Box>
    </Grid>
  )
}
