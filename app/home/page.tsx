'use client';
import { Navbar } from '../components/navbar';
import { useSession } from 'next-auth/react'
import { CustomSession } from '@/app/types/customSession';
import Notifications from '@/app/components/notifications/notifs';

export default function Home() {
  const { data: session } = useSession() as { data: CustomSession | null };

  return (
    <main className="flex flex-col">
      <Navbar />
      <div className='text-center mt-5'>
        <h1 className='text-blue-500 text-3xl'>Welcome to Jchat!</h1>
        {session ? <Notifications session={session} /> : <p>Please sign in to view notifications</p>}
      </div>
    </main>
  );
}