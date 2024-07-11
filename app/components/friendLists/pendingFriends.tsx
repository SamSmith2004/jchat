'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/types/customSession';
interface PendingFriend {
  Username: string;
}
export default function PendingFriends() {

    const { data: session } = useSession() as { data: CustomSession | null };
    const [pendingFriends, setPendingFriends] = useState<PendingFriend[]>([]);
   
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                if (!session?.user?.id) return;
                const response = await fetch(`/api/friends/pendingList?userId=${session.user.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch pending friends');
                }
                const data = await response.json();
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
                <h2 className="text-blue-500 text-2xl text-center font-semibold mb-5">Outgoing:</h2>
                {pendingFriends.length > 0 ? (
                    pendingFriends.map((friend, index) => (
                        <div key={index} className="flex space-x-5">
                            <Image src="/circle.png" alt="placeholder" height={40} width={50}/>
                            <h2 className='text-blue-500 text-2xl'>{friend.Username || 'Error'}</h2>
                        </div>
                    ))
                ) : (
                    <p className="text-white">No pending friends</p>
                )}
            </div>
            <div>
                <h2 className="text-blue-500 text-2xl text-center font-semibold mb-5">Incoming:</h2>
                {/**TODO: Add incoming friends list **/}
                {pendingFriends.length > 0 ? (
                    pendingFriends.map((friend, index) => (
                        <div key={index} className="flex space-x-5">
                            <Image src="/circle.png" alt="placeholder" height={40} width={50}/>
                            <h2 className='text-blue-500 text-2xl pr-10'>{friend.Username || 'Error'}</h2>
                            <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:font-extrabold">Accept</button>
                            <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:font-extrabold">Reject</button>
                        </div>
                    ))
                ) : (
                    <p className="text-white">No pending friends</p>
                )}
            </div>
        </>
    );
}