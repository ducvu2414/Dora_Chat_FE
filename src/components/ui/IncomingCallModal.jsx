import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearIncomingCall, setCallStarted } from "../../features/chat/callSlice";
import { SOCKET_EVENTS } from "../../utils/constant";
import { socket } from "../../utils/socketClient";
import ringtoneFile from "../../assets/ringtone.mp3";

export default function IncomingCallModal() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const incomingCall = useSelector((state) => state.call.incomingCall);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const ringtoneRef = useRef(new Audio(ringtoneFile));
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (incomingCall) {
            ringtoneRef.current.loop = true;
            ringtoneRef.current.play();

            timeoutRef.current = setTimeout(() => {
                handleReject(true);
            }, 30000);
        }

        return () => {
            ringtoneRef.current.pause();
            ringtoneRef.current.currentTime = 0;
            clearTimeout(timeoutRef.current);
        };
    }, [incomingCall]);

    const handleAccept = () => {
        ringtoneRef.current.pause();
        clearTimeout(timeoutRef.current);

        dispatch(setCallStarted({
            type: incomingCall.type,
            conversationId: incomingCall.conversationId,
            peerId: incomingCall.peerId,
            userId: user._id,
            initiator: false,
            fromName: incomingCall.fromName,
        }));
        dispatch(clearIncomingCall());
        navigate(`/call/${incomingCall.conversationId}?type=${incomingCall.type}`);
    };

    const handleReject = (auto = false) => {
        ringtoneRef.current.pause();
        clearTimeout(timeoutRef.current);

        socket.emit(SOCKET_EVENTS.REJECT_CALL, {
            conversationId: incomingCall.conversationId,
            userId: user._id,
            reason: auto ? "timeout" : "manual",
        });
        dispatch(clearIncomingCall());
    };

    if (!incomingCall) return null;

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
                        onClick={() => handleReject(false)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Từ chối
                    </button>
                </div>
            </div>
        </div>
    );
}
