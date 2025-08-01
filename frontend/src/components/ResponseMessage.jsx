import { useState } from 'react'

import { useResponseMessage } from '../api/message.api';
import MessageInput from './MessageInput';

export default function ResponseMessage({ contactId }) {
    const [text, setText] = useState("");
    const { isPending, mutateAsync } = useResponseMessage(contactId)

    const handleSendMsg = async () => {
        try {
            if (text)
                await mutateAsync({ content: text.trimEnd() })
        } 
        catch (error) {}
        finally{ setText("") }
    }

    return (
        <MessageInput 
            handleSend={handleSendMsg}
            isPending={isPending} 
            text={text} setText={setText} 
        />
    )
}
