import { useState, useEffect } from "react";
import { Box, Grid, Typography } from '@mui/material'
import { Restore, CheckCircle } from '@mui/icons-material'

import { useSeenMessages } from "../api/message.api"


export default function SingleMessage({ conversation }) {
    const { mutateAsync } = useSeenMessages()

    const handleSeenMessages = async () => {
        let msgIds = []
        const unseenMessages = conversation.messages.filter(msg => !msg.fromSelf && !msg.seen)
        if(unseenMessages.length) {
            unseenMessages.map(msg => msgIds.push(msg.id))
            try {
                await mutateAsync({ ids: msgIds })
            } catch (error) {}
        }  
    }

    useEffect(() => {
        handleSeenMessages()
    }, [])

    return (
        <>
            {conversation.messages.map(message => (
                <Grid
                    width="100%" display="flex" 
                    flexDirection={message.fromSelf ? "row" : "row-reverse"}
                    key={message.id}>
                    <Box
                        display="flex" flexDirection="column" p={2}
                        sx={{ mb: 1, backgroundColor: message.fromSelf ? "info.dark" : "secondary.dark" }}
                        width={{ xs: "80%", sm: "70%", md: "50%", lg: "45%" }}
                        borderRadius={2}>
                        <Box sx={{ mb: 1 }} display="flex" alignItems="center">
                            <Typography variant='body1' ml={1}
                                sx={{ color: "lightgreen" }}>
                                {message.fromSelf
                                    ? "شما"
                                    : `${conversation.contact.firstName} ${conversation.contact.lastName}`}
                            </Typography>
                        </Box>
                        <Box
                            display="flex" flexDirection="column" key={message.id}>
                            <Typography variant='body1' ml={1}>
                                {message.content}
                            </Typography>
                            <Typography variant='subtitle1' ml={1} mt={2}
                                sx={{ color: "skyblue", display: 'flex', alignItems: "center" }}>
                                {message.fromSelf && (
                                    <>
                                        {message.seen ? <CheckCircle /> : <Restore />}
                                    </>
                                )}
                                <span style={{ marginRight: 5 }}>{message.createdAt}</span>
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            ))}
        </>
    )
}
