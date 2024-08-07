'use client'
import { Navbar } from "../components/navbar";
import Image from "next/image";
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/app/types/customSession';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Profile() {
    const { data: session, status } = useSession() as { data: CustomSession | null, status: "loading" | "authenticated" | "unauthenticated" };
    const { update } = useSession();
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState("No bio available");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

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
        if (session?.user?.banner) {
            setBannerPreview(session.user.banner);
        } else {
            setBannerPreview('https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
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

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBannerFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        const formData = new FormData();
        formData.append('username', username);
        formData.append('bio', bio);
        if (avatarFile && avatarFile !== null) {
            formData.append('avatar', avatarFile);
        }
        if (bannerFile) {
            formData.append('banner', bannerFile);
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
                        avatar: updatedProfile.avatar,
                        banner: updatedProfile.banner
                    }
                });
                console.log('Updated session:', session);
                router.refresh();
                console.log('Profile updated successfully:', updatedProfile);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    }

    const avatarSrc = avatarPreview || '/uploads/default-avatar.png';

    if (status === "loading") {
        return <div className="flex justify-center items-center h-screen">
            <p className="text-blue-500 text-2xl">Loading profile...</p>
        </div>;
    }

    if (status === "unauthenticated") {
        router.push('/login');
        return null;
    }

    return (
        <main className="flex flex-col">
            <Navbar />
            <div className="flex flex-col items-center">
                <div className="w-full h-40 relative overflow-hidden">
                    <Image 
                        src={bannerPreview || 'https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                        layout="fill"
                        objectFit="cover"
                        alt="User banner"
                        className="border-b-2 border-blue-800"
                        onError={() => setBannerPreview('https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')}
                    />
                </div>
            <div className="flex items-center z-10 -mt-16">
                <div className="rounded-full border-4 border-blue-900 overflow-hidden">
                    <Image 
                        src={avatarSrc}
                        alt="User profile image"
                        width={120}
                        height={120}
                        onError={() => setAvatarPreview('/uploads/default-avatar.png')}
                    />
                </div>
                <h1 className="text-5xl text-blue-500 mt-12 ml-5">{username || 'unknown'}!</h1>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
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
                    <label className="text-2xl text-blue-500">Banner</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerChange}
                        ref={bannerInputRef}
                        className="hidden"
                    />
                    <button 
                        type="button"
                        onClick={() => bannerInputRef.current?.click()}
                        className="hover:font-bold mt-4 px-4 py-2 bg-gray-900 border border-blue-900 text-blue-500 font-semibold rounded text-lg"
                    >
                        Change Banner
                    </button>
                </div>
                <div className="flex flex-col items-center">
                    <button 
                        type="submit" 
                        className="hover:font-extrabold w-1/2 mt-4 px-2 py-2 bg-gray-900 border border-blue-900 text-blue-600 font-semibold rounded text-lg disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
            </div>
        </main>
    );
}