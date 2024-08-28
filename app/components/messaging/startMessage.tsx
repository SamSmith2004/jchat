'use client';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/components/theme/themeProvider';

interface StartMessageProps {
    friendId: number;
    friendUsername: string;
}

export default function StartMessage({ friendId, friendUsername }: StartMessageProps) {
    const router = useRouter();
    const { theme } = useTheme();
    const handleStartMessage = () => {
        router.replace(`/message?friendId=${friendId}&friendUsername=${encodeURIComponent(friendUsername)}`);
        async function markAsRead(sender_id: number) {
            try {
              const response = await fetch('/api/notifications', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sender_id }),
              });
        
              if (!response.ok) {
                throw new Error('Failed to mark message as read');
              }
            } catch (error) {
              console.error('Error marking message as read:', error);
            }
        }
        markAsRead(friendId);
    };

    return (
        <button
            className={`hover:font-semibold text-lg ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-900'} border border-blue-900 rounded-md p-1`}
            onClick={handleStartMessage}
        >
            Message
        </button>
    );
}