'use client'
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/types/customSession';

interface UserOptionsProps {
    UserID: number | string;
    Username: string;
    avatar: string;
    onUserBlocked?: () => void;  // Add this prop
}

export default function UserOptions({ UserID, Username, avatar, onUserBlocked }: UserOptionsProps) {
    const router = useRouter();
    const [showDetails, setShowDetails] = useState(false);
    const { data: session } = useSession() as { data: CustomSession | null };
    const [isBlocking, setIsBlocking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDisplayUser = () => {
        router.push(`/user/${UserID}`);
    }

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    }

    const blockUser = async () => {
        if (!session?.user.id) return;
        setIsBlocking(true);
        setError(null);

        try {
            const response = await fetch('/api/friends/blocked', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ blockedId: UserID }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to block user');
            }

            // If user blocked successfully
            setShowDetails(false);
            if (onUserBlocked) {
                onUserBlocked();
            }
        } catch (error) {
            console.error('Error blocking user:', error);
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsBlocking(false);
        }
    }

    return (
        <div className="relative">
            <button onClick={toggleDetails} className="text-blue-500 hover:text-blue-700 text-2xl">
                ⋮
            </button>
            {showDetails && (
                <div className="absolute right-0 mt-2 w-96 bg-gray-900 border border-blue-900 rounded-md z-10">
                    <div className="py-1">
                        <div className="px-4 py-2 text-lg text-blue-500 font-semibold flex items-center">
                            <Image src={avatar} alt={Username} width={32} height={32} className="rounded-full mr-2" />
                            <span>{Username}</span>
                        </div>
                        <button
                            onClick={handleDisplayUser}
                            className="block px-4 py-2 text-md text-blue-500 hover:bg-blue-400 hover:text-white hover:font-semibold w-full text-left"
                        >
                            View Profile
                        </button>
                        <button
                            onClick={() => {/*TODO: Implement friend removal */}}
                            className="block px-4 py-2 text-md text-blue-500 hover:bg-blue-400 hover:text-white hover:font-semibold w-full text-left"
                        >
                            Remove Friend
                        </button>
                        <button
                            onClick={blockUser}
                            disabled={isBlocking}
                            className="block px-4 py-2 text-md text-red-500 hover:bg-blue-400 hover:text-white hover:font-semibold w-full text-left disabled:opacity-50"
                        >
                            {isBlocking ? 'Blocking...' : 'Block User'}
                        </button>
                        {error && <p className="px-4 py-2 text-sm text-red-500">{error}</p>}
                    </div>
                </div>
            )}
        </div>
    );
}