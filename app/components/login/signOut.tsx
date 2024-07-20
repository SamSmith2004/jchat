import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/types/customSession';

const SignOutButton = () => {
  const { data: session } = useSession() as { data: CustomSession };
  const handleSignOut = async () => {
    if (session && session.user.id) {
      try {
        await fetch('/api/update-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: session.user.id, status: 'offline' }),
        });
      } catch (error) {
        console.error('Failed to update user status:', error);
      }
    }
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <button className='ml-5 text-blue-500 font-semibold text-lg' onClick={handleSignOut}>Sign Out</button>
  );
};

export default SignOutButton;