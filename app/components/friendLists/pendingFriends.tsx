'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/types/customSession';

interface PendingFriend {
    id: number;
    Username: string;
}

export default function PendingFriends() {
    const { data: session } = useSession() as { data: CustomSession | null };
    const [pendingFriends, setPendingFriends] = useState<PendingFriend[]>([]);

    async function acceptFriendRequest(requestId: number) {
        try {
            const response = await fetch('/api/friends/accept', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ requestId }),
            });
   
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to accept friend request');
            }
   
            const data = await response.json();
            console.log('Response:', data);
   
            setPendingFriends(prevFriends => prevFriends.filter(friend => friend.id !== requestId));
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    }

    async function rejectFriendRequest(requestId: number) {
        console.log('Rejecting request with ID:', requestId);
        try {
            const response = await fetch('/api/friends/reject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ requestId }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to reject friend request');
            }
    
            const data = await response.json();
            console.log('Response:', data);
    
            setPendingFriends(prevFriends => prevFriends.filter(friend => friend.id !== requestId));
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    }
   
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                if (!session?.user?.id) return;
                const response = await fetch(`/api/friends/pendingList?userId=${session.user.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch pending friends');
                }
                const data: PendingFriend[] = await response.json();
                setPendingFriends(data);
            } catch (error) {
                console.error('Error fetching pending friends:', error);
            }
        };
       
        if (session?.user?.id) {
            fetchFriends();
        }
    }, [session]);
   
    return (
        <>
            <h1 className="text-blue-500 text-3xl font-bold">Pending Friends</h1>
            <div>
                <h2 className="text-blue-500 text-2xl text-center font-semibold mb-5">Incoming:</h2>
                {pendingFriends.length > 0 ? (
                    pendingFriends.map((friend) => (
                        <div key={friend.id} className="flex space-x-5">
                            <Image src="/circle.png" alt="placeholder" height={40} width={50}/>
                            <h2 className='text-blue-500 text-2xl pr-10'>{friend.Username}</h2>
                            <button
                                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:font-extrabold"
                                onClick={() => acceptFriendRequest(friend.id)}
                            >
                                Accept
                            </button>
                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:font-extrabold"
                                onClick={() => rejectFriendRequest(friend.id)}
                            >
                                Reject
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-white">No pending friends</p>
                )}
            </div>
        </>
    );
}