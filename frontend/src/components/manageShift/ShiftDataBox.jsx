import { useContext, useState } from "react";
import { Box, Divider, IconButton, Paper, Typography, Menu, MenuItem } from "@mui/material";
import MenuIcon  from '@mui/icons-material/Menu'
import LockIcon  from '@mui/icons-material/Lock'
import EventBusyIcon  from '@mui/icons-material/EventBusy'
import EditCalendarIcon  from '@mui/icons-material/EditCalendar'

import ShiftsContext from "../../context/ShiftsContext";


export default function ShiftDataBox({
  nurseShifts,
  setRejectModalOpen,
  handleSelectShift,
  setEditModalOpen
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl)
  const [activeDayShift, setActiveDayShift] = useState(null);
  const handleMenuOpen = (event, dayShift) => {
    if(!nurseShifts.temporal){
      setActiveDayShift(dayShift)
      setAnchorEl(event.currentTarget)
    }
  }
  const handleMenuClose = () => setAnchorEl(null)
  const { checkHoliday, shiftMonth, shiftYear } = useContext(ShiftsContext);

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 2, border: "2px solid #1976d2", mt: 1 }}>
        <Typography
          variant="h6"
          sx={{ textTransform: "uppercase", fontWeight: "bold" }}
        >
          شیفت های درخواست شده
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
          {nurseShifts.monthShifts.map(dayShift => (
            <Box
              key={dayShift[0]}
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
                component="p"
                variant="body1"
                color={!!checkHoliday(dayShift[0]) ? "error" : "#323131ff"}
                sx={{ fontWeight: "bold", display: "flex", flexDirection: "column", alignItems: "center" }}
              >
                <span>{dayShift[0]} / {shiftMonth} / {shiftYear}</span>
                <span>{dayShift[1]}</span>
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
                        bgcolor: "#dcd7d7ff"
                      }}
                      onClick={(e) => handleMenuOpen(e, dayShift)}
                  >
                    {nurseShifts.temporal 
                      ? <LockIcon sx={{ fontSize: 28 }} /> 
                      : <MenuIcon sx={{ fontSize: 28 }} />
                    }
                  </IconButton>

                  <Menu
                      anchorEl={anchorEl}
                      open={nurseShifts.temporal ? false : menuOpen}
                      onClose={handleMenuClose}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                  >
                      <MenuItem 
                          sx={{ display: 'flex' }} 
                          onClick={() => {
                            handleSelectShift(activeDayShift)
                            setAnchorEl(null)
                            setRejectModalOpen(true)
                          }}
                      >
                          <EventBusyIcon sx={{ mt: 1 }} color="error" />
                          <Typography color="error" variant="subtitle1" sx={{ mt: 1, ml: 1 }}>رد شیفت</Typography>
                      </MenuItem>
                      <MenuItem 
                          sx={{ display: 'flex' }}
                          onClick={() => {
                              handleSelectShift(activeDayShift)
                              setAnchorEl(null)
                              setEditModalOpen(true)
                          }}
                      >
                          <EditCalendarIcon sx={{ mt: 1 }} color="info" />
                          <Typography color="info" variant="subtitle1" sx={{ mt: 1, ml: 1 }}>تغییر شیفت</Typography>
                      </MenuItem>
                  </Menu>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
      <Paper elevation={3} sx={{ p: 2, border: "2px solid #1976d2", mt: 1 }}>
        <Typography
          variant="h6"
          sx={{ textTransform: "uppercase", fontWeight: "bold" }}
        >
          توضیحات
        </Typography>
        <Box
          sx={{
            border: "2px dashed #ddd",
            padding: 1,
            marginTop: 2
          }}
        >
          <Box
            sx={{
              border: "1px solid #cfaeaeff",
              borderRadius: 2,
              padding: 1,
              backgroundColor: "#f0f8ff",
              alignItems: "center"
            }}
          >
            <Typography
              component="p"
              variant="body1"
              color="#323131ff"
              sx={{ textTransform: "uppercase", fontWeight: "bold", width: "100%" }}
            >
              {!!nurseShifts.description ? nurseShifts.description : "بدون توضیحات"}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
