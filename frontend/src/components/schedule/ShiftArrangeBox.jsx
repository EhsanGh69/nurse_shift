import { useMemo, useState } from "react";
import { Box, Divider, IconButton, Paper, Typography, Menu, MenuItem } from "@mui/material";
import { Menu as MenuIcon, PermContactCalendar } from '@mui/icons-material'
import EditCalendarIcon from '@mui/icons-material/EditCalendar'


export default function ShiftArrangeBox({
    shiftsSchedule,
    handleSelectNurse,
    setEditModalOpen,
    requestedShifts
}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl)
    const [activeNurse, setActiveNurse] = useState(null);
    const shiftTypes = useMemo(() => [...Object.keys(shiftsSchedule)])
    const handleMenuOpen = (event, nurseShift) => {
        setActiveNurse(nurseShift)
        setAnchorEl(event.currentTarget)
    }
    const handleMenuClose = () => setAnchorEl(null)

    return (
        <Box>
            {shiftTypes.map(shiftType => (
                <Paper key={shiftType}
                    elevation={3} sx={{ p: 2, border: "2px solid #1976d2", mt: 1 }}>
                    <Typography
                        variant="h6"
                        sx={{ textTransform: "uppercase", fontWeight: "bold" }}
                    >
                        {shiftType}
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
                        {shiftsSchedule[shiftType].map(nurse => (
                            <Box
                                key={nurse._id}
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
                                    color="black"
                                    sx={{ fontWeight: "bold", display: "flex", flexDirection: "column", alignItems: "center" }}
                                >
                                    {nurse.firstName} {nurse.lastName}
                                </Typography>

                                <Divider
                                    orientation="vertical"
                                    flexItem
                                    sx={{ backgroundColor: "#000" }}
                                />

                                {requestedShifts[shiftType] && requestedShifts[shiftType].includes(nurse._id)
                                    ? (<Typography
                                        component="p"
                                        variant="subtitle1"
                                        color="success"
                                        title="درخواست شده"
                                        sx={{ fontSize: 18, fontWeight: 800, display: "flex", alignItems: "center" }}
                                    >
                                       <PermContactCalendar />
                                    </Typography>)
                                    : (
                                        <Box>
                                            <IconButton
                                                sx={{
                                                    color: "info.main",
                                                    bgcolor: "#dcd7d7ff"
                                                }}
                                                onClick={(e) => handleMenuOpen(e, {
                                                    nurseId: nurse._id, shiftType,
                                                    nurseName: `${nurse.firstName} ${nurse.lastName}`
                                                })}
                                            >
                                                <MenuIcon sx={{ fontSize: 28 }} />
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
                                                        handleSelectNurse(activeNurse.nurseId, activeNurse.nurseName, activeNurse.shiftType)
                                                        setAnchorEl(null)
                                                        setEditModalOpen(true)
                                                    }}
                                                >
                                                    <EditCalendarIcon sx={{ mt: 1 }} color="info" />
                                                    <Typography color="info" variant="subtitle1" sx={{ mt: 1, ml: 1 }}>تغییر شیفت</Typography>
                                                </MenuItem>
                                            </Menu>
                                        </Box>
                                    )
                                }
                            </Box>
                        ))}
                    </Box>
                </Paper>
            ))}
        </Box>
    );
}
