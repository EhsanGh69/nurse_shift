import ChangePassword from "./ChangePassword";
import EditAccount from "./EditAccount";

const accountRoutes = [
    { path: "/change_password", element: <ChangePassword /> },
    { path: "/edit_account", element: <EditAccount /> },
]

export default accountRoutes;