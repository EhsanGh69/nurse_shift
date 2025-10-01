import { useState } from "react";
import { PersonOff } from "@mui/icons-material";
import {
    Dialog, DialogTitle, DialogContent, TextField, List, ListItemButton, 
    ListItemText, Avatar, ListItemIcon, Typography
} from "@mui/material";


export default function ContactsList({ open, setOpen, handleSelect, contacts }) {
    const [search, setSearch] = useState("")

    const filteredContacts = contacts.filter((c) =>
        c.firstName.toLowerCase().includes(search.toLowerCase()) ||
        c.lastName.toLowerCase().includes(search.toLowerCase()) ||
        c.mobile.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Dialog open={open} fullWidth
            onClose={() => {
                setSearch("")
                setOpen(false)
            }}>
            <DialogTitle>انتخاب مخاطب</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="جستجوی مخاطب ..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <List sx={{ maxHeight: 300, overflowY: "auto" }}>
                    {filteredContacts.length
                        ? filteredContacts.map((contact) => (
                            <ListItemButton button sx={{ cursor: "pointer" }}
                                key={contact._id}
                                onClick={() => handleSelect(contact)}
                            >
                                <ListItemIcon>
                                    <Avatar
                                        alt={contact.firstName}
                                        src={contact.avatar && `http://127.0.0.1:4000${contact.avatar}`}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={`${contact.firstName} ${contact.lastName}`}
                                    secondary={contact.mobile}
                                />
                            </ListItemButton>
                        ))
                        : (
                            <Typography color='error' fontSize="1.2rem" fontWeight="800" display="flex">
                                <PersonOff />
                                مخاطبی یافت نشد
                            </Typography>
                        )
                    }
                </List>
            </DialogContent>
        </Dialog>
    )
}
