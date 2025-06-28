import { createBrowserRouter } from 'react-router-dom'

import Welcome from "./pages/Welcome";
import NotFound from './pages/NotFound';
import authRoutes from './pages/auth/routes';
import nurseRoutes from './pages/nurses/routes';

const router = createBrowserRouter([
    { path: "/", element: <Welcome /> },
    { path: "*", element: <NotFound /> },
    ...authRoutes,
    ...nurseRoutes
])

export default router;