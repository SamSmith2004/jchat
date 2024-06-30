'use client';

import { signIn } from "next-auth/react";
import Image from "next/image";

export function GoogleSignInButton() {
    const handleClick = () => {
        signIn("google", { callbackUrl: "/home" });
    };
    

    return (
        <button
            onClick={handleClick}
            className="w-full flex bg-white mt-4 mb-4 px-6 py-3 bg-whit border-2 border-black rounded-lg text-lg"
            >
            <Image src="/googlelogo.png" alt="Google Logo" width={20} height={25} className="mr-1"></Image>
            <span className="text-blue-500 font-semibold">Continue with Google</span>
        </button>
    );
}

export function GoogleSignUpButton() {
    const handleClick = () => {
        signIn("google", { callbackUrl: "/home" });
    };
    

    return (
        <button
            onClick={handleClick}
            className="w-full flex bg-white mt-4 mb-4 px-6 py-3 bg-whit border-2 border-black rounded-lg text-lg"
            >
            <Image src="/googlelogo.png" alt="Google Logo" width={20} height={30} className="mr-1"></Image>
            <span className="text-blue-500 font-semibold">Continue with Google</span>
        </button>
    );
}