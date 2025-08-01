import { useState, useEffect } from 'react';
import {
    Grid, Typography, Box, Accordion, AccordionSummary,
    AccordionDetails, useMediaQuery, useTheme,
} from '@mui/material';
import { ExpandMore, PersonOff, PeopleAlt, GroupAdd } from '@mui/icons-material';

import GroupMember from './GroupMember';
import { membersAccordionBox } from '../styles/globalStyles';
import { useGroupInvitees } from '../api/group.api';

function NotMember({ text }) {
    return (
        <Box
            sx={{
                mt: 2,
                backgroundColor: 'error.dark',
                p: 2,
                color: '#ddd',
                textAlign: 'center',
                borderRadius: 1,
                width: "100%"
            }}
        >
            <PersonOff />
            <Typography variant="h6">{text}</Typography>
        </Box>
    )
}

export default function GroupMembersList({ group }) {
    const [invitees, setInvitees] = useState([])
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
    const { isLoading, data } = useGroupInvitees(group._id)

    useEffect(() => {
        if (!isLoading && data)
            setInvitees(data)
    }, [isLoading, data])

    return (
        <>
            {isMobile
                ? (
                    <>
                        <Accordion
                            sx={{
                                width: '100%',
                                mt: 2, bgcolor: 'warning.light',
                                borderRadius: 1
                            }}
                            defaultExpanded
                        >
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Box display="flex" alignItems="center">
                                    <GroupAdd sx={{ color: "whitesmoke" }} />
                                    <Typography fontSize="22px" color="whitesmoke" ml={1}>
                                        دعوت شدگان
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={membersAccordionBox}>
                                    {invitees.length
                                        ? invitees.map(member => (
                                            <GroupMember member={member} key={member.mobile} />
                                        ))
                                        : <NotMember text="دعوت شده ایی وجود ندارد" />
                                    }
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion
                            sx={{
                                width: '100%',
                                mt: 2, bgcolor: "secondary.main",
                                borderRadius: 1
                            }}
                            defaultExpanded
                        >
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Box display="flex" alignItems="center">
                                    <PeopleAlt sx={{ color: "whitesmoke" }} />
                                    <Typography fontSize="22px" color="whitesmoke" ml={1}>
                                        اعضاء
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={membersAccordionBox}>
                                    {group?.members?.length
                                        ? group?.members?.map(member => (
                                            <GroupMember member={member} key={member.mobile} />
                                        ))
                                        : <NotMember text="این گروه عضوی ندارد" />
                                    }
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </>
                )
                : (
                    <Grid container width="100%" spacing={2}>
                        <Grid
                            size={{ md: 6 }} mt={2}
                            bgcolor="warning.light" p={2} borderRadius={1}
                        >
                            <Box display="flex" alignItems="center">
                                <GroupAdd sx={{ color: "whitesmoke" }} />
                                <Typography fontSize="22px" color="whitesmoke" ml={1}>
                                    دعوت شدگان
                                </Typography>
                            </Box>
                            <Box mt={2} sx={{
                                maxHeight: 300,
                                overflowY: 'auto',
                                overflowX: 'hidden',
                            }}>
                                {invitees.length
                                    ? invitees.map(member => (
                                        <GroupMember member={member} key={member.mobile} />
                                    ))
                                    : <NotMember text="دعوت شده ایی وجود ندارد" />
                                }
                            </Box>
                        </Grid>
                        <Grid
                            size={{ md: 6 }} textAlign="center" mt={2}
                            bgcolor="secondary.main" p={2} borderRadius={1}
                        >
                            <Box display="flex" alignItems="center">
                                <PeopleAlt sx={{ color: "whitesmoke" }} />
                                <Typography fontSize="22px" color="whitesmoke" ml={1}>
                                    اعضاء
                                </Typography>
                            </Box>
                            <Box mt={2} sx={{
                                maxHeight: 300,
                                overflowY: 'auto',
                                overflowX: 'hidden',
                            }}
                            >
                                {group?.members?.length
                                    ? group?.members?.map(member => (
                                        <GroupMember member={member} key={member.mobile} />
                                    ))
                                    : <NotMember text="این گروه عضوی ندارد" />
                                }
                            </Box>
                        </Grid>
                    </Grid>
                )
            }
        </>
    )
}
