import { useState, useEffect, useMemo } from 'react';
import { Typography, Button, Backdrop, CircularProgress, Grid } from '@mui/material';
import { useTheme } from "@mui/material/styles";
import { PermContactCalendar } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';

import ShiftGroup from '../../components/shift/ShiftGroup';
import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';
import SnackAlert from '../../components/SnackAlert';
import useShiftStore from '../../store/shiftStore';
import { useJobInfos, useSetJobInfo } from '../../api/shiftManagement.api';
import { useGroupDetails } from '../../api/group.api';
import JobInfoBox from '../../components/manageShift/JobInfoBox';
import { jobInfoKeys } from '../../constants/shifts';
import { personCountSchema as jobInfoSchema } from '../../validations/shiftSettingsValidation';
import handleApiErrors from '../../utils/apiErrors';


export default function NursesInfos() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const fields = useMemo(() => [
        {title: "سمت", name: "post"},
        {title: "نوع استخدام", name: "employment"},
        {title: "سابقه خدمت", name: "experience"},
        {title: "تقلیل ساعت", name: "hourReduction"},
        {title: "موظفی با ارتقاء", name: "promotionDuty"},
        {title: "موظفی بدون ارتقاء", name: "nonPromotionDuty"},
    ])
    const initialInfos = useMemo(() => ({
        post: 1, employment: 1, experience: 1, hourReduction: 1, promotionDuty: 1, nonPromotionDuty: 1
    }))
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const [allInfos, setAllInfos] = useState(null)
    const [nurseInfos, setNurseInfos] = useState({})
    const [groupMembers, setGroupMembers] = useState(null)
    const [resetInfos, setResetInfos] = useState(false)
    const { groupId } = useShiftStore()
    const { isLoading: infosLoading, data: infosData } = useJobInfos(groupId)
    const { isLoading: groupLoading, data: groupData } = useGroupDetails(groupId)
    const { mutateAsync } = useSetJobInfo()

    const handleSetJobInfo = async (userId) => {
        try {
            await jobInfoSchema(jobInfoKeys).validate(nurseInfos[userId])
            await mutateAsync({ userId, groupId, ...nurseInfos[userId] })
            setSnackbar({ open: true, message: 'تغییرات با موفقیت ذخیره شد', severity: 'success' })
        } catch (error) {
            if(error instanceof Yup.ValidationError){
                setSnackbar({ open: true, message: "مقدار وارد شده نامعتبر می باشد", severity: 'error' })
            }else {
                const msg = handleApiErrors(error);
                setSnackbar({ open: true, message: msg, severity: 'error' })
            }
            setResetInfos(true)
        }
    }

    const extractInfos = (info) => {
        if(info)
            return { 
                post: info.post, employment: info.employment, 
                experience: info.experience, hourReduction: info.hourReduction, 
                promotionDuty: info.promotionDuty, nonPromotionDuty: info.nonPromotionDuty
            }
    }

    useEffect(() => {
        if(!infosLoading && infosData) setAllInfos(infosData)
    }, [infosLoading, infosData])

    useEffect(() => {
        if(groupId && !groupLoading && groupData)
            if(groupData.members.length)
                setGroupMembers([ groupData.matron, ...groupData.members ])
            else
                setGroupMembers([ groupData.matron ])
    }, [groupId, groupLoading, groupData])


    useEffect(() => {
        const handleInitialInfos = () => {
            const initialNurseInfos = {}
            groupMembers.forEach(member => {
                const foundNurse = allInfos?.find(info => info.user._id === member._id)
                if(foundNurse){
                    initialNurseInfos[member._id] = { ...extractInfos(foundNurse) }
                } 
                else initialNurseInfos[member._id] = { ...initialInfos }
            })
            setNurseInfos(initialNurseInfos)
        }
        if(groupMembers){
            handleInitialInfos()
        }
        if(groupMembers && resetInfos){
            handleInitialInfos()
        }
    }, [groupMembers, allInfos, resetInfos])


    return (
        <MainLayout title="اطلاعات پرستاران">
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

                {groupId && (
                    <>
                        <Backdrop open={infosLoading} sx={{ zIndex: (them) => them.zIndex.drawer + 1 }}>
                            <CircularProgress color="inherit" />
                        </Backdrop>
                        <Grid size={{ xs: 12 }}>
                            <Typography
                                variant='h4' align='center' gutterBottom
                                sx={{ color: isDark ? '#f5f5f5' : '#1e1e1e' }}
                            >
                                اطلاعات پرستاران
                            </Typography>
                        </Grid>

                        {!!Object.keys(nurseInfos).length && groupMembers?.map(member => (
                            <JobInfoBox
                                key={member._id}
                                member={member}
                                fields={nurseInfos[member._id] && fields}
                                nurseInfos={nurseInfos[member._id]}
                                setNurseInfos={setNurseInfos}
                                handleSetJobInfo={handleSetJobInfo}
                                onCancel={(bool) => setResetInfos(bool)}
                            />
                        ))}

                        <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
                    </>
                )}
            </Grid>
        </MainLayout>
    )
}
