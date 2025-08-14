import {useState} from 'react'
import { Modal, Box, Typography, RadioGroup, FormControlLabel, Radio, Button } from "@mui/material"

export default function GroupsModal({ groups, open, onClose, handleConfirm }) {
    const [groupId, setGroupId] = useState('')

    const handleSelectGroup = (e) => setGroupId(e.target.value);

    const handleCancel = () => {
        setGroupId('')
        onClose()
    }

  return (
    <Modal open={open} onClose={handleCancel}>
        <Box
            sx={{
                width: 500,
                bgcolor: "background.paper",
                p: 3,
                mx: 'auto',
                mt: '20vh',
                borderRadius: 2,
                boxShadow: 24,
                color: "#ddd"
            }}
        >
            <Typography variant='h6' gutterBottom>گروه خود را انتخاب کنید</Typography>

            <RadioGroup value={groupId} onChange={handleSelectGroup}>
                {groups && groups.map((group, index) => (
                    <FormControlLabel 
                        key={index} value={group._id} control={<Radio />} 
                        label={`${group.province} - ${group.county} - ${group.hospital} - ${group.department}`} 
                    />
                ))}
            </RadioGroup>

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                <Button 
                    sx={{ px: 3 }}
                    variant='contained' color='info' disabled={!groupId}
                    onClick={() => handleConfirm(groupId)}
                >تایید</Button>
                <Button variant='outlined' color='error' onClick={handleCancel}>انصراف</Button>
            </Box>
        </Box>
    </Modal>
  )
}
