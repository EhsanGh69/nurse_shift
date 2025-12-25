import { lazy } from "react"

import LazyWrapper from "../../components/LazyWrapper";
import PrivateRoute from "../PrivateRoute";
import ShiftsProvider from "./ShiftsProvider";

const NurseShifts = lazy(() => import("./NurseShifts"))
const CreateShift = lazy(() => import("./CreateShift"))
const NurseShift = lazy(() => import("./NurseShift"))
const ShiftsManagement = lazy(() => import("./ShiftsManagement"))
const ShiftSettings = lazy(() => import("./ShiftSettings"))
const ManageNursesShifts = lazy(() => import("./ManageNursesShifts"))
const NurseDayShifts = lazy(() => import("./NurseDayShifts"))
const NursesInfos = lazy(() => import("./NursesInfos"))
const TablesArchive = lazy(() => import("./TablesArchive"))
const ShiftsTable = lazy(() => import("./ShiftsTable"))
const ManageMaxShifts = lazy(() => import("./ManageMaxShifts"))
const NurseArrangement = lazy(() => import("./NurseArrangement"))
const NurseDayArrange = lazy(() => import("./NurseDayArrange"))

const shiftRoutes = [{
    path: "/shifts", element: <PrivateRoute />, children:
        [
            { path: "", 
                element: (
                    <LazyWrapper>
                        <ShiftsProvider><NurseShifts /></ShiftsProvider>
                    </LazyWrapper>
                ) 
            },
            { path: "create", 
                element: (
                    <LazyWrapper>
                        <ShiftsProvider><CreateShift /></ShiftsProvider>
                    </LazyWrapper>
                ) 
            },
            { path: ":shiftId", 
                element: (
                    <LazyWrapper>
                        <ShiftsProvider><NurseShift /></ShiftsProvider>
                    </LazyWrapper>
                ) 
            },
            { path: "matron", 
                element: (
                    <LazyWrapper>
                        <ShiftsProvider><ShiftsManagement /></ShiftsProvider>
                    </LazyWrapper>
                ) 
            },
            { path: "matron/settings", 
                element: (
                    <LazyWrapper>
                        <ShiftsProvider><ShiftSettings /></ShiftsProvider>
                    </LazyWrapper>
                ) 
            },
            { path: "matron/manage", 
                element: (
                    <LazyWrapper>
                        <ShiftsProvider><ManageNursesShifts /></ShiftsProvider>
                    </LazyWrapper>
                ) 
            },
            { path: "matron/manage/:shiftId", 
                element: (
                    <LazyWrapper>
                        <ShiftsProvider><NurseDayShifts /></ShiftsProvider>
                    </LazyWrapper>
                ) 
            },
            { path: "matron/arrange", 
                element: (
                    <LazyWrapper>
                        <ShiftsProvider><NurseArrangement /></ShiftsProvider>
                    </LazyWrapper>
                ) 
            },
            { path: "matron/arrange/:day", 
                element: <ShiftsProvider><NurseDayArrange /></ShiftsProvider> },
            { path: "matron/infos", 
                element: (
                    <LazyWrapper>
                        <ShiftsProvider><NursesInfos /></ShiftsProvider>
                    </LazyWrapper>
                ) 
            },
            { path: "matron/tables", 
                element: (
                    <LazyWrapper>
                        <ShiftsProvider><TablesArchive /></ShiftsProvider>
                    </LazyWrapper>
                ) 
            },
            { path: "matron/tables/:tableId", 
                element: (
                    <LazyWrapper>
                        <ShiftsProvider><ShiftsTable /></ShiftsProvider>
                    </LazyWrapper>
                ) 
            },
            { path: "matron/manage/max", 
                element: (
                    <LazyWrapper>
                        <ShiftsProvider><ManageMaxShifts /></ShiftsProvider>
                    </LazyWrapper>
                ) 
            },
        ]
}]

export default shiftRoutes;