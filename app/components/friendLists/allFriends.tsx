import Image from 'next/image';

export default function AllFriends() {
    let status = "online";
    let status2 = "offline";
    let status3 = "idle";

    return (
        <>
        <div className="flex space-x-5">
            <Image src="/circle.png" alt="placeholder" height={40} width={70}/>
            <h2 className='text-blue-300 text-2xl'>sample friend <br></br>{status}</h2>
        </div>
        <div className="flex space-x-5">
            <Image src="/circle.png" alt="placeholder" height={40} width={70}/>
            <h2 className='text-blue-300 text-2xl'>sample friend2 <br></br>{status2}</h2>
        </div>
        <div className="flex space-x-5">
            <Image src="/circle.png" alt="placeholder" height={40} width={70}/>
            <h2 className='text-blue-300 text-2xl'>sample friend3 <br></br>{status3}</h2>
        </div>
        </>
    );
}