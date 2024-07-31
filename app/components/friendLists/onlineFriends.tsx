'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import io from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/types/customSession';

export default function OnlineFriends() {
    const [friends, setFriends] = useState<CustomSession[]>([]);;
    const { data: session } = useSession() as { data: CustomSession };
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (session?.user?.id) {
            const userId = Number(session.user.id);
            fetchFriends(userId);
            try {
                const socket = io('http://localhost:8080/user-status');

                socket.on('user_online', (userId) => {
                    setFriends(prevFriends =>
                        prevFriends.map(friend =>
                            friend.id === userId ? {...friend, status: 'online'} : friend
                        )
                    );
                });

                socket.on('user_offline', (userId) => {
                    setFriends(prevFriends =>
                        prevFriends.map(friend =>
                            friend.id === userId ? {...friend, status: 'offline'} : friend
                        )
                    );
                });

                return () => {
                    socket.disconnect();
                };
            } catch (error) {
                console.error('Error connecting to socket:', error);
                setError('Failed to connect to server. Please try again later.');
            }
        }
    }, [session]);

    async function fetchFriends(userID: number) {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/friends/statusList?userId=${userID}`, {
                method: 'GET',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get friends list');
            }
            const data = await response.json();
            setFriends(data);
        } catch (error) {
            console.error('Error fetching friends:', error);
            setError('Failed to get your friends');
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return <div className="text-white">Loading friends...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <>
        {friends.length > 0 ? (
            friends.map(friend => (
                <div key={friend.id} className="flex space-x-5">
                <div className="relative">
                    <Image 
                        src={friend.avatar || "/circle.png"} 
                        alt={`${friend.name}'s avatar`} 
                        height={50} 
                        width={60} 
                        className='z-10 rounded-full  border-2 border-blue-900 max-h-10 max-w-10'
                        onError={(e) => {
                            e.currentTarget.src = "/circle.png";
                        }}
                    />
                    {friend.status === 'online' ?
                    (<Image src="/greencircle.png" alt="online status" height={20} width={20} className='absolute bottom-0 right-0 z-20'/>)
                    :
                    (<Image src="/greycircle.png" alt="offline status" height={20} width={20} className='absolute bottom-0 right-0 z-20'/>)}
                </div>
                <h2 className={`text-3xl text-blue-500`}>
                    {friend.name}
                </h2>
            </div>
            ))) : (
                <p className="text-white">No friends</p>
            )}
        </>
    );
}