import Image from 'next/image';

export default function Blocked() {
    return (
        <>
        <div className="flex space-x-5">
            <Image src="/circle.png" alt="placeholder" height={40} width={50}/>
            <h2 className='text-blue-300 text-2xl'>sample user</h2>
        </div>
        <div className="flex space-x-5">
            <Image src="/circle.png" alt="placeholder" height={40} width={50}/>
            <h2 className='text-blue-300 text-2xl'>sample user2</h2>
        </div>
        <div className="flex space-x-5">
            <Image src="/circle.png" alt="placeholder" height={40} width={50}/>
            <h2 className='text-blue-300 text-2xl'>sample user3</h2>
        </div>
        </>
    );
}