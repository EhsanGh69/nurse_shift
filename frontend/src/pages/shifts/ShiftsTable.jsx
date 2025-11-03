import { useState, useEffect, useMemo, useContext, useRef } from 'react';
import { Grid, TableContainer, Table, Box, Button, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from "@mui/material/styles";
import PrintIcon from '@mui/icons-material/Print';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate, Link } from "react-router-dom"

import TablePageHeader from '../../components/shiftTable/TablePageHeader';
import { useShiftsTable, useShiftSettings } from '../../api/shiftManagement.api';
import { useYearHolidays } from '../../api/json.api';
import ShiftsContext from '../../context/ShiftsContext';
import { checkLeapYear } from '../../utils/shiftsData';
import TableDataHeader from '../../components/shiftTable/TableDataHeader';
import TableDataBody from '../../components/shiftTable/TableDataBody';
import TableDataFooter from '../../components/shiftTable/TableDataFooter';
import { printScreen, excelExport, pdfExport } from '../../utils/tableExports';
import ExcelSvg from "../../assets/excel.svg";
import TableInfos from '../../components/shiftTable/TableInfos';


export default function ShiftsTable() {
    const theme = useTheme();
    const isDownXl = useMediaQuery(theme.breakpoints.down('xl'))
    const monthDays = useMemo(() => [...Array(31).keys()].map(i => String(i + 1)))
    const weekDays = useMemo(() => ["شنبه", "یک شنبه", "دو شنبه", "سه شنبه", "چهار شنبه", "پنج شنبه", "جمعه"])
    const { shiftMonth, shiftYear, monthGrid } = useContext(ShiftsContext)
    const { tableId } = useParams()
    const navigate = useNavigate()
    const [tableData, setTableData] = useState(null)
    const [expFilename, setExpFilename] = useState(null)
    const {isLoading, data, isError, error} = useShiftsTable(tableId)
    const {isLoading: settingsLoading, data: settingsData} = useShiftSettings(tableData?.group._id)
    const [personCount, setPersonCount] = useState(null)
    const { isLoading: holidayLoading, data: holidayData } = useYearHolidays()
    const [holidaysCount, setHolydaysCount] = useState(null)
    const tableRef = useRef()

    useEffect(() => {
        if(isError && error.status === 404){
            navigate("/404", { state: { backTo: "/shifts/matron/tables" } })
        }else if(!isLoading && data){
            setTableData(data)
            setExpFilename(`${data.group.hospital}-${data.month}-${data.year}`)
        }
    }, [isLoading, data, isError, error])

    useEffect(() => {
        if(!settingsLoading && settingsData) setPersonCount(settingsData.personCount)
    }, [settingsData, settingsLoading])

    useEffect(() => {
        if(!holidayLoading && holidayData) {
            setHolydaysCount(holidayData.holidays.filter(hd => hd.month === Number(tableData?.month)).length)
        }
    }, [holidayData, holidayLoading])

    const generateMonthDays = () => {
        if(shiftMonth >= 1 && shiftMonth <= 6) return monthDays
        else if (shiftMonth >= 7 && shiftMonth <= 11) return monthDays.slice(0, 30)
        else if(shiftMonth === 12){
            if(checkLeapYear(shiftYear)) return monthDays.slice(0, 29)
            else return monthDays.slice(0, 30)
        }
    }

    const generateMonthWeekDays = () => {
        const monthWeeks = []
        monthGrid.forEach(mgs => {
            mgs.forEach((mg, mgIdx) => {
                weekDays.forEach((wd, wdIdx) => {
                    if(mg && mgIdx === wdIdx) monthWeeks.push(wd)
                })
            })
        })
        return monthWeeks
    }

    const getFridaysCount = () => {
        let countOfFridays = 0
        monthGrid.forEach(mgs => {
            mgs.forEach((mg, mgIdx) => {
                if(mg && mgIdx === 6) countOfFridays++
            })
        })
        return countOfFridays
    }

    const getTotalPromotions = () => {
        const totalPromotions = {totalNPOp: 0, totalPO: 0, totalNPOv: 0, totalPOv: 0}
        tableData?.rows.forEach(dr => {
            totalPromotions.totalNPOp += dr.nonPromotionOperation
            totalPromotions.totalPO += dr.promotionOperation
            totalPromotions.totalNPOv += dr.nonPromotionOvertime
            totalPromotions.totalPOv += dr.promotionOvertime
        })
        return totalPromotions
    }

    document.body.style.backgroundColor = "#bbb"

  return (
    <Box>
        {expFilename && (
            <Box mt={2} display="flex" justifyContent="center">
                <Button 
                    variant='contained' 
                    color='info'
                    sx={{ mr: 1, display: isDownXl ? "none" : "inherit" }}
                    onClick={() => printScreen(tableRef, expFilename)}
                >
                    <PrintIcon sx={{ mr: 1 }} />
                    <Typography component="span" sx={{ mr: 1 }}>چاپ</Typography>
                </Button>
                <Button 
                    variant='contained' 
                    sx={{ mr: 1 }}
                    color='error'
                    onClick={() => pdfExport(
                        generateMonthDays(),
                        generateMonthWeekDays(),
                        tableData,
                        {fridays: getFridaysCount(), holidays: holidaysCount && holidaysCount, 
                        person: personCount && personCount},
                        getTotalPromotions(),
                        expFilename
                    )}
                >
                    <Typography component="span" sx={{ mr: 1 }}>خروجی</Typography> 
                    <PictureAsPdfIcon sx={{ ml: 1 }} />
                </Button>
                <Button 
                    variant='contained' 
                    color='success'
                    onClick={() => excelExport(generateMonthDays(), tableData?.rows, expFilename)}
                >
                    <Typography component="span" sx={{ mr: 1 }}>خروجی</Typography>
                    <img src={ExcelSvg} alt="excel-svg" width="30" />
                </Button>
                <Button 
                    variant='contained' 
                    color='secondary'
                    sx={{ ml: 1 }}
                    LinkComponent={Link}
                    to="/shifts/matron/tables"
                >
                    <Typography component="span" sx={{ mr: 1 }}>بازگشت</Typography>
                    <ArrowBackIcon sx={{ ml: 1 }} />
                </Button>
            </Box>
        )}
        <Box ref={tableRef}>
            {tableData && (
                <TablePageHeader 
                    groupData={tableData.group} 
                    month={tableData.month} 
                    year={tableData.year} 
                    fridaysCount={getFridaysCount()}
                    monthDaysCount={generateMonthDays().length}
                    holidaysCount={holidaysCount && holidaysCount}
                    personCount={personCount && personCount}
                />
            )}
            <Grid container mt={3} mx={1}>
                <Grid size={{ xs: 12 }}>
                    <TableContainer>
                        <Table sx={{ borderCollapse: 'collapse' }}>
                            <TableDataHeader
                                monthDays={generateMonthDays()}
                                monthWeekDays={generateMonthWeekDays()}
                            />
                            
                            {tableData && (
                                <>
                                    {tableData.rows.map((dataRow, idx) => (
                                        <TableDataBody
                                            key={idx}
                                            rowNumber={idx + 1}
                                            dataRow={dataRow}
                                            monthDays={generateMonthDays()}
                                        />
                                    ))}

                                    <TableDataFooter
                                        monthDays={generateMonthDays()}
                                        totalHourDay={tableData.totalHourDay}
                                        totalPromotions={getTotalPromotions()}
                                    />
                                </>
                            )}
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>

            <TableInfos />
        </Box>
    </Box>
  )
}