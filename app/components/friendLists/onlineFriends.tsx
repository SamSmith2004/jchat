'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import io from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/types/customSession';

export default function OnlineFriends() {
    const [friends, setFriends] = useState<CustomSession[]>([]);;
    const { data: session } = useSession() as { data: CustomSession };

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
            }
        }
    }, [session]);

    async function fetchFriends(userID: number) {
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
        }
    }

    return (
        <>
        {friends.length > 0 ? (
            friends.map(friend => (
                <div key={friend.id} className="flex space-x-5">
                    <div className="relative">
                        <Image src="/circle.png" alt="placeholderpfp" height={50} width={60} className='z-10'/>
                        {friend.status === 'online' ? 
                        (<Image src="/greencircle.png" alt="placeholderstatus" height={20} width={20} className='absolute bottom-0.5 right-1.5 z-20'/>) 
                        : 
                        (<Image src="/greycircle.png" alt="placeholderstatus" height={20} width={20} className='absolute bottom-0.5 right-1.5 z-20'/>)}
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