import Register from "./Register";
import Login from "./Login";


const authRoutes = [
    { path: "/register", element: <Register /> },
    { path: "/login", element: <Login /> },
]

export default authRoutes;