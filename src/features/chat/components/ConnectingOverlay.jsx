import React from 'react';
import { PhoneOff } from 'lucide-react';

const ConnectingOverlay = ({ avatar, partnerName, onCancel }) => {
    return (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
            <img
                src={avatar || 'https://picsum.photos/id/237/200/300'}
                alt="Partner Avatar"
                className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-white"
            />
            <h2 className="text-white text-2xl font-semibold mb-2">{partnerName || 'Đang kết nối...'}</h2>
            <p className="text-gray-300 mb-4">Đang chờ người khác tham gia cuộc gọi...</p>
            <button
                onClick={onCancel}
                className="p-4 rounded-full bg-red-600 flex items-center justify-center"
            >
                <PhoneOff className="w-6 h-6 text-white" />
            </button>
        </div>
    );
};

export default ConnectingOverlay;
