import PrivateRoute from "../PrivateRoute";
import NurseHome from "./NurseHome";

const nurseRoutes = [{
    path: "/nurse", element: <PrivateRoute />, children:
        [
            { path: "", element: <NurseHome /> }
        ]
}]

export default nurseRoutes;