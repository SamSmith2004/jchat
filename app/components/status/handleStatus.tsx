'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/types/customSession';
import io from 'socket.io-client';

export default function useHandleStatus() {
  const { data: session } = useSession() as { data: CustomSession | null };

  useEffect(() => {
    let socket: any;

    async function updateStatus(status: 'online' | 'offline') {
      console.log('Updating status:', status);
      if (session?.user?.id) {
        try {
          const response = await fetch('http://localhost:8080/api/user-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: session.user.id, status }),
          });
          if (!response.ok) {
            throw new Error('Failed to update status');
          }
          console.log('Status updated successfully');
        } catch (error) {
          console.error('Error updating status:', error);
        }
      }
    }

    function handleOnline() {
      updateStatus('online');
    }

    function handleOffline() {
      updateStatus('offline');
    }

    if (session?.user?.id) {
      socket = io('http://localhost:8080/api/user-status', {
        transports: ['websocket'],
        upgrade: false
      });
      
      updateStatus(navigator.onLine ? 'online' : 'offline');

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') { // Check if tab/window is not minimized/hidden behind other windows
          updateStatus('online'); 
        }
      });

      const intervalId = setInterval(() => {
        if (navigator.onLine) {
          updateStatus('online'); // Update status every 30 seconds
        }
      }, 30000);

      window.addEventListener('beforeunload', () => {
        updateStatus('offline'); // Update status before closing the tab
      });

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        clearInterval(intervalId);
        socket.disconnect();
        updateStatus('offline');
      };
    }
  }, [session]);
}