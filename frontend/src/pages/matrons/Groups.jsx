import { useState, useEffect } from "react";
import { Box, Grid, Typography, CircularProgress, Backdrop, Alert, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { GroupAdd, Group } from '@mui/icons-material';

import { centerBox, clickBox } from '../../styles/globalStyles';
import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';
import { getMatronGroups, refreshToken } from '../../utils/services';


export default function Groups() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(false)

  const handleMatronGroups = async () => {
    await refreshToken()
    const matronGroups = await getMatronGroups(setLoading)
    setGroups(matronGroups)
  }

  useEffect(() => {
    handleMatronGroups()
  }, [])

  return (
    <MainLayout title="سرپرستار | گروه ها">
      <Box sx={centerBox}>
        <AppHeader />
        <Grid container justifyContent='center' width="90%">
          <Backdrop open={loading} sx={{ zIndex: (them) => them.zIndex.drawer + 1 }}>
            <CircularProgress color="inherit" />
          </Backdrop>

          <Button 
            color="success" 
            variant="contained" 
            sx={{ mb: 2 }} 
            LinkComponent={Link}
            // to={item.route}
          >
            <GroupAdd sx={{ mr: 1 }} />
            <Typography variant="subtitle1">افزودن گروه جدید</Typography>
          </Button>

          {groups
            ? groups.map(group => (
              <Grid
                size={{ xs: 12 }}
                key={group._id}
                sx={clickBox}
                component={Link}
              to={`/matron/groups/${group._id}`}
              >
                <Box sx={{ mb: 1 }}>
                  <Group />
                </Box>
                <Typography variant='body1'>
                  {group.department} - {group.hospital} - {group.county}
                </Typography>
              </Grid>
            ))
            : (
              <Alert color="error" severity="error">
                <Typography variant="h3">گروهی وجود ندارد</Typography>
              </Alert>
            )
          }
        </Grid>
      </Box>
    </MainLayout>
  )
}
