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
            <form>
                <label className="text-blue-500">Account</label>
                <input type="text" placeholder="Username" />
                <button>Account</button>
            </form>
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