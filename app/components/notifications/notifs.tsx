'use client';
import { useState, useEffect, useRef } from 'react';
import { CustomSession } from "@/app/types/customSession";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import io from 'socket.io-client';

interface NotificationsProps {
  session: CustomSession;
}

interface Notification {
  id: number;
  content: string;
  sender_name: string;
  timestamp: string;
  sender_id: number;
}

const notificationSound = typeof Audio !== 'undefined' ? new Audio('/notification.mp3') : null;

export default function Notifications({ session }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function fetchNotifications() {
      if (!session?.user?.id) return;
  
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/notifications');
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError('Failed to load notifications');
      } finally {
        setIsLoading(false);
      }
    }
  
    fetchNotifications();
  
    const socket = io('http://localhost:8080/notifications');
  
    socket.on('connect', () => {
      console.log('Connected to notifications socket');
      socket.emit('join_notifications', session.user.id);
    });
  
    socket.on('new_notification', () => {
      fetchNotifications();
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.error('Error playing audio:', e));
      }
    });
  
    return () => {
      socket.disconnect();
    };
  }, [session]);

  async function markAsRead(messageId: number) {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark message as read');
      }

      // Remove the marked notification from the list
      setNotifications(notifications.filter(n => n.id !== messageId));
    } catch (error) {
      console.error('Error marking message as read:', error);
      setError('Failed to mark message as read');
    }
  }

  const handleStartMessage = (friendId: number, friendUsername: string) => {
    router.replace(`/message?friendId=${friendId}&friendUsername=${encodeURIComponent(friendUsername)}`);
    async function markAsReadR(sender_id: number) {
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
  markAsReadR(friendId);
  };

  if (isLoading) return <div className='text-blue-300'>Loading notifications...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="text-blue-500">
      <h3 className='text-xl mt-1 mb-3'>Notifications:</h3>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div key={notification.id} className="mb-2 flex justify-center items-center space-x-2">
            <Image src='/notif.png' alt='Notif Icon' height={30} width={30}></Image>
            {notification.sender_name}
            <button
              className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => handleStartMessage(notification.sender_id, notification.sender_name)}
            >
              View
            </button>
            <button
              onClick={() => markAsRead(notification.id)}
              className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Mark as Read
            </button>
            <p className='text-blue-300 text-sm'>{new Date(notification.timestamp).toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p className='text-blue-300'>No new notifications</p>
      )}
    </div>
  );
}