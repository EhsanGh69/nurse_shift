import PrivateRoute from "../PrivateRoute";
import MatronHome from "./MatronHome";
import Groups from "./Groups";
import GroupDetails from "./GroupDetails";
import InviteMember from "./InviteMember";
import CreateGroup from "./CreateGroup";

const matronRoutes = [{
    path: "/matron", element: <PrivateRoute />, children:
        [
            { path: "", element: <MatronHome /> },
            { path: "groups", element: <Groups /> },
            { path: "groups/:groupId", element: <GroupDetails /> },
            { path: "groups/:groupId/invite", element: <InviteMember /> },
            { path: "groups/create", element: <CreateGroup /> },
        ]
}]

export default matronRoutes;