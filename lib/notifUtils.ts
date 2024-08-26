import io from 'socket.io-client';
import { CustomSession } from '@/app/types/customSession';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
let audioContextRef: { current: AudioContext | null } = { current: null };

export async function notifEnabledCheck(): Promise<boolean> {
  let notifSound = true;
  try {
    const response = await fetch('/api/settings/notifSettings');
    if (!response.ok) {
      throw new Error('Failed to fetch notification settings');
    }
    const data = await response.json();
    if (data.notifAudio === 0) {
      notifSound = false;
    }
  } catch (error) {
    console.error('Failed to fetch notification settings:', error);
  }
  return notifSound;
}

export async function playNotificationSound() {
  try {
    const isNotifEnabled = await notifEnabledCheck();
    if (!isNotifEnabled) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const response = await fetch('/notification.mp3');
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);
    source.start(0);
  } catch (error) {
    console.error('Failed to play notification sound:', error);
  }
}

export function NotifSocket() {
  const { data: session } = useSession() as { data: CustomSession };
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!session?.user?.id) return;

    const socket = io('http://localhost:8080/notifications');

    socket.on('connect', () => {
      socket.emit('join_notifications', session.user.id);
    });

    socket.on('new_notification', (data: { senderId: string }) => {
      if (pathname === '/message') {
        const urlFriendId = searchParams.get('friendId');
        const numUrlFriendId = parseInt(urlFriendId as string);
        const numSenderId = parseInt(data.senderId);
        if (numSenderId !== numUrlFriendId) {
          playNotificationSound();
        }
      } else {
        playNotificationSound();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [session, pathname, searchParams]);
}