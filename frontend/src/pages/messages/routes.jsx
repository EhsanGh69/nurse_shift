import { lazy } from "react"

import LazyWrapper from "../../components/LazyWrapper";
import PrivateRoute from "../PrivateRoute";

const UserConversations = lazy(() => import("./UserConversations"))
const ConversationDetail = lazy(() => import("./ConversationDetail"))
const CreateConversation = lazy(() => import("./CreateConversation"))

const messageRoutes = [{
    path: "/messages", element: <PrivateRoute />, children:
        [
            { path: "conversations", element: <LazyWrapper><UserConversations /></LazyWrapper> },
            { path: "conversations/:mobile", element: <LazyWrapper><ConversationDetail /></LazyWrapper> },
            { path: "conversations/create", element: <LazyWrapper><CreateConversation /></LazyWrapper> },
        ]
}]

export default messageRoutes;