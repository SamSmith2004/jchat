'use client';
import { Navbar } from '../components/navbar';
import { useSession } from 'next-auth/react'
import { CustomSession } from '@/app/types/customSession';
import Notifications from '@/app/components/notifications/notifs';
import { useTheme } from '@/app/components/theme/themeProvider';

export default function Home() {
  const { data: session } = useSession() as { data: CustomSession | null };
  const { theme } = useTheme();

  return (
    <main className={`flex flex-col min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-black'}`}>
      <Navbar />
      <div className='text-center mt-5'>
        <h1 className={`text-3xl ${theme === 'light' ? 'text-blue-700' : 'text-blue-500'}`}>Welcome to Jchat!</h1>
        {session ? 
          <Notifications session={session} /> : 
          <p className={theme === 'light' ? 'text-gray-800' : 'text-gray-200'}>Please sign in to view notifications</p>
        }
      </div>
    </main>
  );
}