import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearIncomingCall } from '../../features/chat/callSlice';

const IncomingCallModal = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const call = useSelector(state => state.call.incomingCall);

    if (!call) return null;

    const handleAccept = () => {
        navigate(`/call/${call.conversationId}?type=${call.type}`);
        dispatch(clearIncomingCall());
    };

    const handleReject = () => {
        dispatch(clearIncomingCall());
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            <div className="bg-white p-6 rounded shadow-lg text-center w-80">
                <h2 className="text-xl font-semibold mb-2">Cuộc gọi đến</h2>
                <p className="text-gray-600 mb-4">Bạn có cuộc gọi {call.type === 'video' ? 'video' : 'audio'} đến</p>
                <div className="flex justify-center space-x-4">
                    <button onClick={handleAccept} className="bg-green-500 text-white px-4 py-2 rounded">Chấp nhận</button>
                    <button onClick={handleReject} className="bg-red-500 text-white px-4 py-2 rounded">Từ chối</button>
                </div>
            </div>
        </div>
    );
};

export default IncomingCallModal;
