import { lazy } from "react"
import { createBrowserRouter } from 'react-router-dom'

import LazyWrapper from "./components/LazyWrapper";
import BaseRoute from './pages/BaseRoute';
import PrivateRoute from './pages/PrivateRoute';
import Welcome from "./pages/Welcome";
import NotFound from './pages/NotFound';
import authRoutes from './pages/auth/routes';
import accountRoutes from './pages/account/routes';
import nurseRoutes from './pages/nurses/routes';
import matronRoutes from './pages/matrons/routes';
import messageRoutes from './pages/messages/routes';
import shiftRoutes from './pages/shifts/routes';

const ChangeSettings = lazy(() => import("./pages/ChangeSettings"))
const SendPoll = lazy(() => import("./pages/SendPoll"))

const router = createBrowserRouter([
    { path: "/", element: <BaseRoute><Welcome /></BaseRoute>},
    { path: "/settings", element: <PrivateRoute />, children: [
        { path: "", element: <LazyWrapper><ChangeSettings /></LazyWrapper> }
    ] },
    { path: "/poll", element: <PrivateRoute />, children: [
        { path: "", element: <LazyWrapper><SendPoll /></LazyWrapper> }
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