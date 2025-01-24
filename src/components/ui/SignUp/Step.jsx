
// eslint-disable-next-line react/prop-types
export function Step({ label, icon, active = false }) {
    return (
        <div className="flex flex-col items-center space-y-2">
            <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                    }`}
            >
                {icon}
            </div>
            <div className="text-xs text-gray-500">{label}</div>
        </div>
    );
}