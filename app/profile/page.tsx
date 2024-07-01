import { Navbar } from "../components/navbar";

import { getServerSession } from "next-auth";
import { authConfig} from "@/lib/auth";

export default async function Profile() {
    const session = await getServerSession(authConfig);
    return (
        <main className="flex flex-col">
            <Navbar />
            <div className="flex flex-col items-center mt-5">
                <h1 className="text-5xl text-white">Welcome back {session?.user?.name || 'unknown'}!</h1>
                {session?.user?.image && <img src={session?.user?.image} alt="user image" />}
            </div>
        </main>
    );
}