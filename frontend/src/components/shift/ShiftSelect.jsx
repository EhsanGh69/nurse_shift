import { Check, Close, EventAvailable } from "@mui/icons-material";
import { Box, Collapse, Grid, IconButton, Paper, Typography } from "@mui/material";

import { shiftDays } from "../../constants/shifts";


export default function ShiftSelect({ 
    collapseOpen, setCollapseOpen, shiftYear, shiftMonth, selectedDay, checkHoliday, getSelectedShiftDay,
    selectedShifts, setSelectedShifts
}) {

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

  return (
    <Collapse in={collapseOpen} sx={{ mt: 2 }}>
      <Paper sx={{ p: 2 }}>
        <IconButton
          size="small"
          onClick={() => setCollapseOpen(false)}
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
            {checkHoliday(selectedDay) &&
              `تعطیل - ${checkHoliday(selectedDay).title}`}
          </Typography>
        </Box>

        <Box width="100%" mb={1.5}>
          <Typography variant="body1" fontWeight={700} color="info">
            M: صبح | E: عصر | N: شب | V: مرخصی | H: تعطیل
          </Typography>
        </Box>

        <Grid container>
          {shiftDays.map((shiftDay) => {
            const isChecked = getSelectedShiftDay(selectedDay) === shiftDay;
            const isOffOrV = shiftDay === "OFF" || shiftDay === "V";
            const notHolidayInclude =
              !checkHoliday(selectedDay) && shiftDay.includes("H");
            const holidayNotInclude =
              checkHoliday(selectedDay) && !shiftDay.includes("H");

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
  );
}
