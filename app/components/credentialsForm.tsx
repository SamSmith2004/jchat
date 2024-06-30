'use client';

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CredentialsFormProps {
    csrfToken?: string;
}
interface signInResponse {
    error: string | null;
}

export function CredentialsForm(props : CredentialsFormProps) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const signInResponse = await signIn('credentials', {
            email: data.get('email'),
            password: data.get('password'),
            redirect: false,
        });

        if (signInResponse && !signInResponse.error) {
            router.push('/home');
        } else {
            console.error('Error:', signInResponse?.error);
            setError("Your Email or Password is incorrect.");
        }

    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 text-blue-500 font-bold">
            {error && (
                <span>
                {error}
                </span>
            )}
            <div>
                <label htmlFor="email" className="block text-lg">Email</label>
                <input 
                type="email" 
                name="email" 
                placeholder="Email@example.com" 
                required
                className="mt-2 rounded-sm p-3 text-lg w-full max-w-xs text-black" 
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-lg">Password</label>
                <input 
                type="password" 
                name="password" 
                placeholder="Password"
                required
                className="mt-2 rounded-sm p-3 text-lg w-full max-w-xs text-black" />
            </div>
            <button type="submit" className="mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded text-lg">Sign Up</button>
        </form>
    )
};