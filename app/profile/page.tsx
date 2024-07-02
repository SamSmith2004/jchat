import { Navbar } from "../components/navbar";
import Image from "next/image";

import { getServerSession } from "next-auth";
import { authConfig} from "@/lib/auth";

export default async function Profile() {
    const session = await getServerSession(authConfig);

    return (
        <main className="flex flex-col">
            <Navbar />
            <div className="flex flex-col items-center mt-5">
                {session?.user?.image && 
                <div className="rounded-full border-2 border-blue-900 overflow-hidden">
                    <Image src={session?.user?.image} alt="User profile image" 
                    height={100} width={100}
                    />
                </div>}
                <h1 className="text-5xl text-blue-500 mt-5">Welcome back {session?.user?.name || 'unknown'}!</h1>
            </div>
        </main>
    );
}