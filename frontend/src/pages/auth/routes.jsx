import MatronRegister from "./MatronRegister";
import NurseRegister from "./NurseRegister";
import Login from "./Login";


const authRoutes = [
    { path: "/register/matron", element: <MatronRegister /> },
    { path: "/register/nurse", element: <NurseRegister /> },
    { path: "/login", element: <Login /> },
]

export default authRoutes;