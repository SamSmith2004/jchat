import { signOut } from 'next-auth/react';

const SignOutButton = () => {
  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <button className='px-6 py-3 bg-blue-500 text-white font-semibold rounded text-lg' onClick={handleSignOut}>Sign Out</button>
  );
};

export default SignOutButton;