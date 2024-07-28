'use client';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/types/customSession';
import { useEffect, useState } from 'react';

interface BlockedUser {
  UserID: string;
  Username: string;
}

export default function Blocked() {
    const { data: session } = useSession() as { data: CustomSession };
    const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!session?.user?.id) return;
        
        async function fetchBlocked() {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch('/api/friends/blocked', {
                    method: 'GET',
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to get blocked list');
                }
                const data = await response.json();
                setBlockedUsers(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching blocked:', error);
                setError('Failed to load blocked users. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        }

        fetchBlocked();
    }, [session]);

    if (isLoading) return <div>Loading blocked users...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <>
        <h1 className='text-blue-500 text-3xl'>Blocked Users:</h1>
        {blockedUsers.length > 0 ? (
            blockedUsers.map(blockedUser => (
                <div key={blockedUser.UserID} className="flex space-x-5">
                    <Image src="/circle.png" alt="placeholder" height={40} width={50}/>
                    <h2 className='text-blue-300 text-2xl'>{blockedUser.Username}</h2>
                </div>
            ))
        ) : (
            <p className='text-blue-300 text-lg'>No blocked users found</p>
        )}
        </>
    );
}