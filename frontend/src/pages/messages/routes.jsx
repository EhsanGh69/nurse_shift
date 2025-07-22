import PrivateRoute from "../PrivateRoute";
import UserConversations from "./UserConversations";
import ConversationDetail from "./ConversationDetail";
import CreateConversation from "./CreateConversation";

const messageRoutes = [{
    path: "/messages", element: <PrivateRoute />, children:
        [
            { path: "conversations", element: <UserConversations /> },
            { path: "conversations/:mobile", element: <ConversationDetail /> },
            { path: "conversations/create", element: <CreateConversation /> },
        ]
}]

export default messageRoutes;