import { useState, useEffect } from "react";
import { Grid, Typography, CircularProgress, Backdrop, Button, Alert } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { PersonAdd, Group } from '@mui/icons-material';

import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';
import { useGroupDetails } from '../../api/group.api';
import GroupBox from '../../components/GroupBox'
import GroupMembersList from "../../components/GroupMembersList";


export default function GroupDetails() {
    const [group, setGroup] = useState({})
    const [loading, setLoading] = useState(false)
    const { groupId } = useParams()
    const { isLoading, data } = useGroupDetails(groupId)

    useEffect(() => {
        if (!isLoading && data)
            setGroup(data)
        setLoading(isLoading)
    }, [isLoading, data])

    return (
        <MainLayout title="سرپرستار | گروه ها">
            <AppHeader />
            <Grid container width="100%">
                <Backdrop open={loading} sx={{ zIndex: (them) => them.zIndex.drawer + 1 }}>
                    <CircularProgress color="inherit" />
                </Backdrop>

                <Grid
                    size={{ xs: 12 }}
                    display="flex"
                    justifyContent="space-between"
                    flexDirection={{ xs: "column", md: "row" }}
                >
                    <Button
                        color="primary"
                        variant="contained"
                        sx={{ mb: 2 }}
                        LinkComponent={Link}
                        to={`/matron/groups/${groupId}/invite`}
                        size="large"
                    >
                        <PersonAdd sx={{ mr: 1 }} />
                        <Typography variant="h6">دعوت عضو جدید</Typography>
                    </Button>
                    <Button
                        color="secondary"
                        variant="contained"
                        sx={{ mb: 2 }}
                        LinkComponent={Link}
                        to={`/matron/groups`}
                        size="large"
                    >
                        <Group sx={{ mr: 1 }} />
                        <Typography variant="h6">بازگشت به گروه ها</Typography>
                    </Button>
                </Grid>

                {group
                    ? (
                        <>
                            <Grid
                                display="flex"
                                justifyContent="space-around"
                                alignItems="center"
                                flexDirection={{ xs: "column", md: "row" }}
                                sx={{
                                    backgroundColor: "success.light",
                                    p: 3, color: "whitesmoke",
                                    borderRadius: 1
                                }}
                                size={{ xs: 12 }}
                            >
                                <GroupBox
                                    province={group.province} county={group.county}
                                    hospital={group.hospital} department={group.department}
                                />
                            </Grid>

                            <GroupMembersList group={group} />
                        </>
                    )
                    : (
                        <Alert color="warning" severity="warning">
                            <Typography variant="body1">اطلاعاتی جهت نمایش وجود ندارد</Typography>
                        </Alert>
                    )
                }
            </Grid>
        </MainLayout>
    )
}
