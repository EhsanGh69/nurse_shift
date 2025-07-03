import { createBrowserRouter } from 'react-router-dom'

import Welcome from "./pages/Welcome";
import NotFound from './pages/NotFound';
import authRoutes from './pages/auth/routes';
import accountRoutes from './pages/account/routes';
import nurseRoutes from './pages/nurses/routes';
import matronRoutes from './pages/matrons/routes';

const router = createBrowserRouter([
    { path: "/", element: <Welcome /> },
    { path: "*", element: <NotFound /> },
    ...authRoutes,
    ...nurseRoutes,
    ...matronRoutes,
    ...accountRoutes
])

export default router;