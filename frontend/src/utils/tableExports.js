import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from "jspdf-autotable";
import pdfMake from "pdfmake/build/pdfmake"

import pdfFonts from "./pdfFonts";


export const printScreen = async (elRef, filename) => {
    const canvas = await html2canvas(elRef.current, {
        scale: 2,
        useCORS: true
    })

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("landscape", "px", "a3")

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
    pdf.save(`${filename}.pdf`)
}

pdfMake.vfs = pdfFonts.pdfMake.vfs
pdfMake.fonts = pdfFonts.fonts

export const pdfExport = async (monthDays=[], weekDays=[], tableData={}, counts={}, totalPromotions={}, tagname='') => {
    const infosHead = [
        "موظفی بدون ارتقاء", "موظفی باارتقاء", "تقلیل ساعت",
        "سابقه خدمت", "نوع استخدام", "سمت", "نام‌ونام‌خانوادگی",
        "ردیف"
    ].map(info => ({ text: info, style: 'tableHeader' }))

    const promotionsHead = [
        "اضافه کار باارتقاء", "اضافه کار بدون ارتقاء",
        "کارکرد ماه باارتقاء", "کارکرد ماه بدون ارتقاء"
    ].map(prom => ({ text: prom, style: 'tableHeader' }))

    const mergeMonthWeek = () => {
        const monthWeek = []
        monthDays.forEach((md, mdIdx) => {
            weekDays.forEach((wd, wdIdx) => {
                if(mdIdx === wdIdx) monthWeek.push(`${md} ${"\n"} ${wd}`)
            })
        })
        return monthWeek
    }

    const generateTableRows = () => {
        const tableRows = []
        tableData.rows.forEach((row, idx) => {
            tableRows.push([
                `${idx + 1}`, row.fullname, row.post, row.employment, row.experience,
                row.hourReduction, row.promotionDuty, row.nonPromotionDuty,
                ...monthDays.map(md => row.shiftDays[md] || "-"),
                row.nonPromotionOperation, row.promotionOperation,
                row.nonPromotionOvertime, row.promotionOvertime
            ].reverse())
        })

        return tableRows
    }

    const layoutLine = { 
        hLineWidth: () => 0.5, vLineWidth: () => 0.5, 
        hLineColor: () => '#000000',vLineColor: () => '#000000'
    }

    const docDefinition = {
        pageOrientation: 'landscape',
        pageSize: 'A3',
        content: [
            {
                columns: [
                    {
                        width: '33%',
                        table: {
                            body: [
                            ["MN", "ME", "EH", "MH", "OFF", "V"],
                            ["شب صبح", "عصر صبح", "تعطیل عصر", "تعطیل صبح", "شیفت بدون", "مرخصی"]
                            ]
                        },
                        layout: layoutLine
                    },
                    {
                        width: '33%',
                        table: {
                            body: [
                                ["تعطیل", "تعطیل غیر","شیفت چیدمان"],
                                [counts.person["MH"], counts.person["M"], "M"],
                                [counts.person["EH"], counts.person["E"], "E"],
                                [counts.person["NH"], counts.person["N"], "N"]
                            ]
                        },
                        layout: layoutLine
                    },
                    {
                        width: '33%',
                        table: {
                            body: [
                                [
                                    "روزهای تعداد غیرتعطیل","تعداد جمعه‌ها", "تعطیل تعداد رسمی",
                                    "ماه / سال", "بخش", "بیمارستان", "شهرستان", "استان"
                                ],
                                [
                                    `${monthDays.length - (counts.fridays + counts.holidays)}`,counts.fridays,
                                    counts.holidays, `${tableData.year}/${tableData.month}`,
                                    tableData.group.department,  tableData.group.hospital,
                                    tableData.group.county, tableData.group.province
                                ]
                            ]
                        },
                        layout: layoutLine
                    }
                ]
            },
            {
                text: ' ', // فاصله بین ردیف‌ها
                margin: [0, 6]
            },
            {
                table: {
                    headerRows: 1,
                    body: [
                        [
                            ...promotionsHead, 
                            ...mergeMonthWeek().reverse().map(mw => ({ text: mw, style: 'tableHeader' })), 
                            ...infosHead
                        ],
                        ...generateTableRows(),
                    ]
                },
                layout: layoutLine
            },
            {
                table: {
                    widths: [
                        20, 20, 20, 20,
                        ...[...Array(monthDays.length).keys()].map(i => 16.9), 
                        262
                    ],
                    body: [
                        [
                            ...Object.values(totalPromotions).reverse(),
                            ...Object.values(tableData.totalHourDay).slice(0, monthDays.length).reverse(),
                            { text: "شیفت ساعات کل جمع", fillColor: '#eeeeee' },
                        ]
                    ]
                },
                layout: layoutLine
            },
        ],
        styles: {
            tableHeader: {
                fillColor: '#eeeeee'
            }
        },
        defaultStyle: {
            font: 'Vazir',
            alignment: 'center',
            fontSize: 8.3
        }
    };

    pdfMake.createPdf(docDefinition).download(`${tagname}.pdf`)
}

export const excelExport = async (days=[], dataRows=[], tagname='') => {
    const workbook = new ExcelJS.Workbook()
    const workSheet = workbook.addWorksheet(tagname)

    const infoColumns = [
        {header: "ردیف", key: "row", width: 10},
        {header: "نام و نام خانوادگی", key: "fullname", width: 20},
        {header: "سمت", key: "post", width: 15},
        {header: "نوع استخدام", key: "employment", width: 15},
        {header: "سابقه خدمت", key: "experience", width: 15},
        {header: "تقلیل ساعت", key: "hourReduction", width: 15},
        {header: "موظفی با ارتقاء", key: "promotionDuty", width: 15},
        {header: "موظفی بدون ارتقاء", key: "nonPromotionDuty", width: 15}
    ]
    
    const dayColumns = days.map(day => ({
        header: day,
        key: `day_${day}`,
        width: 10
    }))
    
    const promotionColumns = [
        {header: "کارکرد ماه بدون ارتقاء", key: "nonPromotionOperation", width: 15},
        {header: "کارکرد ماه با ارتقاء", key: "promotionOperation", width: 15},
        {header: "اضافه کار بدون ارتقاء", key: "nonPromotionOvertime", width: 15},
        {header: "اضافه کار با ارتقاء", key: "promotionOvertime", width: 15}
    ]

    workSheet.columns = [...infoColumns, ...dayColumns, ...promotionColumns]

    dataRows.forEach((data, idx) => {
        const row = {
            row: idx + 1,
            fullname: data.fullname,
            post: data.post,
            employment: data.employment,
            experience: data.experience,
            hourReduction: data.hourReduction,
            promotionDuty: data.promotionDuty,
            nonPromotionDuty: data.nonPromotionDuty,
            nonPromotionOperation: data.nonPromotionOperation,
            promotionOperation: data.promotionOperation,
            nonPromotionOvertime: data.nonPromotionOvertime,
            promotionOvertime: data.promotionOvertime
        }

        days.forEach(day => {
            row[`day_${day}`] = data.shiftDays[day] || "-"
        })

        workSheet.addRow(row)
    })

    const buffer = await workbook.xlsx.writeBuffer()
    saveAs(new Blob([buffer]), `${tagname}.xlsx`)
}



