import { lazy } from "react"

import LazyWrapper from "../../components/LazyWrapper";
import PrivateRoute from "../PrivateRoute";

const NurseHome = lazy(() => import("./NurseHome"))

const nurseRoutes = [{
    path: "/nurse", element: <PrivateRoute />, children:
        [
            { path: "", element: <LazyWrapper><NurseHome /></LazyWrapper> }
        ]
}]

export default nurseRoutes;