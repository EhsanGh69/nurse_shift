import PrivateRoute from "../PrivateRoute";
import ShiftsProvider from "./ShiftsProvider";
import NurseShifts from "./NurseShifts";
import CreateShift from "./CreateShift";
import NurseShift from "./NurseShift";
import ShiftsManagement from "./ShiftsManagement";
import ShiftSettings from "./ShiftSettings";
import ManageNursesShifts from "./ManageNursesShifts";
import NursesInfos from "./NursesInfos";

const shiftRoutes = [{
    path: "/shifts", element: <PrivateRoute />, children:
        [
            { path: "", element: <ShiftsProvider><NurseShifts /></ShiftsProvider> },
            { path: "create", element: <ShiftsProvider><CreateShift /></ShiftsProvider> },
            { path: ":shiftId", element: <ShiftsProvider><NurseShift /></ShiftsProvider> },
            { path: "matron", element: <ShiftsProvider><ShiftsManagement /></ShiftsProvider> },
            { path: "matron/settings", element: <ShiftsProvider><ShiftSettings /></ShiftsProvider> },
            { path: "matron/manage", element: <ShiftsProvider><ManageNursesShifts /></ShiftsProvider> },
            { path: "matron/infos", element: <ShiftsProvider><NursesInfos /></ShiftsProvider> },
        ]
}]

export default shiftRoutes;