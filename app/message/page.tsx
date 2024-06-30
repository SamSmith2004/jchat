'use client';
import { Navbar } from "../components/navbar";
import { useEffect } from "react";

export default function Message() {

    function GetLastMessaged() {
        return (
            <>
            <h2 className='text-blue-300 text-lg'>sample user</h2>
            <h2 className='text-blue-300 text-lg'>sample user2</h2>
            <h2 className='text-blue-300 text-lg'>sample user3</h2>
            </>
        );
    }

    useEffect(() => {
        GetLastMessaged();
    }, []);

    return (
        <main className="flex flex-col">
            <Navbar />
            <div className="flex justify-between items-start"> 
                <div className='flex space-y-5 flex-col border-r border-blue-900 pt-5 pr-20 pl-10 text-blue-500 h-screen'>
                    <h1 className='text-blue-500 font-bold text-2xl'>Direct Messages</h1>
                    {GetLastMessaged()}
                </div>
            </div>
        </main>
    );
}