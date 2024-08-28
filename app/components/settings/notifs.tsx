import React, { useState, useEffect } from 'react';
import { useTheme } from '@/app/components/theme/themeProvider';

const NotifsSettings: React.FC = () => {
    const [notifEnabled, setNotifEnabled] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        async function fetchNotifSettings() {
            setIsLoading(true);
            try {
                const response = await fetch('/api/settings/notifSettings');
                if (!response.ok) {
                    throw new Error('Failed to fetch notification settings');
                }
                const data = await response.json();
                setNotifEnabled(data.notifAudio !== 0);
            } catch (error) {
                setError('Failed to fetch notification settings');
                console.error('Error fetching notification settings:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchNotifSettings();
    }, []);

    async function toggleNotifs() {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetch('/api/settings/notifSettings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ notifAudio: notifEnabled }),
            });

            if (!result.ok) {
                throw new Error('Failed to toggle notifications');
            }
            const data = await result.json();
            //console.log('Data:', data);
            setNotifEnabled(data);
        } catch (error) {
            setError('Failed to toggle notifications');
            console.error('Error toggling notifications:', error);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <>
            <h1 className="text-blue-500 text-4xl font-extrabold ">Notification Settings</h1>
            <div className="flex gap-2">
                <h2 className="text-blue-500 text-xl font-bold mt-1">Notifications:</h2>
                <button 
                className={`hover:font-bold px-2 py-1 ${theme === 'light' ? 'bg-gray-400 border-blue-700' : 'bg-gray-900 border-blue-900'} border text-blue-500 font-semibold rounded text-lg`}
                onClick={toggleNotifs}
                >{notifEnabled ? 'Disable' : 'Enable'}</button>
            </div>
            {isLoading && <div className='text-blue-300'>Loading...</div>}
            {error && <div className='text-red-500'>{error}</div>}
        </>
    );
}

export default NotifsSettings;