'use client';
import { Navbar } from "../components/navbar";
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type ListType = "account" | "appearance" | "notifications" | "privacy";

export default function Settings() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [listType, setListType] = useState<ListType>("account");

    useEffect(() => {
        const paramValue = searchParams.get("list");
        const newListType = isValidListType(paramValue) 
        ? paramValue 
        : "account"; 
        setListType(newListType); 
    }, [searchParams]);

    function isValidListType(value: string | null): value is ListType {
        // Type assertion, checkks if value is a ListType
        return ["account" , "appearance" , "notifications" , "privacy"].includes(value as ListType);
    }

    function updateListType(newListType: ListType) {
        router.push(`/settings?list=${newListType}`); // Update URL
    }

    function renderSettingsList() {
        switch (listType) {
            case "appearance":
                return <AppearanceSettings />;
            case "notifications":
                return <NotifSettings />;
            case "privacy":
                return <PrivacySettings />;
            default:
                return <AccountSettings />;
        }
    }

    function AccountSettings() {
        return (
            <>
            <h1 className="text-blue-500 text-4xl font-extrabold ">Account Settings</h1>
            <form>
                <label className="text-blue-500 text-xl font-bold mr-2">Username:</label>
                <input type="text" placeholder="Username" 
                className="border-2 border-blue-900 rounded-md bg-gray-900 text-blue-400 
                placeholder:text-blue-400 mt-2 w-96 p-2" />
                <button className="ml-2 mt-5 px-2 py-1 bg-gray-900 border border-blue-900 text-blue-500 font-semibold rounded text-lg">Update</button>
            </form>
            <form>
                <label className="text-blue-500 text-xl font-bold mr-2 ml-10">Email:</label>
                <input type="text" placeholder="Email" 
                className="border-2 border-blue-900 rounded-md bg-gray-900 text-blue-400 
                placeholder:text-blue-400 mt-2 w-96 p-2" />
                <button className="ml-2 mt-5 px-2 py-1 bg-gray-900 border border-blue-900 text-blue-500 font-semibold rounded text-lg">Update</button>
            </form>
            <form>
                <label className="text-blue-500 text-xl font-bold mr-2">Phone No:</label>
                <input type="text" placeholder="Phone Number" 
                className="border-2 border-blue-900 rounded-md bg-gray-900 text-blue-400 
                placeholder:text-blue-400 mt-2 w-96 p-2" />
                <button className="ml-2 mt-5 px-2 py-1 bg-gray-900 border border-blue-900 text-blue-500 font-semibold rounded text-lg">Update</button>
            </form>
            <div>
                <h2 className="mt-5 text-blue-500 text-2xl font-bold mb-2">Change Password</h2>
                <form className="flex flex-col">
                    <label className="text-blue-500 text-xl font-bold mr-2">Old Password:</label>
                    <input type="password" placeholder="Old Password" 
                    className="border-2 border-blue-900 rounded-md bg-gray-900 text-blue-400 
                    placeholder:text-blue-400 mt-2 w-96 p-2" />
                    <label className="text-blue-500 text-xl font-bold mr-2 mt-2">New Password:</label>
                    <input type="password" placeholder="New Password" 
                    className="border-2 border-blue-900 rounded-md bg-gray-900 text-blue-400 
                    placeholder:text-blue-400 mt-2 w-96 p-2" />
                    <button className="mt-5 px-2 py-1 bg-gray-900 border border-blue-900 text-blue-500 font-semibold rounded text-lg mb-5 w-full">Update</button>
                </form>
            </div>
            <h1 className="text-blue-500 text-2xl font-bold mb-2">Account Removal</h1>
            <p className="text-blue-400 text-lg font-bold mb-2">
                Disabling your account means you can recover it at any time after taking this action</p>
            <div className="flex gap-10">
                <button className="text-white bg-gray-900 rounded-md px-5 py-2 border border-red-500">Disable</button>
                <button className="text-white bg-red-500 rounded-md px-5 py-2 border border-gray-900">Delete</button>
            </div>
            </>
        );
    }

    function AppearanceSettings() {
        return (
            <>
            <form>
                <label className="text-blue-500">Appearance</label>
                <input type="text" placeholder="Username" />
                <button>Appearance</button>
            </form>
            </>
        );
    }

    function NotifSettings() {
        return (
            <>
            <form>
                <label className="text-blue-500">Notif</label>
                <input type="text" placeholder="Username" />
                <button>Notif</button>
            </form>
            </>
        );
    }

    function PrivacySettings() {
        return (
            <>
            <form>
                <label className="text-blue-500">Privacy</label>
                <input type="text" placeholder="Username" />
                <button>Privacy</button>
            </form>
            </>
        );
    }

    return (
        <main className="flex flex-col">
            <Navbar />
            <div className="flex justify-between items-start"> 
                <div className='flex space-y-5 flex-col border-r border-blue-900 pt-5 pr-24 pl-10 text-blue-300 h-screen'>
                    <h1 className='text-blue-500 font-bold text-2xl'>Settings</h1>
                    <h2 className="text-xl" id="account" onClick={() => updateListType("account")}>Account</h2>
                    <h2 className="text-xl" id="appearance" onClick={() => updateListType("appearance")}>Appearance</h2>
                    <h2 className="text-xl" id="notifications" onClick={() => updateListType("notifications")}>Notifications</h2>
                    <h2 className="text-xl" onClick={() => updateListType("privacy")}>Privacy</h2>
                </div>
                <div className='flex flex-col space-y-5 items-center text-blue-500 h-screen w-4/5 mt-5'>
                    {renderSettingsList()}
                </div>
            </div>
        </main>
    );
}