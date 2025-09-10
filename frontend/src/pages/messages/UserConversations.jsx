import { useState, useEffect } from "react";
import { Grid, Box, Typography, CircularProgress, Backdrop, Alert, Button, Badge } from '@mui/material';
import { AddComment, AccountCircle, PhoneAndroid, Comment, CommentsDisabled } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { clickBox } from '../../styles/globalStyles';
import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';
import { useUserMessages } from '../../api/message.api';


export default function UserConversations() {
    const [conversations, setConversations] = useState(null)
    const [loading, setLoading] = useState(false)
    const { isLoading, data } = useUserMessages()

    const getUnseenCount = (messages) => {
        let unseenCount = 0
        messages.map(msg => {
            if (!msg.fromSelf && !msg.seen)
                unseenCount += 1
        })
        return unseenCount
    }

    useEffect(() => {
        if (!isLoading && data) setConversations(data)
        setLoading(isLoading)
    }, [isLoading, data])

    return (
        <MainLayout title="گفت و گوهای کاربر">
            <AppHeader />
            <Grid container width="100%">
                <Backdrop open={loading} sx={{ zIndex: (them) => them.zIndex.drawer + 1 }}>
                    <CircularProgress color="inherit" />
                </Backdrop>

                <Button
                    color="success"
                    variant="contained"
                    sx={{ mb: 2 }}
                    LinkComponent={Link}
                    size="large"
                    to="/messages/conversations/create"
                >
                    <AddComment sx={{ mr: 1 }} />
                    <Typography variant="h6">ایجاد گفت و گوی جدید</Typography>
                </Button>

                {conversations?.length
                    ? conversations.map((conversation, index) => (
                        <Grid
                            display="flex"
                            justifyContent="space-around"
                            alignItems="center"
                            size={{ xs: 12 }}
                            key={index}
                            sx={{ ...clickBox, flexDirection: { xs: "column", md: "row" }, mb: 2 }}
                            component={Link}
                            to={`/messages/conversations/${conversation.contact.mobile}`}
                        >
                            <Box sx={{ mb: 1 }} display="flex" alignItems="center">
                                <AccountCircle fontSize="large" />
                                <Typography variant='h6' ml={1}>
                                    {conversation.contact.firstName}{" "}{conversation.contact.lastName}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 1 }} display="flex" alignItems="center">
                                <PhoneAndroid fontSize="large" />
                                <Typography variant='h6' ml={1}>
                                    {conversation.contact.mobile}
                                </Typography>
                            </Box>

                            {getUnseenCount(conversation.messages) > 0 && (
                                <Box sx={{ mb: 1 }} display="flex" alignItems="center">
                                    <Badge 
                                        badgeContent={getUnseenCount(conversation.messages)}
                                        color="error"
                                        overlap="circular"
                                    >
                                        <Comment fontSize="large" color="action" />
                                    </Badge>
                                </Box>
                            )}
                        </Grid>
                    ))
                    : (
                        <Alert color="error" severity="error" icon={<CommentsDisabled fontSize="large" />}
                            sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                            <Typography variant="h5" textAlign="center">گفت و گویی وجود ندارد</Typography>
                        </Alert>
                    )
                }
            </Grid>
        </MainLayout>
    )
}
