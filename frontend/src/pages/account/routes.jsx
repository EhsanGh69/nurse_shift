import PrivateRoute from "../PrivateRoute";
import ChangePassword from "./ChangePassword";
import EditAccount from "./EditAccount";

const accountRoutes = [{
    path: "/account", element: <PrivateRoute />, children:
        [
            { path: "change_password", element: <ChangePassword /> },
            { path: "edit", element: <EditAccount /> },
        ]
}]



export default accountRoutes;