import MatronIndex from "./MatronIndex";
import MatronHome from "./MatronHome";

const matronRoutes = [{
    path: "/matron", element: <MatronIndex />, children:
        [
            { path: "", element: <MatronHome /> }
        ]
}]

export default matronRoutes;