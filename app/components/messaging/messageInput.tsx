'use client';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

export default function MessageInput({ userId, friendId }: { userId: number, friendId: number }) {
    const [message, setMessage] = useState('');
    const socketRef = useRef<any>(null);

    useEffect(() => {
        socketRef.current = io('http://localhost:8080/messaging');

        socketRef.current.emit('join_conversation', { userId, friendId });

        socketRef.current.on('new_message', (newMessage: any) => {
            console.log('New message:', newMessage);
            // DO this: update your chat state here
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [friendId, userId]);

    async function sendMessage() {
        if (!message.trim()) return; // Don't send empty messages

        try {
            const response = await fetch('/api/messages/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ senderId: userId, receiverId: friendId, content: message }),
            });

            if (response.ok) {
                socketRef.current.emit('send_message', { sender_id: userId, receiver_id: friendId, content: message });
                setMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    };

    return (
        <div className="flex">
            <Image src="/circle.png" width={60} height={40} alt="Upload" />
            <textarea
                value={message}
                onChange={handleChange}
                className="flex-1 p-2 border border-blue-900 rounded-l resize-none"
                placeholder="Type a message..."
                rows={2}
            />
            <button
                onClick={sendMessage}
                className="hover:font-semibold bg-blue-500 text-white text-xl px-2 rounded-r"
            >
                Send
            </button>
        </div>
    );
}