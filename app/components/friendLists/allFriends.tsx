'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/types/customSession';
import StartMessage from '@/app/components/messaging/startMessage';
import UserOptions from '@/app/components/user/userOptions';

interface AllFriendsProps {
    onStartMessage?: (friendId: number, friendUsername: string) => void;
}

export default function AllFriends({ onStartMessage }: AllFriendsProps) {
    const [openUserID, setOpenUserID] = useState<number | string | null>(null);
    const { data: session } = useSession() as { data: CustomSession | null };
    const [friendsList, setFriendsList] = useState<CustomSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (session?.user?.id) {
            const userId = Number(session.user.id);
            fetchFriends(userId);
        }
    }, [session]);

    async function fetchFriends(userID: number) {
        setIsLoading(true);
        setError(null);
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
            setError(error instanceof Error ? error.message : 'An error occurred while fetching friends');
        } finally {
            setIsLoading(false);
        }
    }

    const handleUserBlocked = (blockedUserId: number | string) => {
        setFriendsList(prevList => prevList.filter(friend => friend.UserID !== blockedUserId));
        setOpenUserID(null); // close user options
    };

    const handleToggleUserOptions = (userID: number | string) => {
        setOpenUserID(prevID => prevID === userID ? null : userID);
    };

    if (isLoading) {
        return <div className="text-white">Loading friends...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <>
            <h1 className="text-blue-500 text-2xl font-bold">Friends:</h1>
            {friendsList.length > 0 ? (
                friendsList.map((friend) => (
                    <div key={friend.UserID} className="flex space-x-5 items-center">
                        <Image 
                            src={friend.avatar || "/circle.png"} 
                            alt="avatar" 
                            height={40} 
                            width={50}
                            className='rounded-full border-2 border-blue-900 max-h-12'
                        />
                        <h2 className='text-blue-300 text-2xl pr-5'>{friend.Username}</h2>
                        {onStartMessage ? (
                            <button
                                className='hover:font-semibold text-lg bg-gray-900 border border-blue-900 rounded-md p-1'
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
                        <UserOptions
                            UserID={friend.UserID}
                            Username={friend.Username}
                            avatar={friend.avatar || '/circle.png'}
                            bio={friend.bio || 'No bio available'} 
                            onUserBlocked={() => handleUserBlocked(friend.UserID)}
                            isOpen={openUserID === friend.UserID}
                            onToggle={() => handleToggleUserOptions(friend.UserID)}
                        />
                    </div>
                ))
            ) : (
                <p className="text-white">No friends</p>
            )}
        </>
    );
}