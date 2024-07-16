'use client';
import { useEffect, useState, useCallback } from 'react';

interface Message {
    id: number;
    sender_id: number;
    content: string;
    timestamp: string;
}

export default function MessageList({ userId, friendId }: { userId: number, friendId: number }) {
    const [messages, setMessages] = useState<Message[]>([]);

    const fetchMessages = useCallback(async () => {
        const response = await fetch(`/api/messages/list?userId=${userId}&friendId=${friendId}`);
        const data = await response.json();
        setMessages(data);
    }, [userId, friendId]);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, [fetchMessages]);

    return (
        <div className="h-64 overflow-y-auto mb-4 p-2 border border-blue-900 rounded">
            {messages.map((message) => (
                <div key={message.id} className={`mb-2 ${message.sender_id === userId ? 'text-right' : 'text-left'}`}>
                    <span className={`inline-block p-2 rounded ${message.sender_id === userId ? 
                        'border border-blue-400 bg-blue-500 text-white' : 'border border-blue-900 bg-gray-900 text-blue-500'}`}>
                        {message.content}
                    </span>
                </div>
            ))}
        </div>
    );
}