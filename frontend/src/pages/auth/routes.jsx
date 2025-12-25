import { lazy } from "react"

import LazyWrapper from "../../components/LazyWrapper";
import BaseRoute from "../BaseRoute";

const MatronRegister = lazy(() => import("./MatronRegister"))
const NurseRegister = lazy(() => import("./NurseRegister"))
const Login = lazy(() => import("./Login"))


const authRoutes = [
    { path: "/register/matron", 
        element: (
            <LazyWrapper>
                <BaseRoute><MatronRegister /></BaseRoute>
            </LazyWrapper>
        ) 
    },
    { path: "/register/nurse", 
        element: (
            <LazyWrapper>
                <BaseRoute><NurseRegister /></BaseRoute>
            </LazyWrapper>
        ) 
    },
    { path: "/login", 
        element: (
            <LazyWrapper>
                <BaseRoute><Login /></BaseRoute>
            </LazyWrapper>
        ) 
    },
]

export default authRoutes;