'use client';
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/types/customSession';
import { useEffect, useState } from 'react';

export default function AccountSettings() {
    const { data: session } = useSession() as { data: CustomSession | null };
    const { update } = useSession();
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<number | string | null>(null);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (session?.user?.email) {
            setEmail(session.user.email);
        }
        if (session?.user?.phone) {
            setPhone(session.user.phone);
        }
    }, [session]);

    const handleUpdateEmail = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session) return; 

        const formData = new FormData();
        formData.append('email', email);

        try {
            const response = await fetch('/api/settings/account/email', {
                method: 'PUT',
                body: formData
            })
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update email');
            }

            const { email: newEmail, message } = await response.json();;

            setEmail(newEmail);

            await update({
                ...session,
                user: {
                    ...session?.user,
                    email: newEmail
                }
            });
            
            setSuccessMessage(message || 'Email updated successfully');
        } catch (error) {
            console.error('Failed to fetch email');
            setError(error instanceof Error ? error.message : 'Failed to update email. Please try again.');
        }
    }

    const handleUpdatePhone = async (e: React.FormEvent) => {
        e.preventDefault();
        if (phone === null) return;
        const formData = new FormData();
        formData.append('phone', phone.toString());

        try {
            const response = await fetch('/api/settings/account/phone', {
                method: 'PUT',
                body: formData
            })
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update phone num');
            }

            const { phone: newPhone, message } = await response.json();
            setPhone(newPhone ? Number(newPhone) : null);
            setPhone(newPhone);
            
            await update({
                ...session,
                user: {
                    ...session?.user,
                    phone: newPhone
                }
            });
            setSuccessMessage(message || 'Phone number updated successfully');

        } catch (error) {
            console.error('Failed to fetch phone');
            setError('Failed to update phone number. Please try again.')
        }
    }

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) return;
        if (!oldPassword || !newPassword) {
            setError('Please enter both old and new passwords');
            return;
        }
        if (oldPassword === newPassword) {
            setError('Old and new passwords cannot be the same');
            return;
        }

        const formData = new FormData();
        formData.append('oldPassword', oldPassword);
        formData.append('newPassword', newPassword);

        try {
            const response = await fetch('/api/settings/account/password', {
                method: 'PUT',
                body: formData
            })
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update password');
            }

            setSuccessMessage('Password updated successfully');
        } catch (error) {
            console.error('Failed to fetch password');
            setError('Failed to update password. Please try again.');
        };
    };

    const handleDisableAccount = async () => {
        // TODO: Implement account disable logic
        console.log('Disabling account');
      };
      
      const handleDeleteAccount = async () => {
        // TODO: Implement account delete logic
        console.log('Deleting account');
      };

    return (
        <>
            <h1 className="text-blue-500 text-4xl font-extrabold ">Account Settings</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {successMessage && <p className="text-white mb-4">{successMessage}</p>}
            <form onSubmit={handleUpdateEmail}>
                <label className="text-blue-500 text-xl font-bold mr-2 ml-10">Email:</label>
                <input
                type="text"
                placeholder={session?.user.email || "Email"}
                value={email || ''}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 border-blue-900 rounded-md bg-gray-900 text-blue-400 
                placeholder:text-blue-400 mt-2 w-96 p-2"
                />
                <button 
                className="ml-2 mt-5 px-2 py-1 bg-gray-900 border border-blue-900 text-blue-500 font-semibold rounded text-lg"
                type="submit"
                >
                Update
                </button>
            </form>
            <form onSubmit={handleUpdatePhone}>
                <label className="text-blue-500 text-xl font-bold mr-2">Phone No:</label>
                <input
                type="text"
                placeholder="Phone Number"
                value={phone || ''}
                onChange={(e) => setPhone(Number(e.target.value))}
                className="border-2 border-blue-900 rounded-md bg-gray-900 text-blue-400 
                placeholder:text-blue-400 mt-2 w-96 p-2"
                />
                <button 
                className="ml-2 mt-5 px-2 py-1 bg-gray-900 border border-blue-900 text-blue-500 font-semibold rounded text-lg"
                type="submit"
                >
                Update
                </button>
            </form>
            <div>
                <h2 className="mt-5 text-blue-500 text-2xl font-bold mb-2">Change Password</h2>
                <form className="flex flex-col" onSubmit={handleUpdatePassword}>
                    <label className="text-blue-500 text-xl font-bold mr-2">Old Password:</label>
                    <input
                        type="password"
                        placeholder="Old Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="border-2 border-blue-900 rounded-md bg-gray-900 text-blue-400 
                        placeholder:text-blue-400 mt-2 w-96 p-2"
                    />
                    <label className="text-blue-500 text-xl font-bold mr-2 mt-2">New Password:</label>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="border-2 border-blue-900 rounded-md bg-gray-900 text-blue-400 
                        placeholder:text-blue-400 mt-2 w-96 p-2"
                    />
                    <button
                        type="submit"
                        className="mt-5 px-2 py-1 bg-gray-900 border border-blue-900 text-blue-500 font-semibold rounded text-lg mb-5 w-full"
                    >
                        Update
                    </button>
                </form>
            </div>
            <h1 className="text-blue-500 text-2xl font-bold mb-2">Account Removal</h1>
            <p className="text-blue-400 text-lg font-bold mb-2">
                Disabling your account means you can recover it at any time after taking this action</p>
            <div className="flex gap-10">
                <button onClick={handleDisableAccount} 
                className="text-white bg-gray-900 rounded-md px-5 py-2 border border-red-500">
                    Disable
                </button>
                <button 
                onClick={handleDeleteAccount} 
                className="text-white bg-red-500 rounded-md px-5 py-2 border border-gray-900">
                    Delete
                </button>
            </div>
            </>
    );
}