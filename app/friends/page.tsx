'use client';
import { Navbar } from "../components/navbar";
import OnlineFriends from "@/app/components/friendLists/onlineFriends";
import AllFriends from "@/app/components/friendLists/allFriends";
import PendingFriends from "@/app/components/friendLists/pendingFriends";
import Blocked from "@/app/components/friendLists/blocked";
import AddFriend from "@/app/components/friendLists/addFriends";

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation' 

type ListType = "online" | "all" | "pending" | "blocked" | "add"; // Define the list types

export default function Friends() { 
    const router = useRouter()
    const searchParams = useSearchParams()
    const [listType, setListType] = useState<ListType>("online");

    useEffect(() => {
        const paramValue = searchParams.get("list");
        const newListType = isValidListType(paramValue) 
        ? paramValue 
        : "online"; // Set default list type to online
        setListType(newListType); 
    }, [searchParams]); // Update Document when searchParams change

    function isValidListType(value: string | null): value is ListType {
        // Type assertion, checkks if value is a ListType
        return ["online", "all", "pending", "blocked", "add"].includes(value as ListType);
    }

    function updateListType(newListType: ListType) {
        router.push(`/friends?list=${newListType}`); // Update URL
    }

    function renderFriendList() {
        switch (listType) {
            case "all":
                return <AllFriends />;
            case "pending":
                return <PendingFriends />;
            case "blocked":
                return <Blocked />;
            case "add":
                return <AddFriend />;
            default:
                return <OnlineFriends />;
        }
    }

    return (
        <main className="flex flex-col">
            <Navbar />
            <div className="flex justify-between items-start"> 
                <div className='flex space-y-5 flex-col border-r border-blue-900 pt-5 pr-20 pl-10 text-blue-500 h-screen w-1/5'>
                    <h1 className='text-blue-500 font-bold text-2xl'>Friends</h1>
                    <h2 className='text-blue-300 text-lg' id="online" onClick={() => updateListType("online")}>Online</h2>
                    <h2 className='text-blue-300 text-lg' id="all" onClick={() => updateListType("all")}>All</h2>
                    <h2 className='text-blue-300 text-lg' id="pending" onClick={() => updateListType("pending")}>Pending</h2>
                    <h2 className='text-blue-300 text-lg' id="blocked" onClick={() => updateListType("blocked")}>Blocked</h2>
                    <h2 className='text-blue-300 text-lg' onClick={() => updateListType("add")}>Add Friend+</h2>
                </div>
                <div className='flex flex-col space-y-5 items-center text-blue-500 h-screen w-4/5 mt-5'>
                    {renderFriendList()}
                </div>
            </div>
        </main>
    );
}