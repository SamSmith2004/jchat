'use client';
import { Navbar } from '../components/navbar';
import Image from 'next/image';
import { useEffect } from 'react';
import SignOutButton from '../components/login/signOut';
import { useSession } from 'next-auth/react'

export default function Home() {
    const { data: session } = useSession()

    function GetMemberList() {
        return (
            <>
            <h2 className='text-blue-300 text-lg'>sample member</h2>
            <h2 className='text-blue-300 text-lg'>sample member2</h2>
            <h2 className='text-blue-300 text-lg'>sample member3</h2>
            </>
        );
    }

    function getServerList() {
        return (
            <>
            {/*<h1 className='text-blue-300 text-lg'>Server</h1>*/}
            </>
        );
    }

    function getPosts() {
        if (true) {
            return (
                <>
                <h1 className='text-blue-300 text-lg'>No posts to fetch</h1>
                </>
            );
        }

        return (
            <>
            <h1 className='text-blue-300 text-lg'>Sample posts</h1>
            </>
        );
    }

    useEffect(() => {
        GetMemberList();
        getPosts();
        getServerList();
    }, []);

    return (
        <main className="flex flex-col">
            <Navbar />
            <div className="flex justify-between items-start"> 
            <div className='flex space-y-10 flex-col border-r border-blue-900 pt-5 pr-10 pl-10 text-blue-500 h-screen'>
                <h1 className='text-blue-500 font-bold text-2xl'>Nav</h1>
                <div className="m-5">
                    <Image src="/logo-placeholder.png" alt="placeholder" height={30} width={30}/>
                </div>
                <div className="m-5">
                    <Image src="/logo-placeholder.png" alt="placeholder2" height={30} width={30}/>
                </div>
                <div className="m-5">
                    <Image src="/logo-placeholder.png" alt="placeholder3" height={30} width={30}/>
                </div>
            </div>
            <div>
                <h1 className='text-blue-500 font-bold text-2xl mt-5'>Posts</h1>
                <div className='flex justify-center'>
                    {getPosts()}
                </div>
            </div>
            <div className='flex space-y-5 flex-col pt-5 pr-1- pl-10 border-l border-blue-900 h-screen'>
                <h1 className='text-blue-500 font-bold mr-10 text-2xl'>Member List</h1>
                {GetMemberList()}
            </div>
        </div>
        </main>
    );
}