import { useState, useEffect, useRef } from "react";
import { Grid, Typography, CircularProgress, Backdrop, Button, Box } from '@mui/material';
import { QuestionAnswer } from '@mui/icons-material';
import { Link, useParams, useNavigate } from 'react-router-dom';

import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';
import { useUserMessages } from '../../api/message.api';
import ResponseMessage from "../../components/ResponseMessage";
import SingleMessage from "../../components/SingleMessage";


export default function ConversationDetail() {
    const [conversation, setConversation] = useState(null)
    const [loading, setLoading] = useState(true)
    const { isLoading, data } = useUserMessages()
    const { mobile } = useParams()
    const navigate = useNavigate()
    const bottomRef = useRef()

    useEffect(() => {
        if (data) {
            const foundConversation = data.find(item => item.contact.mobile === mobile)
            if (foundConversation)
                setConversation(foundConversation)
            else
                navigate("/404", { state: { backTo: "/messages/conversations" } })
        }
        setLoading(false)
    }, [data, isLoading])

    useEffect(() => {
        if(conversation)
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversation])

    return (
        <MainLayout title="گفت و گو های کاربر | پیام ها">
            <AppHeader />
            <Grid container width="100%">
                <Backdrop open={loading} sx={{ zIndex: (them) => them.zIndex.drawer + 1 }}>
                    <CircularProgress color="inherit" />
                </Backdrop>

                <Grid size={{ xs: 12 }}>
                    <Button
                        color="success"
                        variant="contained"
                        sx={{ mb: 2 }}
                        LinkComponent={Link}
                        size="large"
                        to="/messages/conversations"
                    >
                        <QuestionAnswer />
                        <Typography variant="h6" ml={1}>بازگشت به گفت و گوها</Typography>
                    </Button>
                </Grid>

                {conversation
                    ? (
                        <>
                            <Grid
                                mt={2}
                                mx="auto"
                                display="flex"
                                flexDirection="column"
                                size={{ xs: 12 }}
                                sx={{
                                    backgroundColor: "primary.light",
                                    p: 2, color: "whitesmoke",
                                    borderRadius: 2
                                }}
                            >
                                <Box
                                    sx={{
                                        maxHeight: 500,
                                        overflowY: 'auto',
                                        overflowX: 'hidden',
                                        scrollbarWidth: 'none',
                                        '&::-webkit-scrollbar': {
                                            display: 'none',
                                        }
                                    }}
                                >
                                    <SingleMessage conversation={conversation} />
                                    <Box ref={bottomRef}></Box>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12, lg: 8 }} mx="auto" mt={2}>
                                <ResponseMessage contactId={conversation.contact.id} />
                            </Grid>
                        </>
                    )
                    : null
                }
            </Grid>
        </MainLayout>
    )
}
