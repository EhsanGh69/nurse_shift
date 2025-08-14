import { createBrowserRouter } from 'react-router-dom'

import BaseRoute from './pages/BaseRoute';
import Welcome from "./pages/Welcome";
import NotFound from './pages/NotFound';
import authRoutes from './pages/auth/routes';
import accountRoutes from './pages/account/routes';
import nurseRoutes from './pages/nurses/routes';
import matronRoutes from './pages/matrons/routes';
import messageRoutes from './pages/messages/routes';
import shiftRoutes from './pages/shifts/routes';
import PrivateRoute from './pages/PrivateRoute';
import ChangeSettings from './pages/ChangeSettings';
import SendPoll from './pages/SendPoll';

const router = createBrowserRouter([
    { path: "/", element: <BaseRoute><Welcome /></BaseRoute>},
    { path: "/settings", element: <PrivateRoute />, children: [
        { path: "", element: <ChangeSettings /> }
    ] },
    { path: "/poll", element: <PrivateRoute />, children: [
        { path: "", element: <SendPoll /> }
    ] },
    { path: "*", element: <NotFound /> },
    ...authRoutes,
    ...nurseRoutes,
    ...matronRoutes,
    ...accountRoutes,
    ...messageRoutes,
    ...shiftRoutes
])

export default router;