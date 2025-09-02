import { useContext, useState } from "react";
import { Box, Button, Divider, IconButton, Paper, Typography, Menu, MenuItem } from "@mui/material";
import MenuIcon  from '@mui/icons-material/Menu'
import EventBusyIcon  from '@mui/icons-material/EventBusy'
import PlaylistRemoveIcon  from '@mui/icons-material/PlaylistRemove'
import EditCalendarIcon  from '@mui/icons-material/EditCalendar'

import { useRejectedShifts } from "../../api/shiftManagement.api";
import useShiftStore from "../../store/shiftStore";
import ShiftsContext from "../../context/ShiftsContext";
import { getShiftDay } from "../../utils/shiftsData";


export default function ShiftDataBox({
  shiftData,
  setRejectModalMsg,
  setRejectModalOpen,
  setSelectedShift,
  setChangeModalOpen
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl)
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)
  const { checkHoliday } = useContext(ShiftsContext);
  const { groupId } = useShiftStore();
  const { mutateAsync: mutateRejects } = useRejectedShifts();  

  const handleRejectModal = async ({ shiftId, shiftDay }) => {
    await mutateRejects({ groupId, shiftId })
    .then((data) => {
        if (data?.rejects.length)
        setRejectModalMsg(
            <>
                <p>شیفت این پرستار را قبلا رد کرده اید</p>
                <p>آیا باز هم می خواهید رد کنید؟</p>
            </>
        );
        else setRejectModalMsg("آیا از رد کردن شیفت این پرستار اطمینان دارید؟");
    })
    setRejectModalOpen(true);
    setSelectedShift({ shiftId, shiftDay })
  };

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
                    onClick={handleMenuOpen}
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
                        onClick={() => handleRejectModal({ shiftId: user.shiftId, shiftDay: shiftData.shiftDay })}
                    >
                        <EventBusyIcon sx={{ mt: 1 }} color="error" />
                        <Typography color="error" variant="subtitle1" sx={{ mt: 1, ml: 1 }}>رد شیفت</Typography>
                    </MenuItem>
                    <MenuItem 
                        sx={{ display: 'flex' }}
                        onClick={() => {
                            setChangeModalOpen(true)
                            setSelectedShift({ 
                                shiftId: user.shiftId, 
                                shiftDay: shiftData.shiftDay, 
                                shiftUser: user.fullname
                            })
                        }}
                    >
                        <EditCalendarIcon sx={{ mt: 1 }} color="info" />
                        <Typography color="info" variant="subtitle1" sx={{ mt: 1, ml: 1 }}>تغییر شیفت</Typography>
                    </MenuItem>
                    <MenuItem sx={{ display: 'flex' }}>
                        <PlaylistRemoveIcon sx={{ mt: 1 }} color="warning" />
                        <Typography color="warning" variant="subtitle1" sx={{ mt: 1, ml: 1 }}>شیفت های رد شده</Typography>
                    </MenuItem>
                </Menu>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
