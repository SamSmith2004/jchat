import Link from "next/link";
import Image from "next/image";
import SignOutButton from "./login/signOut";

export function Navbar() {
  return (
    <nav className="flex justify-between items-center p-5 border-b border-blue-900 ">
      <div className="flex items-center">
        <Link href="/home">
          <Image src="/home.png" alt="home" width={40} height={30} />
        </Link>
        <SignOutButton />
      </div>
      <ul className="flex list-none m-0 p-0 text-xl font-bold">
        <li className="mr-6">
          <Link href="/message" className="text-blue-500 hover:text-blue-800">
            Message
          </Link>
        </li>
        <li className="mr-6">
          <Link href="/friends" className="text-blue-500 hover:text-blue-800">
            Friends
          </Link>
        </li>
        <li className="mr-6">
          <Link href="/profile" className="text-blue-500 hover:text-blue-800">
            Profile
          </Link>
        </li>
        <li>
          <Link href="/settings">
            <Image
              src="/settings-icon.jpg"
              alt="Settings"
              width={30}
              height={30}
            />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
