import MatronIndex from "./MatronIndex";
import MatronHome from "./MatronHome";
import Groups from "./Groups";
import GroupDetails from "./GroupDetails";
import InviteMember from "./InviteMember";

const matronRoutes = [{
    path: "/matron", element: <MatronIndex />, children:
        [
            { path: "", element: <MatronHome /> },
            { path: "groups", element: <Groups /> },
            { path: "groups/:groupId", element: <GroupDetails /> },
            { path: "groups/:groupId/invite", element: <InviteMember /> },
        ]
}]

export default matronRoutes;