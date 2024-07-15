'use client';
import { Navbar } from "../components/navbar";
import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/types/customSession';
import MessageList from '@/app/components/messaging/messageList';
import MessageInput from '@/app/components/messaging/messageInput';

interface LastMessagedFriend {
    UserID: number;
    Username: string;
    LastMessageTime: string;
}

export default function Message() {
    const { data: session } = useSession() as { data: CustomSession | null };
    const [lastMessaged, setLastMessaged] = useState<LastMessagedFriend[]>([]);
    const [selectedFriend, setSelectedFriend] = useState<LastMessagedFriend | null>(null);
    const [noConversations, setNoConversations] = useState(false);
    const UserID = Number(session?.user?.id);

    useEffect(() => {
        if (session?.user?.id) {
            fetchLastMessaged(UserID);
        }
    }, [session]);

    async function fetchLastMessaged(userId: number) {
        try {
            const response = await fetch(`/api/messages/lastMessaged?userId=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch last messaged friends');
            }
            const { message, data } = await response.json();
            console.log(message); 
            setLastMessaged(data);
            if (data.length === 0) {
                setNoConversations(true);
            } else {
                setNoConversations(false);
            }
        } catch (error) {
            console.error('Error fetching last messaged friends:', error);
            setNoConversations(true);
        }
    }

    return (
        <main className="flex flex-col">
            <Navbar />
            <div className="flex justify-between items-start">
                <div className='flex space-y-5 flex-col border-r border-blue-900 pt-5 pr-20 pl-10 text-blue-500 h-screen'>
                    <h1 className='text-blue-500 font-bold text-2xl'>Direct Messages</h1>
                    {noConversations ? (
                        <p className="text-white">No conversations found</p>
                    ) : (
                        lastMessaged.map((friend) => (
                            <h2 
                                key={friend.UserID} 
                                className='text-blue-300 text-lg cursor-pointer'
                                onClick={() => setSelectedFriend(friend)}
                            >
                                {friend.Username}
                            </h2>
                        ))
                    )}
                </div>
                {selectedFriend && (
                    <div className="flex-1 p-5">
                        <h2 className="text-blue-500 text-2xl mb-4">Chat with {selectedFriend.Username}</h2>
                        <MessageList userId={UserID} friendId={selectedFriend.UserID} />
                        <MessageInput userId={UserID} friendId={selectedFriend.UserID} />
                    </div>
                )}
            </div>
        </main>
    );
}