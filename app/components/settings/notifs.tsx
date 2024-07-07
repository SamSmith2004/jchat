import React, { useState } from 'react';

const NotifsSettings: React.FC = () => {
    const [notifEnabled, setNotifEnabled] = useState(true);
    function toggleNotifs() {
        //Will Add logic to disable notifications here later

        setNotifEnabled(!notifEnabled);
    }
    return (
        <>
            <h1 className="text-blue-500 text-4xl font-extrabold ">Notification Settings</h1>
            <div className="flex gap-2">
                <h2 className="text-blue-500 text-xl font-bold mt-1">Notifications:</h2>
                <button 
                className="px-2 py-1 bg-gray-900 border border-blue-900 text-blue-500 font-semibold rounded text-lg"
                onClick={toggleNotifs}
                >{notifEnabled ? 'Disable' : 'Enable'}</button>
            </div>
        </>
    );
}

export default NotifsSettings;