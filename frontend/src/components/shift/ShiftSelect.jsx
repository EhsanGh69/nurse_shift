import { useContext, useEffect } from "react";
import { Check, Close, EventAvailable, CancelPresentation } from "@mui/icons-material";
import { Box, Collapse, Grid, IconButton, Paper, Typography, Button } from "@mui/material";

import { shiftDays } from "../../constants/shifts";
import ShiftsContext from "../../context/ShiftsContext";


export default function ShiftSelect() {
    const { selectedDay, setSelectedDay, collapseOpen, checkHoliday, getSelectedShiftDay,
      selectedShifts, shiftYear, shiftMonth, setCollapseOpen, setSelectedShifts, setRemovedDays,
      removedDays, selectBox, userShift, weekDay
    } = useContext(ShiftsContext)

    useEffect(() => {
      if(userShift) 
        setSelectedShifts({ ...userShift?.currentShiftDays })
    }, [userShift])

    useEffect(() => {
      console.log(getSelectedShiftDay(selectedDay))
      console.log(removedDays)
    }, [selectedDay])

    const handleShiftRemove = () => {
      if (!selectedDay) return;

      const currentShift = getSelectedShiftDay(selectedDay)
      const updated = { ...selectedShifts };
      updated[currentShift] = (updated[currentShift] || []).filter((day) => day !== selectedDay);
      setSelectedShifts(updated);
      setRemovedDays(prev => [...prev, selectedDay])
    }

    const handleShiftSelect = (shift) => {
        if (!selectedDay) return;

        const currentShift = getSelectedShiftDay(selectedDay)
        const updated = { ...selectedShifts };
        if(currentShift === shift) {
          updated[shift] = (updated[shift] || []).filter((day) => day !== selectedDay);
        }else {
          shiftDays.forEach((shiftDay) => {
              updated[shiftDay] = (selectedShifts[shiftDay] || []).filter((day) => day !== selectedDay);
          });
          updated[shift] = [...updated[shift], selectedDay];
        }
        
        setSelectedShifts(updated);
    };

    const handleScrollBox = () => {
      if(selectBox.current)
        selectBox.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }

  return (
    <Box ref={selectBox}>
      <Collapse in={collapseOpen} sx={{ mt: 2 }} onEntered={handleScrollBox}>
        <Paper sx={{ p: 2 }}>
          <IconButton
            size="small"
            onClick={() => {
              setCollapseOpen(false)
              setSelectedDay(null)
            }}
            sx={{ mb: 2 }}
          >
            <Close />
          </IconButton>

          <Box width="100%" mb={1.5}>
            <Typography
              variant="body1"
              fontWeight={700}
              component="span"
              color="success"
              display="flex"
              alignItems="center"
            >
              <EventAvailable fontSize="small" sx={{ mr: 1 }} />
              {`${shiftYear}/${shiftMonth}/${selectedDay}`}
            </Typography>
            <Typography variant="body1" component="span" color="error">
              {checkHoliday(selectedDay) && `تعطیل - ${checkHoliday(selectedDay).title}`}
              {weekDay === 6 && "جمعه - تعطیل"}
            </Typography>
          </Box>

          <Box width="100%" mb={1.5}>
            <Typography variant="body1" fontWeight={700} color="info">
              M: صبح | E: عصر | N: شب | V: مرخصی | H: تعطیل
            </Typography>
          </Box>

          {(
            getSelectedShiftDay(selectedDay) || !!removedDays.length && !removedDays.includes(selectedDay)
          ) && (
            <Box width="100%" mb={1.5}>
              <Button variant="contained" color="error" onClick={handleShiftRemove}>
                <CancelPresentation />
              </Button>
            </Box>
          )}

          <Grid container>
            {shiftDays.map((shiftDay) => {
              const isEqual = userShift?.shiftDays[selectedDay] === getSelectedShiftDay(selectedDay)
              const checkUserShift = userShift?.shiftDays[selectedDay] === shiftDay
              const isChecked = !isEqual && getSelectedShiftDay(selectedDay) === shiftDay || isEqual && checkUserShift;
              const isOffOrV = shiftDay === "OFF" || shiftDay === "V";
              const notHolidayInclude =
                (!checkHoliday(selectedDay) && weekDay !== 6) && shiftDay.includes("H");
              const holidayNotInclude =
                (checkHoliday(selectedDay) || weekDay === 6) && !shiftDay.includes("H");

              return (
                <Grid key={shiftDay}>
                  <Paper
                    onClick={() => handleShiftSelect(shiftDay)}
                    sx={{
                      px: 2,
                      py: 1,
                      ml: 1,
                      mb: 1,
                      cursor: "pointer",
                      display:
                        !isOffOrV && (notHolidayInclude || holidayNotInclude)
                          ? "none"
                          : "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 2,
                      minWidth: 80,
                      backgroundColor: isChecked ? "#1976d2" : "#f0f0f0",
                      color: isChecked ? "#fff" : "#000",
                    }}
                  >
                    {isChecked && <Check />}
                    <Typography sx={{ ml: 0.5 }}>{shiftDay}</Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      </Collapse>
    </Box>
  );
}
