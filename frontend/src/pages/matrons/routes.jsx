import { lazy } from "react"

import LazyWrapper from "../../components/LazyWrapper";
import PrivateRoute from "../PrivateRoute";

const MatronHome = lazy(() => import("./MatronHome"))
const Groups = lazy(() => import("./Groups"))
const GroupDetails = lazy(() => import("./GroupDetails"))
const InviteMember = lazy(() => import("./InviteMember"))
const CreateGroup = lazy(() => import("./CreateGroup"))

const matronRoutes = [{
    path: "/matron", element: <PrivateRoute />, children:
        [
            { path: "", element: <LazyWrapper><MatronHome /></LazyWrapper> },
            { path: "groups", element: <LazyWrapper><Groups /></LazyWrapper> },
            { path: "groups/:groupId", element: <LazyWrapper><GroupDetails /></LazyWrapper> },
            { path: "groups/:groupId/invite", element: <LazyWrapper><InviteMember /></LazyWrapper> },
            { path: "groups/create", element: <LazyWrapper><CreateGroup /></LazyWrapper> },
        ]
}]

export default matronRoutes;