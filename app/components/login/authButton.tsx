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
            <Image 
            src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" 
            alt="Google Logo" 
            width={20} height={20} 
            className="mt-1.5 h-10 w-10"
            ></Image>
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
            <Image 
            src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" 
            alt="Google Logo" 
            width={30} height={20} 
            className="mt-1.5 h-10 w-10"
            ></Image>
            <span className="text-blue-500 font-semibold">Continue with Google</span>
        </button>
    );
}