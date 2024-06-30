import { GoogleSignInButton } from "@/app/components/authButton";
import { GoogleSignUpButton } from "@/app/components/authButton"
//import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { Navbar } from './components/navbar';
import { CredentialsForm } from './components/credentialsForm';
import { getCsrfToken } from 'next-auth/react';
import SignUpForm from "./components/signUpForm";

export default function SignIn() {

    return (
        <main>
            <Navbar />
            <h1 className="flex justify-center items-center text-blue-500 text-5xl mt-15 font-extrabold mt-10">Welcome to JayChat</h1>
            <div className="flex justify-center items-center mt-10">
                <div className='flex'>
                <div className="border border-blue-900 bg-gray-900 h-auto w-auto flex flex-col items-center p-10 rounded shadow-blue-800">
                    <h3 className="text-blue-500 text-3xl font-bold mb-6">Sign In</h3>
                    <GoogleSignInButton />
                    <span className='text-blue-500 text-xl font-bold'>OR</span>
                    <CredentialsForm />
                </div>
                <div className='w-1/12'></div>
                <div className="border border-blue-900 bg-gray-900 h-auto w-auto flex flex-col items-center p-10 rounded shadow-blue-800">
                    <h3 className="text-blue-500 text-3xl font-bold mb-6">Sign Up</h3>
                    <GoogleSignUpButton />
                    <span className='text-blue-500 text-xl font-bold'>OR</span>
                    <SignUpForm />
                </div>
                </div>
            </div>
        </main>
    );
}