

const AppearanceSettings = () => {
    const setDarkmode = () => {
        console.log('Dark Mode');
    }

    const setLightmode = () => {
        console.log('Light Mode');
    }

    return (
        <>
            <h1 className="text-blue-500 text-2xl font-semibold">Appearance Settings</h1>
            <div className="flex flex-col">
                <label className="text-blue-500 text-lg font-semibold">Display Options:</label>
                <div className="flex space-x-5">
                    <button 
                    className="rounded-md bg-gray-900 text-blue-500 border border-blue-900 mt-2 p-1 text-lg hover:font-semibold hover:bg-gray-800"
                    onClick={setDarkmode}
                    >Dark Mode
                    </button>
                    <button 
                    className="rounded-md bg-blue-500 text-white border border-blue-500 mt-2 p-1 hover:font-semibold hover:bg-blue-600"
                    onClick={setLightmode}
                    >Light Mode
                    </button>
                </div>
            </div>
        </>
    );
}

export default AppearanceSettings;