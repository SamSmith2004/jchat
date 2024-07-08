import { signOut } from 'next-auth/react';

const SignOutButton = () => {
  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <button className='ml-5 text-blue-500 font-semibold text-lg' onClick={handleSignOut}>Sign Out</button>
  );
};

export default SignOutButton;