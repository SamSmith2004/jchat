'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/types/customSession'; 

export default function AddFriend() {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');

    const { data: session } = useSession() as { data: CustomSession | null };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        if (!username.trim()) {
            setMessage('Please enter a username');
            return;
        }

        try {
            // Get the user ID for the given username
            const userResponse = await fetch(`/api/users/getByUsername?username=${encodeURIComponent(username)}`);
            const userData = await userResponse.json();
            //console.log('User data received:', userData);

            if (!userResponse.ok) {
                setMessage(userData.error || 'Error fetching user');
                return;
            }

            if (!userData.id) {
                setMessage('User not found');
                return;
            }

            const currentUserId = session?.user.id;

            if (currentUserId === userData.id) {
                setMessage("You can't add yourself as a friend");
                return;
            }

            const requestData = { senderId: currentUserId, receiverId: userData.id };
            console.log('Sending friend request data:', requestData);

            // Send the friend request
            const response = await fetch('/api/friends/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData),
            });

            const result = await response.json();
            //console.log('Received response:', result);

            if (response.ok) {
                setMessage('Friend request sent successfully to ' + username);
                setUsername('');
            } else {
                setMessage(result.error || 'Failed to send friend request');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
            setMessage('An error occurred while sending the friend request');
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h1 className='font-bold text-2xl text-center mb-4'>Add a Friend!</h1>
                <div>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className='border border-gray-300 p-2 rounded-md rounded-r-none'
                    />
                    <button type="submit" className='hover:font-bold border border-blue-900 bg-gray-900 h-full rounded-md rounded-l-none p-2'>Add</button>
                </div>
            </form>
            <h2 className='font-bold text-lg'>{message && <p>{message}!</p>}</h2>
        </>
    );
}