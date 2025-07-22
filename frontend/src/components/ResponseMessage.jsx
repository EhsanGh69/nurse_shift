import { useState } from 'react'
import { Paper, InputBase, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import { useResponseMessage } from '../api/message.api';


export default function ResponseMessage({ contactId }) {
    const [text, setText] = useState("");
    const { isPending, mutateAsync } = useResponseMessage(contactId)

    const handleSendMsg = async () => {
        try {
            if (text)
                await mutateAsync({ content: text })
        } 
        catch (error) {}
        finally{ setText("") }
    }

    return (
        <Paper
            elevation={3}
            sx={{
                display: "flex",
                alignItems: "center",
                p: 1,
                borderRadius: 3,
                bgcolor: "#f9f9f9",
            }}
        >
            <IconButton color="primary" disabled={text && !isPending ? false : true}
                onClick={handleSendMsg}
            >
                <SendIcon />
            </IconButton>

            <InputBase
                placeholder="پیام خود را بنویسید ..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                multiline
                fullWidth
                sx={{ px: 1, py: 2 }}
            />
        </Paper>
    )
}
