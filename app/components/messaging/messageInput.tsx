'use client';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/types/customSession';

export default function MessageInput({ userId, friendId }: { userId: number, friendId: number }) {
    const { data: session } = useSession() as { data: CustomSession | null }
    const [message, setMessage] = useState('');
    const socketRef = useRef<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        socketRef.current = io('http://localhost:8080/messaging');

        socketRef.current.emit('join_conversation', { userId, friendId });

        socketRef.current.on('new_message', (newMessage: any) => {
            console.log('New message:', newMessage);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [friendId, userId]);

    async function sendMessage() {
        if (!message.trim()) return; // Don't send empty messages
        setError(null);

        try {
            const response = await fetch('/api/messages/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ senderId: userId, receiverId: friendId, content: message }),
            });

            if (response.ok) {
                socketRef.current.emit('send_message', { sender_id: userId, receiver_id: friendId, content: message });
                setMessage('');
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to send message');
                if (errorData.error === 'You cannot send messages to this user') {
                    setError('You cannot send messages to this user. They may have blocked you or you may have blocked them.');
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setError('An unexpected error occurred. Please try again later.');
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    };

    return (
        <div className="flex flex-col">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-2" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            <div className="flex">
                <Image 
                src={session?.user.avatar || "/circle.png"} 
                width={60} 
                height={40} 
                alt="Upload"
                className='rounded-full border-2 border-blue-900 mr-1' 
                />
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
        </div>
    );
}