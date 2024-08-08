'use client';
import { Navbar } from "../components/navbar";
import { useEffect, useState, useCallback } from "react";
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/types/customSession';
import MessageList from '@/app/components/messaging/messageList';
import MessageInput from '@/app/components/messaging/messageInput';
import { useRouter } from 'next/navigation';
import AllFriends from "../components/friendLists/allFriends";
import { useSearchParams } from 'next/navigation';

interface LastMessagedFriend {
    UserID: number;
    Username: string;
    LastMessageTime: string;
}

export default function Message() {
    const router = useRouter();
    const { data: session } = useSession() as { data: CustomSession | null };
    const [lastMessaged, setLastMessaged] = useState<LastMessagedFriend[]>([]);
    const [selectedFriend, setSelectedFriend] = useState<LastMessagedFriend | null>(null);
    const [noConversations, setNoConversations] = useState(false);
    const UserID = Number(session?.user?.id);
    const searchParams = useSearchParams();

    const fetchLastMessaged = useCallback(async (userId: number) => {
        try {
            const response = await fetch(`/api/messages/lastMessaged?userId=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch last messaged friends');
            }
            const { message, data } = await response.json();
            console.log(message);
            setLastMessaged(data);

            const friendUsername = searchParams.get('friendUsername');
            const friendId = searchParams.get('friendId');
            if (friendUsername && friendId) {
                const newFriend: LastMessagedFriend = {
                    UserID: Number(friendId), 
                    Username: decodeURIComponent(friendUsername),
                    LastMessageTime: new Date().toISOString(),
                };

                // Check if the newFriend already exists in the lastMessaged array
                const existingFriend = data.find((f : any) => f.UserID === newFriend.UserID);
                if (existingFriend) {
                    // Update the existing friend's last message time
                    setLastMessaged((prev) =>
                        prev.map((f) => (f.UserID === newFriend.UserID ? newFriend : f))
                    );
                } else {
                    // Add the new friend to the beginning of the array
                    setLastMessaged([newFriend, ...data]);
                }

                setSelectedFriend(newFriend);
                setNoConversations(false);
            } else {
                setNoConversations(data.length === 0);
            }
        } catch (error) {
            console.error('Error fetching last messaged friends:', error);
            setNoConversations(true);
        }
    }, [searchParams]);

    const handleStartMessage = useCallback((friendId: number, friendUsername: string) => {
        const newFriend = {
            UserID: friendId,
            Username: friendUsername,
            LastMessageTime: new Date().toISOString()
        };

        setLastMessaged((prev) => {
            const existingFriend = prev.find((f) => f.UserID === friendId);
            if (existingFriend) {
                // Update existing friend's last message time
                return prev.map((f) => (f.UserID === friendId ? newFriend : f));
            } else {
                // Add new friend to the list
                return [newFriend, ...prev];
            }
        });

        setSelectedFriend(newFriend);
        setNoConversations(false);

        router.replace(`/message?friendId=${friendId}&friendUsername=${encodeURIComponent(friendUsername)}`);
    }, [router]);

    useEffect(() => {
        if (session?.user?.id) {
            fetchLastMessaged(UserID);
        }
    }, [session, UserID, fetchLastMessaged]);

    useEffect(() => {
        const friendId = searchParams.get('friendId');
        const friendUsername = searchParams.get('friendUsername');
        if (friendId && friendUsername) {
          handleStartMessage(Number(friendId), decodeURIComponent(friendUsername));
        }
    }, [searchParams, handleStartMessage]);

    return (
        <main className="flex flex-col">
            <Navbar />
            <div className="flex justify-between items-start">
                <div className='flex space-y-5 flex-col border-r border-blue-900 pt-5 pr-8 pl-10 text-blue-500 h-screen'>
                    <h1 className='text-blue-500 font-bold text-2xl'>Direct Messages</h1>
                    {noConversations ? (
                        <div>
                            <h1 className="text-white text-xl mb-5">No conversations found</h1>
                            <AllFriends onStartMessage={handleStartMessage} />
                        </div>
                    ) : (
                        <>
                            {lastMessaged.map((friend) => (
                                <h2
                                    key={friend.UserID}
                                    className='text-blue-300 text-lg cursor-pointer'
                                    onClick={() => handleStartMessage(friend.UserID, friend.Username)}
                                >
                                    {friend.Username}
                                </h2>
                            ))}
                            <AllFriends onStartMessage={handleStartMessage} />
                        </>
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