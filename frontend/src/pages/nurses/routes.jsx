import NurseIndex from "./NurseIndex";
import NurseHome from "./NurseHome";

const nurseRoutes = [{
    path: "/nurse", element: <NurseIndex />, children:
        [
            { path: "", element: <NurseHome /> }
        ]
}]

export default nurseRoutes;