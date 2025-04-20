import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearIncomingCall, setCallStarted } from "../../features/chat/callSlice";
import { SOCKET_EVENTS } from "../../utils/constant";
import { socket } from "../../utils/socketClient";

export default function IncomingCallModal() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const incomingCall = useSelector((state) => state.call.incomingCall);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!incomingCall) return null;

    const handleAccept = () => {
        dispatch(
            setCallStarted({
                type: incomingCall.type,
                conversationId: incomingCall.conversationId,
                peerId: incomingCall.peerId,
                userId: user._id,
                initiator: false,
                fromName: incomingCall.fromName,
            })
        );
        console.log("🚀 ~ file: IncomingCallModal.jsx:20 ~ handleAccept ~ incomingCall:", incomingCall);
        dispatch(clearIncomingCall());
        navigate(`/call/${incomingCall.conversationId}?type=${incomingCall.type}`);
    };

    const handleReject = () => {
        socket.emit(SOCKET_EVENTS.REJECT_CALL, {
            conversationId: incomingCall.conversationId,
            userId: user._id,
        });
        dispatch(clearIncomingCall());
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-xl font-bold mb-2">📞 Cuộc gọi đến</h2>
                <p className="mb-4">Bạn có cuộc gọi {incomingCall.type} từ {incomingCall.fromName}</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={handleAccept}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Chấp nhận
                    </button>
                    <button
                        onClick={handleReject}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Từ chối
                    </button>
                </div>
            </div>
        </div>
    );
}
