import { PersonOff } from "@mui/icons-material";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    List,
    ListItem,
    ListItemText,
    Avatar,
    ListItemIcon,
    Typography
} from "@mui/material";
import { useState } from "react";


export default function ContactsList({ open, setOpen, handleSelect, contacts }) {
    const [search, setSearch] = useState("")

    const filteredContacts = contacts.filter((c) =>
        c.firstName.toLowerCase().includes(search.toLowerCase()) ||
        c.lastName.toLowerCase().includes(search.toLowerCase()) ||
        c.mobile.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Dialog open={open}
            onClose={() => {
                setSearch("")
                setOpen(false)
            }} fullWidth>
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
                            <ListItem button sx={{ cursor: "pointer" }}
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
                            </ListItem>
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
