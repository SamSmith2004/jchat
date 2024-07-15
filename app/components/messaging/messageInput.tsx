'use client';
import { useState } from 'react';

export default function MessageInput({ userId, friendId }: { userId: number, friendId: number }) {
    const [message, setMessage] = useState('');

    async function sendMessage() {
        if (!message.trim()) return;

        try {
            const response = await fetch('/api/messages/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ senderId: userId, receiverId: friendId, content: message }),
            });

            if (response.ok) {
                setMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    return (
        <div className="flex">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 p-2 border border-blue-900 rounded-l"
                placeholder="Type a message..."
            />
            <button
                onClick={sendMessage}
                className="bg-blue-500 text-white p-2 rounded-r"
            >
                Send
            </button>
        </div>
    );
}