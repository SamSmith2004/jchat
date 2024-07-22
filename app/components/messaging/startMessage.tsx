'use client';
import { useRouter } from 'next/navigation';

interface StartMessageProps {
    friendId: number;
    friendUsername: string;
}

export default function StartMessage({ friendId, friendUsername }: StartMessageProps) {
    const router = useRouter();

    const handleStartMessage = () => {
        router.push(`/message?friendId=${friendId}&friendUsername=${encodeURIComponent(friendUsername)}`);
    };

    return (
        <button
            className='hover:font-semibold text-lg bg-gray-900 border border-blue-900 rounded-md p-1'
            onClick={handleStartMessage}
        >
            Message
        </button>
    );
}