import { useState, useEffect } from 'react'
import { IconButton, Grid, Button, Typography, Box } from "@mui/material";
import { QuestionAnswer, ContactPhone, PersonRemove, PersonOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

import { useNewMessage, useUserContacts } from '../../api/message.api';
import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';
import ContactsList from '../../components/ContactsList';
import MessageInput from '../../components/MessageInput';


export default function CreateConversation() {
    const [open, setOpen] = useState(false)
    const [text, setText] = useState("")
    const [contactMobile, setContactMobile] = useState("")
    const [selectedContact, setSelectedContact] = useState(null)
    const [contacts, setContacts] = useState(null)

    const { isLoading, data } = useUserContacts()
    const { isPending, mutateAsync } = useNewMessage()
    const navigate = useNavigate()

    const handleSelect = (contact) => {
        setContactMobile(contact.mobile)
        setSelectedContact(contact);
        setOpen(false);
    };

    const handleSendMsg = async () => {
        try {
            if (text)
                await mutateAsync({ content: text, mobile: contactMobile })
        } 
        catch (error) {}
        finally{ navigate(`/messages/conversations/${contactMobile}`) }
    }

    useEffect(() => {
        if (!isLoading && data)
            setContacts(data)
    }, [isLoading, data])

    return (
        <MainLayout title="گفت و گو های کاربر | گفت و گوی جدید">
            <AppHeader />
            <Grid container width="100%">

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

                <Grid
                    display="flex" justifyContent="center" flexDirection="column"
                    size={{ xs: 12, md: 8 }} borderRadius={2}
                    bgcolor="lightsalmon" width="100%" p={5} mx="auto">
                    <Button
                        color="info"
                        variant="outlined"
                        sx={{ mb: 2 }}
                        size="large"
                        onClick={() => setOpen(true)}
                    >
                        <ContactPhone />
                        <Typography variant="h6" ml={1}>انتخاب مخاطب</Typography>
                    </Button>

                    {contacts && 
                        <ContactsList 
                            open={open} setOpen={setOpen} 
                            handleSelect={handleSelect} contacts={contacts} 
                        />
                    }

                    {selectedContact
                        ? (
                            <Box width="100%" display="flex" alignItems="center">
                                <IconButton color='error'
                                    onClick={() => setSelectedContact(null)}>
                                    <PersonRemove fontSize='large' />
                                </IconButton>
                                <Typography bgcolor="info.main" p={1} borderRadius={1} 
                                    sx={{ color: "whitesmoke", fontSize: "1.2rem" }}>
                                    {selectedContact.firstName} {selectedContact.lastName} - {selectedContact.mobile}
                                </Typography>
                            </Box>
                        )
                        : (
                            <Typography color='error' fontSize="1.2rem" fontWeight="800" display="flex">
                                <PersonOff />
                                هنوز مخاطبی انتخاب نشده
                            </Typography>
                        )
                    }
                </Grid>

                <Grid
                    mt={2}
                    mx="auto"
                    display="flex"
                    flexDirection="column"
                    size={{ xs: 12, lg: 8 }}
                >
                    <MessageInput 
                        handleSend={handleSendMsg}
                        isPending={isPending}
                        text={text} setText={setText}
                    />
                </Grid>
            </Grid>
        </MainLayout>
    )
}
