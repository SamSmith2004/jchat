'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/types/customSession';
import StartMessage from '@/app/components/messaging/startMessage';

interface AllFriendsProps {
    onStartMessage?: (friendId: number, friendUsername: string) => void;
}

export default function AllFriends({ onStartMessage }: AllFriendsProps) {
    const { data: session } = useSession() as { data: CustomSession | null };
    const [friendsList, setFriendsList] = useState<CustomSession[]>([]);

    useEffect(() => {
        if (session?.user?.id) {
            const userId = Number(session.user.id);
            fetchFriends(userId);
        }
    }, [session]);

    async function fetchFriends(userID: number) {
        try {
            const response = await fetch(`/api/friends/list?userId=${userID}`, {
                method: 'GET',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get friends list');
            }
            const data = await response.json();
            setFriendsList(data);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    }

    return (
        <>
            <h1 className="text-blue-500 text-2xl font-bold">Friends:</h1>
            {friendsList.length > 0 ? (
                friendsList.map((friend) => (
                    <div key={friend.UserID} className="flex space-x-5">
                        <Image src="/circle.png" alt="placeholder" height={40} width={50}/>
                        <h2 className='text-blue-300 text-2xl pr-5'>{friend.Username}</h2>
                        {onStartMessage ? (
                            <button
                                className='text-lg bg-gray-900 border border-blue-900 rounded-md p-1'
                                onClick={() => onStartMessage(friend.UserID, friend.Username)}
                            >
                                Message
                            </button>
                        ) : (
                            <StartMessage 
                                friendId={friend.UserID} 
                                friendUsername={friend.Username}
                            />
                        )}
                    </div>
                ))
            ) : (
                <p className="text-white">No friends</p>
            )}
        </>
    );
}