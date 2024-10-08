'use client'
import { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/types/customSession';
import { useTheme } from '@/app/components/theme/themeProvider';

interface UserOptionsProps {
    UserID: number | string;
    Username: string;
    avatar: string;
    bio: string;
    banner: string;
    onUserBlocked?: () => void; 
    isOpen: boolean;
    onToggle: () => void;
}

interface UserDetailsDisplayProps {
    UserID: number | string;
    Username: string;
    avatar: string;
    bio: string;
    banner: string;
    onClose: () => void;
}

interface MenuPosition {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
}

const UserDetailsDisplay: React.FC<UserDetailsDisplayProps> = ({ Username, avatar, bio, banner, onClose }) => {
    const { theme } = useTheme();
    
    return (
        <div className={`fixed inset-0 ${theme === 'light' ? 'bg-white' : 'bg-black'} bg-opacity-50 flex items-center justify-center z-50`}>
            <div className={`${theme === 'light' ? 'bg-gray-200 border-blue-700' : 'bg-gray-900 border-blue-900'}  rounded-lg max-w-2xl w-full relative overflow-hidden`}>
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 px-2.5 py-1 text-red-500 rounded-lg hover:font-extrabold hover:text-red-700 text-xl font-semibold z-10"
                >
                    x
                </button>
                <div className="relative">
                    <div
                        className="h-48 w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${banner || 'https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'})` }}
                    ></div>
                    <div className={`absolute bottom-0 left-0 right-0 transform translate-y-1/2 flex items-center ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-900'}`}>
                        <div className="flex items-center w-full px-6">
                            <Image
                                src={avatar || "/circle.png"}
                                alt={Username}
                                width={100}
                                height={100}
                                className="rounded-full border-2 border-blue-900 -mt-8"
                                onError={(e) => {
                                    e.currentTarget.src = "/circle.png";
                                }}
                            />
                            <h2 className="ml-4 -mt-6 text-2xl font-semibold text-blue-400">{Username}</h2>
                        </div>
                    </div>
                </div>
                <div className="mt-10 p-6">
                    <h3 className='text-blue-500 text-xl font-bold mb-2 mt-2'>About Me:</h3>
                    <div className='border border-blue-900 bg-gray-900 text-blue-300 p-2 rounded mb-4 w-5/6 h-fit'>{bio || 'No bio available'}</div>
                </div>
            </div>
        </div>
    );
};

export default function UserOptions({ UserID, Username, avatar, bio, banner, onUserBlocked, isOpen, onToggle }: UserOptionsProps) {
    const [menuPosition, setMenuPosition] = useState<MenuPosition>({});
    const [showDetails, setShowDetails] = useState(false);
    const [showUserDetails, setShowUserDetails] = useState(false);
    const { data: session } = useSession() as { data: CustomSession | null };
    const [isBlocking, setIsBlocking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { theme } = useTheme();

    const handleDisplayUser = () => {
        setShowUserDetails(true);
        onToggle();
    }

    const toggleDetails = (event: React.MouseEvent) => {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const spaceRight = window.innerWidth - rect.right;
        const spaceBottom = window.innerHeight - rect.bottom;

        const newPosition: MenuPosition = {};

        if (spaceBottom < 200) {
            newPosition.bottom = window.innerHeight - rect.top;
        } else {
            newPosition.top = rect.bottom;
        }

        if (spaceRight < 300) {
            newPosition.right = window.innerWidth - rect.right;
        } else {
            newPosition.left = rect.left;
        }

        setMenuPosition(newPosition);
        onToggle();
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

    const removeFriend = async () => {
        if (!session?.user.id) return;
        setIsBlocking(true);
        setError(null);

        if (!confirm('Are you sure you want to remove this friend?')) {
            setIsBlocking(false);
            return;
        }

        try {
            const response = await fetch('/api/friends/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ friendId: UserID }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to remove friend');
            }

            onToggle(); 
            if (onUserBlocked) {
                onUserBlocked();
            }

        } catch (error) {
            console.error('Error removing friend:', error);
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
            {isOpen && (
                <div 
                style={{
                    position: 'fixed',
                    ...menuPosition
                }}
                className={`absolute right-0 mt-2 w-96 ${theme === 'light' ? 'bg-gray-100 border-blue-700' : 'bg-gray-900 border-blue-900'} border rounded-md z-10`}>
                    <div className="py-1">
                        <div className="px-4 py-2 text-lg text-blue-500 font-semibold flex items-center">
                            <Image src={avatar} alt={Username} width={32} height={32} className="rounded-full mr-2 max-h-8" />
                            <span>{Username}</span>
                        </div>
                        <button
                            onClick={handleDisplayUser}
                            className="block px-4 py-2 text-md text-blue-500 hover:bg-blue-400 hover:text-white hover:font-semibold w-full text-left"
                        >
                            View Profile
                        </button>
                        <button
                        onClick={removeFriend}
                        disabled={isBlocking}
                        className="block px-4 py-2 text-md text-blue-500 hover:bg-blue-400 hover:text-white hover:font-semibold w-full text-left"
                        >
                        {isBlocking ? 'Removing...' : 'Remove Friend'}
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
            {showUserDetails && (
                <UserDetailsDisplay 
                    UserID={UserID}
                    Username={Username}
                    avatar={avatar}
                    bio={bio}
                    banner={banner || 'https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                    onClose={() => setShowUserDetails(false)}
                />
            )}
        </div>
    );
}