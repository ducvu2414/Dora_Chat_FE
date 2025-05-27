import React from 'react';

const ConnectingOverlay = ({ avatar, partnerName }) => {
    return (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
            <img
                src={avatar || 'https://picsum.photos/id/237/200/300'}
                alt="Partner Avatar"
                className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-white"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://picsum.photos/id/237/200/300';
                }}
            />
            <h2 className="text-white text-2xl font-semibold mb-2">{partnerName || 'Đang kết nối...'}</h2>
            <p className="text-gray-300">Đang chờ người khác tham gia cuộc gọi...</p>
        </div>
    );
};

export default ConnectingOverlay;
