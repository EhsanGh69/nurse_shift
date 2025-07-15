import BaseRoute from "../BaseRoute";
import MatronRegister from "./MatronRegister";
import NurseRegister from "./NurseRegister";
import Login from "./Login";


const authRoutes = [
    { path: "/register/matron", element: <BaseRoute><MatronRegister /></BaseRoute> },
    { path: "/register/nurse", element: <BaseRoute><NurseRegister /></BaseRoute> },
    { path: "/login", element: <BaseRoute><Login /></BaseRoute> },
]

export default authRoutes;