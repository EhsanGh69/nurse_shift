import PrivateRoute from "../PrivateRoute";
import ShiftsProvider from "./ShiftsProvider";
import NurseShifts from "./NurseShifts";
import CreateShift from "./CreateShift";
import NurseShift from "./NurseShift";
import ShiftsManagement from "./ShiftsManagement";
import ShiftSettings from "./ShiftSettings";
import ManageNursesShifts from "./ManageNursesShifts";
import NurseDayShifts from "./NurseDayShifts";
import NursesInfos from "./NursesInfos";
import TablesArchive from "./TablesArchive";
import ShiftsTable from "./ShiftsTable";
import SubGroups from "./SubGroups";
import NurseArrangement from "./NurseArrangement";
import NurseDayArrange from "./NurseDayArrange";

const shiftRoutes = [{
    path: "/shifts", element: <PrivateRoute />, children:
        [
            { path: "", element: <ShiftsProvider><NurseShifts /></ShiftsProvider> },
            { path: "create", element: <ShiftsProvider><CreateShift /></ShiftsProvider> },
            { path: ":shiftId", element: <ShiftsProvider><NurseShift /></ShiftsProvider> },
            { path: "matron", element: <ShiftsProvider><ShiftsManagement /></ShiftsProvider> },
            { path: "matron/settings", element: <ShiftsProvider><ShiftSettings /></ShiftsProvider> },
            { path: "matron/manage", element: <ShiftsProvider><ManageNursesShifts /></ShiftsProvider> },
            { path: "matron/manage/:shiftId", element: <ShiftsProvider><NurseDayShifts /></ShiftsProvider> },
            { path: "matron/arrange", element: <ShiftsProvider><NurseArrangement /></ShiftsProvider> },
            { path: "matron/arrange/:day", element: <ShiftsProvider><NurseDayArrange /></ShiftsProvider> },
            { path: "matron/infos", element: <ShiftsProvider><NursesInfos /></ShiftsProvider> },
            { path: "matron/tables", element: <ShiftsProvider><TablesArchive /></ShiftsProvider> },
            { path: "matron/tables/:tableId", element: <ShiftsProvider><ShiftsTable /></ShiftsProvider> },
            { path: "matron/subgroups", element: <ShiftsProvider><SubGroups /></ShiftsProvider> },
        ]
}]

export default shiftRoutes;