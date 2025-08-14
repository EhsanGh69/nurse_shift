import PrivateRoute from "../PrivateRoute";
import NurseShift from "./NurseShifts";
import CreateShift from "./CreateShift";

const shiftRoutes = [{
    path: "/shifts", element: <PrivateRoute />, children:
        [
            { path: "", element: <NurseShift /> },
            { path: "create", element: <CreateShift /> }
        ]
}]

export default shiftRoutes;