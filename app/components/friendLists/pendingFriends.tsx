'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/types/customSession';

interface PendingFriend {
    id: number;
    Username: string;
    avatar: string;
}

export default function PendingFriends() {
    const { data: session } = useSession() as { data: CustomSession | null };
    const [pendingFriends, setPendingFriends] = useState<PendingFriend[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
            setError('Failed to accept friend request');
        }
    }

    async function rejectFriendRequest(requestId: number) {
        //console.log('Rejecting request with ID:', requestId);
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
            setError('Failed to reject friend request');
        }
    }
   
    useEffect(() => {
        const fetchFriends = async () => {
            setIsLoading(true);
            setError(null);
            try {
                if (!session?.user?.id) return;
                const response = await fetch(`/api/friends/pendingList?userId=${session.user.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch pending friends');
                }
                const data: PendingFriend[] = await response.json();
                setPendingFriends(data);
            } catch (error) {
                setError('Failed to fetch pending friends');
                console.error('Error fetching pending friends:', error);
            } finally {
                setIsLoading(false);
            }
        };
       
        if (session?.user?.id) {
            fetchFriends();
        }
    }, [session]);

    if (isLoading) {
        return <div className="text-white">Loading pending friends...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }
   
    return (
        <>
            <h1 className="text-blue-500 text-3xl font-bold">Pending Friends</h1>
            <div>
                <h2 className="text-blue-500 text-2xl text-center font-semibold mb-5">Incoming:</h2>
                {pendingFriends.length > 0 ? (
                    pendingFriends.map((friend) => (
                        <div key={friend.id} className="flex space-x-5">
                            <Image src={friend.avatar || "/circle.png"} 
                            alt="placeholder" 
                            height={40} 
                            width={50}
                            className='rounded-full border-2 border-blue-900 max-h-12'
                            />
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