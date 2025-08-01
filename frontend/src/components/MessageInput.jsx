import { IconButton, InputBase, Paper } from '@mui/material'
import SendIcon from "@mui/icons-material/Send";
import { useTheme } from "@mui/material/styles";


export default function MessageInput({ handleSend, isPending, text, setText }) {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'
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
            <IconButton
                disabled={text && !isPending ? false : true}
                sx={{
                    color: "info.main",
                    bgcolor: "#f0f0f0",
                    "&.Mui-disabled": {
                        color: "#8b8686ff",
                        backgroundColor: "#eeeeee",
                        cursor: "not-allowed"
                    }
                }}
                onClick={handleSend}
            >
                <SendIcon />
            </IconButton>

            <InputBase
                placeholder="پیام خود را بنویسید ..."
                value={text}
                onChange={(e) => setText(e.target.value.trimStart())}
                multiline
                fullWidth
                sx={{
                    px: 1, py: 2, mr: 1,
                    color: isDark ? "#f5f5f5" : "#1e1e1e",
                    bgcolor: isDark ? "#2a2a2a" : "#dddddd",
                    borderRadius: 2
                }}
            />
        </Paper>
    )
}
