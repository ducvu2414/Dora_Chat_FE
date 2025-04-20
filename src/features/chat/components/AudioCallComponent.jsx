import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import peerService from "../../../utils/peerService";
import { SOCKET_EVENTS } from "../../../utils/constant";
import { socket } from "../../../utils/socketClient";
import { endCall } from "../callSlice";
import { Mic, MicOff, PhoneOff } from "lucide-react";

export default function AudioCallComponent() {
    const dispatch = useDispatch();
    const { currentCall } = useSelector((state) => state.call);
    const [remoteStreams, setRemoteStreams] = useState({});
    const [isMuted, setIsMuted] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);
    const localAudioRef = useRef(null);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const partner =
        currentCall.conversation?.members?.find((m) => m.userId !== user._id) || {};
    const partnerName = partner?.name || "Đang kết nối...";
    const partnerAvatar = partner?.avatar || "";

    const didInitRef = useRef(false);

    useEffect(() => {
        const startCall = async () => {
            if (didInitRef.current) return;
            didInitRef.current = true;

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log("🎧 Local stream ready");

            await peerService.init({
                userId: user._id,
                conversationId: currentCall.conversationId,
                stream,
                initiator: currentCall.initiator,
                type: "audio",
            });

            console.log("📡 peerService initialized");
            peerService.setOnRemoteStream((stream, partnerId) => {
                setRemoteStreams((prev) => ({
                    ...prev,
                    [partnerId]: stream,
                }));
                setIsConnecting(false);
            });

            localAudioRef.current.srcObject = stream;
        };

        startCall();

        return () => {
            peerService.endCall();
        };
    }, []);


    const toggleMute = () => {
        const muted = peerService.toggleAudio();
        setIsMuted(muted);
    };

    const handleEndCall = () => {
        socket.emit(SOCKET_EVENTS.END_CALL, {
            conversationId: currentCall.conversationId,
            userId: currentCall.userId,
        });
        dispatch(endCall());
    };

    return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white relative">
            {isConnecting && (
                <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
                    <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center mb-4">
                        <Mic className="h-12 w-12 text-white" />
                    </div>
                    <h2 className="text-white text-2xl font-semibold mb-2">
                        {partnerName}
                    </h2>
                    <p className="text-gray-300">Đang kết nối...</p>
                </div>
            )}

            {/* Local Audio (muted) */}
            <audio ref={localAudioRef} autoPlay muted />

            {/* Remote Audio */}
            {Object.entries(remoteStreams).map(([id, stream]) => (
                <audio
                    key={id}
                    autoPlay
                    ref={(el) => {
                        if (el) el.srcObject = stream;
                    }}
                />
            ))}

            {/* UI Info + Controls */}
            <div className="flex flex-col items-center justify-center mt-12">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-6">
                    {partnerAvatar ? (
                        <img
                            src={partnerAvatar}
                            alt={partnerName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">
                                {partnerName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>
                <h2 className="text-xl font-semibold mb-2">{partnerName}</h2>
                <p className="text-gray-400 mb-6">Cuộc gọi âm thanh</p>

                <div className="flex space-x-6 mt-4">
                    <button
                        onClick={toggleMute}
                        className={`p-4 rounded-full ${isMuted ? "bg-red-500" : "bg-gray-700"}`}
                    >
                        {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                    </button>
                    <button
                        onClick={handleEndCall}
                        className="p-4 rounded-full bg-red-600"
                    >
                        <PhoneOff className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}
