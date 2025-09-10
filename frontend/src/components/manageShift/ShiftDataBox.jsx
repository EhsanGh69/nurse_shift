import { useContext, useState } from "react";
import { Box, Divider, IconButton, Paper, Typography, Menu, MenuItem } from "@mui/material";
import MenuIcon  from '@mui/icons-material/Menu'
import EventBusyIcon  from '@mui/icons-material/EventBusy'
import EditCalendarIcon  from '@mui/icons-material/EditCalendar'
import NoteIcon  from '@mui/icons-material/Note'

import ShiftsContext from "../../context/ShiftsContext";
import { getShiftDay } from "../../utils/shiftsData";


export default function ShiftDataBox({
  shiftData,
  setRejectModalOpen,
  handleSelectShift,
  setChangeModalOpen,
  setDescModalOpen
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl)
  const [activeUser, setActiveUser] = useState(null);
  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget)
    setActiveUser(user)
  }
  const handleMenuClose = () => setAnchorEl(null)
  const { checkHoliday } = useContext(ShiftsContext);

  return (
    <Paper elevation={3} sx={{ p: 2, border: "2px solid #1976d2", mt: 1 }}>
        <Typography
          component="p"
          variant="h6"
          color={!!checkHoliday(getShiftDay(shiftData.shiftDay)[1]) && "error"}
          sx={{ textTransform: "uppercase", fontWeight: "bold" }}
        >
          {getShiftDay(shiftData.shiftDay)[0]}
        </Typography>

      <Box
        sx={{
          border: "2px dashed #ddd",
          padding: 1,
          marginTop: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 1
        }}
      >
        {shiftData.users.map((user, idx) => (
          <Box
            key={idx}
            sx={{
              border: "1px solid #cfaeaeff",
              borderRadius: 2,
              padding: 1,
              backgroundColor: "#f0f8ff",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Typography 
                sx={{ fontWeight: "bold", color: "#726d6dff" }}
            >
              {user.fullname}
            </Typography>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ backgroundColor: "#000" }}
            />
            <Box>
                <IconButton
                    sx={{
                        color: "info.main",
                        bgcolor: "#f0f0f0"
                    }}
                    onClick={(e) => handleMenuOpen(e, user)}
                >
                    <MenuIcon sx={{ fontSize: 35 }} />
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={menuOpen}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <MenuItem 
                        sx={{ display: 'flex' }} 
                        onClick={() => {
                          handleSelectShift({ 
                            shiftId: activeUser?.shiftId, 
                            shiftDay: shiftData.shiftDay, 
                            shiftUser: activeUser?.fullname 
                          })
                          setRejectModalOpen(true)
                        }}
                    >
                        <EventBusyIcon sx={{ mt: 1 }} color="error" />
                        <Typography color="error" variant="subtitle1" sx={{ mt: 1, ml: 1 }}>رد شیفت</Typography>
                    </MenuItem>
                    <MenuItem 
                        sx={{ display: 'flex' }}
                        onClick={() => {
                            handleSelectShift({ 
                                shiftId: activeUser?.shiftId, 
                                shiftDay: shiftData.shiftDay, 
                                shiftUser: activeUser?.fullname
                            })
                            setChangeModalOpen(true)
                        }}
                    >
                        <EditCalendarIcon sx={{ mt: 1 }} color="info" />
                        <Typography color="info" variant="subtitle1" sx={{ mt: 1, ml: 1 }}>تغییر شیفت</Typography>
                    </MenuItem>
                    <MenuItem 
                      sx={{ display: 'flex' }}
                      onClick={() => {
                        handleSelectShift({ 
                          shiftId: activeUser?.shiftId, 
                          shiftDay: shiftData.shiftDay, 
                          shiftUser: activeUser?.fullname
                        })
                        setDescModalOpen(true)
                      }}
                    >
                        <NoteIcon sx={{ mt: 1 }} color="warning" />
                        <Typography color="warning" variant="subtitle1" sx={{ mt: 1, ml: 1 }}>توضیحات پرستار</Typography>
                    </MenuItem>
                </Menu>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
