import { useState } from "react"
import { IconButton, Box, Typography, FormHelperText } from "@mui/material";
import { Upload, Delete } from '@mui/icons-material';

import { useRemoveAvatar } from '../api/account.api';


export default function FileInput({ name, setFieldValue, formats, helper, error, user }) {
    const [filename, setFilename] = useState(null)
    const { mutateAsync } = useRemoveAvatar()

    const handleSelectedFile = (event) => {
        const file = event.currentTarget.files[0]
        setFieldValue(name, file)
        setFilename(file.name)
    }

    const handleRemoveAvatar = async () => {
        try {
            await mutateAsync()
        } catch (error) {}
    }

    return (
        <Box mb={2}
            sx={{
                border: 1,
                borderRadius: 2,
                borderColor: error ? "error.main" : "#aaa"
            }}
            p={1}
        >
            <input
                id="avatar"
                type="file"
                name={name}
                style={{ display: 'none' }}
                accept={formats}
                onChange={handleSelectedFile}
            />
            <label htmlFor="avatar">
                <IconButton component="span" color="primary">
                    <Typography>انتخاب تصویر پروفایل</Typography>
                    <Upload />
                </IconButton>
            </label>

            {filename && (
                <Typography variant="subtitle2">
                    فایل انتخاب شده: <strong>{filename}</strong>
                </Typography>
            )}
            
            <IconButton 
                component="span" 
                color="error" 
                sx={{ display: user.avatar ? '' : 'none' }}
                onClick={handleRemoveAvatar}
            >
                <Typography>حذف تصویر کنونی</Typography>
                <Delete />
            </IconButton>

            <FormHelperText error={!!error} sx={{ fontSize: 15 }}>
                {error || helper}
            </FormHelperText>
        </Box>
    )
}
