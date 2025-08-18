import PrivateRoute from "../PrivateRoute";
import ShiftsProvider from "./ShiftsProvider";
import NurseShifts from "./NurseShifts";
import CreateShift from "./CreateShift";
import NurseShift from "./NurseShift";

const shiftRoutes = [{
    path: "/shifts", element: <PrivateRoute />, children:
        [
            { path: "", element: <NurseShifts /> },
            { path: "create", element: <ShiftsProvider><CreateShift /></ShiftsProvider> },
            { path: ":shiftId", element: <ShiftsProvider><NurseShift /></ShiftsProvider> },
        ]
}]

export default shiftRoutes;