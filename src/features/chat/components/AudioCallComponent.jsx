import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SOCKET_EVENTS } from "../../../utils/constant";
import { endCall as endCallAction } from "../../../features/chat/callSlice";
import { socket } from "../../../utils/socketClient";
import SimplePeerService from "../../../utils/peerService";

export default function CallPage() {

    const dispatch = useDispatch();
    const { currentCall } = useSelector((state) => state.call);
    const [remoteStream, setRemoteStream] = useState(null);

    const localVideoRef = useRef();
    const remoteVideoRef = useRef();

    useEffect(() => {
        if (!currentCall) return;

        const { type, peerId, conversationId, userId, initiator } = currentCall;

        // Step 1: Lấy local stream
        const getMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: type === "video",
                    audio: true,
                });

                // Gán local stream
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // Step 2: Init peer
                SimplePeerService.init({
                    stream,
                    initiator,
                    userId,
                    conversationId,
                    type,
                });


                // Step 3: Emit SUBSCRIBE
                socket.emit(
                    type === "video"
                        ? SOCKET_EVENTS.SUBSCRIBE_CALL_VIDEO
                        : SOCKET_EVENTS.SUBSCRIBE_CALL_AUDIO,
                    { conversationId, userId, peerId }
                );
            } catch (err) {
                console.error("🚨 Error getting user media:", err);
                handleEndCall();
            }
        };

        getMedia();

        return () => {
            SimplePeerService.endCall();
        };
    }, [currentCall]);

    const handleEndCall = () => {
        if (currentCall?.conversationId && currentCall?.userId) {
            socket.emit(SOCKET_EVENTS.END_CALL, {
                conversationId: currentCall.conversationId,
                userId: currentCall.userId,
            });
        }
        dispatch(endCallAction());
        SimplePeerService.endCall();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
            <div className="flex flex-col gap-4 items-center">
                <h2 className="text-white text-2xl font-semibold">
                    {currentCall?.type === "video" ? "Video Call" : "Audio Call"}
                </h2>

                <div className="flex gap-4">
                    {/* Local */}
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className={`w-64 h-48 bg-gray-800 rounded-lg ${currentCall?.type === "audio" ? "hidden" : ""
                            }`}
                    />

                    {/* Remote */}
                    {remoteStream && (
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className={`w-64 h-48 bg-gray-800 rounded-lg ${currentCall?.type === "audio" ? "hidden" : ""
                                }`}
                        />
                    )}
                </div>

                <button
                    onClick={handleEndCall}
                    className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700"
                >
                    Kết thúc cuộc gọi
                </button>
            </div>
        </div>
    );
}
