

const AccountSettings = () => {

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

export default AccountSettings;