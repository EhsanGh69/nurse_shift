import { createBrowserRouter } from 'react-router-dom'

import BaseRoute from './pages/BaseRoute';
import Welcome from "./pages/Welcome";
import NotFound from './pages/NotFound';
import authRoutes from './pages/auth/routes';
import accountRoutes from './pages/account/routes';
import nurseRoutes from './pages/nurses/routes';
import matronRoutes from './pages/matrons/routes';
import messageRoutes from './pages/messages/routes';

const router = createBrowserRouter([
    { path: "/", element: <BaseRoute><Welcome /></BaseRoute>},
    { path: "*", element: <NotFound /> },
    ...authRoutes,
    ...nurseRoutes,
    ...matronRoutes,
    ...accountRoutes,
    ...messageRoutes
])

export default router;