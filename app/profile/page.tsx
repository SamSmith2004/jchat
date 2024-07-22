'use client'
import { Navbar } from "../components/navbar";
import Image from "next/image";
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/types/customSession';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Profile() {
    const { data: session} = useSession() as { data: CustomSession | null};
    const { update } = useSession();
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState("No bio available");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (session?.user?.username) {
            setUsername(session.user.username);
        } else if (session?.user?.name) {
            setUsername(session.user.name);
        }
        if (session?.user?.bio) {
            setBio(session.user.bio);
        }
        if (session?.user?.avatar) {
            setAvatarPreview(session.user.avatar);
        } else {
            setAvatarPreview('/uploads/default-avatar.png');
        }
        //console.log('Avatar preview:', avatarPreview);
    }, [session]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; 
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader(); 
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file); 
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        formData.append('bio', bio);
        if (avatarFile && avatarFile !== null) {
            formData.append('avatar', avatarFile);
        }

        try {
            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                body: formData,
            });

            if (response.ok) {
                const updatedProfile = await response.json();
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        username: updatedProfile.Username,
                        bio: updatedProfile.bio,
                        avatar: updatedProfile.avatar
                    }
                });
                router.refresh();
                console.log('Profile updated successfully:', updatedProfile);
            } else {
                console.error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    }

    const avatarSrc = avatarPreview || '/uploads/default-avatar.png';

    return (
        <main className="flex flex-col">
            <Navbar />
            <div className="flex flex-col items-center mt-5">
                <div className="rounded-full border-2 border-blue-900 overflow-hidden">
                    <Image 
                        src={avatarSrc}
                        alt="User profile image"
                        width={100}
                        height={100}
                        onError={() => setAvatarPreview('/default-avatar.png')}
                    />
                </div>
                <h1 className="text-5xl text-blue-500 mt-5">Welcome back {username || 'unknown'}!</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-5">
                    <div className="flex flex-col items-center">
                        <label className="text-2xl text-blue-500">Username</label>
                        <input
                            className="border-2 border-blue-900 rounded-md bg-gray-900 text-blue-400 placeholder:text-blue-400 mt-2 w-96 p-2"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <label className="text-2xl text-blue-500">About Me</label>
                        <textarea
                            className="resize-none border-2 border-blue-900 rounded-md bg-gray-900 text-blue-400 placeholder:text-blue-400 mt-2 w-96 h-32 pt-2 pl-2"
                            placeholder="Tell us about yourself"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <label className="text-2xl text-blue-500">Avatar</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            ref={fileInputRef}
                            className="hidden"
                        />
                        <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="hover:font-bold mt-4 px-4 py-2 bg-gray-900 border border-blue-900 text-blue-500 font-semibold rounded text-lg"
                        >
                            Change Avatar
                        </button>
                    </div>
                    <div className="flex flex-col items-center">
                        <button type="submit" className="hover:font-extrabold w-1/2 mt-4 px-2 py-2 bg-gray-900 border border-blue-900 text-blue-600 font-semibold rounded text-lg">Save</button>
                    </div>
                </form>
            </div>
        </main>
    );
}