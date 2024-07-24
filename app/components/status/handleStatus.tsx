'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/types/customSession';

export default function useHandleStatus() {
    const { data: session} = useSession() as { data: CustomSession | null};

    useEffect(() => {
        if (session?.user?.id) {
            const handleStatusChange = async (status: 'online' | 'offline') => {
                try {
                    const response = await fetch('http://localhost:8080/api/user-status', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: session.user.id, status }),
                    });
                    if (!response.ok) {
                        throw new Error('Failed to update status');
                    }
                } catch (error) {
                    console.error('Error updating status:', error);
                }
            };
          
            const handleOnline = () => handleStatusChange('online');
            const handleOffline = () => handleStatusChange('offline');

            const handleBeforeUnload = () => {
                navigator.sendBeacon('http://localhost:8080/api/user-status', JSON.stringify({
                    userId: session.user.id,
                    status: 'offline'
                }));
            };

            handleStatusChange('online'); // Set initial status

            const intervalId = setInterval(() => {
                handleStatusChange('online');
            }, 30000); // Update status every 30 seconds
          
            window.addEventListener('online', handleOnline);
            window.addEventListener('offline', handleOffline);
            window.addEventListener('beforeunload', handleBeforeUnload);
          
            return () => {
            clearInterval(intervalId);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            handleStatusChange('offline');
            };
        }
    }, [session]);
}