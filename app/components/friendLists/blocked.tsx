'use client';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/types/customSession';
import { useTheme } from '@/app/components/theme/themeProvider';
import { useEffect, useState } from 'react';

interface BlockedUser {
  UserID: string;
  Username: string;
  avatar: string;
}

export default function Blocked() {
    const { data: session } = useSession() as { data: CustomSession };
    const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { theme } = useTheme();

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

    async function unblockUser(blockedId: string) {
        if (!session?.user?.id) return;
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch('/api/friends/blocked', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ blockedId: blockedId }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to unblock user');
            }
             // Remove the unblocked user from the list
            setBlockedUsers(prevUsers => prevUsers.filter(user => user.UserID !== blockedId));
        } catch (error) {
            console.error('Error unblocking user:', error);
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
        <h1 className='text-blue-500 text-3xl'>Blocked Users:</h1>
        {blockedUsers.length > 0 ? (
            blockedUsers.map(blockedUser => (
                <div key={blockedUser.UserID} className="flex space-x-5">
                    <Image src={blockedUser.avatar || "/circle.png"} 
                    alt={blockedUser.Username} 
                    height={40} 
                    width={50}
                    className='rounded-full border-2 border-blue-900 max-h-12'
                    />
                    <h2 className='text-blue-300 text-2xl'>{blockedUser.Username}</h2>
                    <button onClick={() => unblockUser(blockedUser.UserID)} className={`border ${theme === 'light' ? 'bg-gray-200 border-blue-700' : 'bg-gray-900 border-blue-900'} rounded-md p-1 text-blue-500 hover:font-semibold text-lg`}>Unblock</button>
                </div>
            ))
        ) : (
            <p className='text-blue-300 text-lg'>No blocked users found</p>
        )}
        </>
    );
}