'use client'
import { Navbar } from "../components/navbar";
import Image from "next/image";

import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/types/customSession';
import { useState, useEffect } from 'react';

export default function Profile() {
    const { data: session } = useSession() as { data: CustomSession | null };

    const [username, setUsername] = useState('');
    const [bio, setBio] = useState("No bio available");

    useEffect(() => {
        if (session?.user?.username) {
            setUsername(session.user.username);
        } else if (session?.user?.name) {
            setUsername(session.user.name);
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        //TODO: Add form submission logic
        console.log('Form submitted');
    };

    return (
        <main className="flex flex-col">
            <Navbar />
            <div className="flex flex-col items-center mt-5">
                {session?.user?.image && 
                <div className="rounded-full border-2 border-blue-900 overflow-hidden">
                    <Image src={session?.user?.image} alt="User profile image" 
                    height={100} width={100}
                    />
                </div>}
                <h1 className="text-5xl text-blue-500 mt-5">Welcome back {username || 'unknown'}!</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-5">
                    <div className="flex flex-col items-center">
                        <label className="text-2xl text-blue-500">Username</label>
                        <input 
                        className="border-2 border-blue-900 rounded-md bg-gray-900 text-blue-400 
                        placeholder:text-blue-400 mt-2 w-96 p-2"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <label className="text-2xl text-blue-500">About Me</label>
                        <textarea 
                        className="resize-none border-2 border-blue-900 rounded-md bg-gray-900 
                        text-blue-400 placeholder:text-blue-400 mt-2 w-96 h-32 pt-2 pl-2"
                        placeholder="Tell us about yourself"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <label className="text-2xl text-blue-500">Avatar</label>
                        {session?.user?.image && 
                        <div className="rounded-full border-2 border-blue-900 overflow-hidden mt-2">
                            <Image src={session?.user?.image} alt="User profile image" 
                            height={100} width={100}
                            />
                        </div>}
                        <button className="mt-4 px-4 py-2 bg-gray-900 border border-blue-900 text-blue-500 font-semibold rounded text-lg">Change Avatar</button>
                    </div>
                    <div className="flex flex-col items-center">
                        <button type="submit" className="w-1/2 mt-4 px-2 py-2 bg-gray-900 border border-blue-900 text-blue-600 font-semibold rounded text-lg">Save</button>
                    </div>
                </form>
            </div>
        </main>
    );
}