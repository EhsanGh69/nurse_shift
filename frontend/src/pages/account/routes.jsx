import { lazy } from "react"

import LazyWrapper from "../../components/LazyWrapper";
import PrivateRoute from "../PrivateRoute";

const ChangePassword = lazy(() => import("./ChangePassword"))
const EditAccount = lazy(() => import("./EditAccount"))

const accountRoutes = [{
    path: "/account", element: <PrivateRoute />, children:
        [
            { path: "change_password", element: <LazyWrapper><ChangePassword /></LazyWrapper> },
            { path: "edit", element: <LazyWrapper><EditAccount /></LazyWrapper> },
        ]
}]



export default accountRoutes;