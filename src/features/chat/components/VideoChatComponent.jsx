import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import peerService from "../../../utils/peerService";
import { SOCKET_EVENTS } from "../../../utils/constant";
import { socket } from "../../../utils/socketClient";
import { Video, VideoOff, PhoneOff, Mic, MicOff } from "lucide-react";
import { endCall as endCallAction } from "../callSlice";
import { useNavigate } from "react-router-dom";

export default function VideoCallComponent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentCall } = useSelector((state) => state.call);
    const { conversations } = useSelector((state) => state.chat);

    const [remoteStreams, setRemoteStreams] = useState({});
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);
    const [startTime, setStartTime] = useState(null);
    const [duration, setDuration] = useState(0);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const localStreamRef = useRef(null);
    const didInitRef = useRef(false);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const conversation = conversations.find(c => c._id === currentCall?.conversationId) || {};
    const participants = conversation.members || [];
    const partner =
        conversation.name ||
        conversation.members?.filter((member) => {
            return member.userId !== user._id;
        });

    useEffect(() => {
        const startCall = async () => {
            if (didInitRef.current) return;
            didInitRef.current = true;
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 480 },
                    audio: true,
                });
                localStreamRef.current = stream;
                localVideoRef.current.srcObject = stream;

                await peerService.init({
                    userId: user._id,
                    peerId: currentCall.peerId,
                    conversationId: currentCall.conversationId,
                    stream,
                    initiator: currentCall.initiator,
                    type: "video",
                });

                peerService.onRemoteStream((remoteStream) => {
                    setRemoteStreams((prev) => ({ ...prev, [currentCall.peerId]: remoteStream }));
                    setIsConnecting(false);
                    if (!startTime) setStartTime(Date.now());
                });
            } catch (err) {
                console.error("❌ Không thể truy cập camera/microphone", err);
                alert("Không thể truy cập camera hoặc microphone. Vui lòng kiểm tra trình duyệt.");
                handleEndCall();
            }
        };

        startCall();

        return () => {
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach((t) => t.stop());
            }
            peerService.endCall();
        };
    }, []);

    useEffect(() => {
        const streams = Object.values(remoteStreams);
        if (streams.length) {
            remoteVideoRef.current.srcObject = streams[0];
        }
    }, [remoteStreams]);

    useEffect(() => {
        if (!startTime) return;
        const id = setInterval(() => {
            setDuration(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
        return () => clearInterval(id);
    }, [startTime]);

    useEffect(() => {
        const onEnded = () => handleEndCall();
        socket.on(SOCKET_EVENTS.CALL_ENDED, onEnded);
        return () => {
            socket.off(SOCKET_EVENTS.CALL_ENDED, onEnded);
        };
    }, [currentCall]);

    const handleEndCall = async () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((t) => t.stop());
            localStreamRef.current = null;
        }
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
        }
        socket.off(SOCKET_EVENTS.CALL_ENDED);

        await peerService.endCall();

        didInitRef.current = false;
        setRemoteStreams({});
        setIsConnecting(true);
        setStartTime(null);
        setDuration(0);

        dispatch(endCallAction());
        navigate("/home");
    };

    const toggleCamera = () => {
        const [videoTrack] = localStreamRef.current?.getVideoTracks() || [];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setIsCameraOff(!videoTrack.enabled);
        }
    };

    const toggleMute = () => {
        const [audioTrack] = localStreamRef.current?.getAudioTracks() || [];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setIsMuted(!audioTrack.enabled);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full bg-black text-white relative">
            {isConnecting && (
                <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
                    <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center mb-4">
                        <Video className="h-12 w-12 text-white" />
                    </div>
                    <h2 className="text-white text-2xl font-semibold mb-2">Đang kết nối...</h2>
                </div>
            )}

            {/* Remote */}
            <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
            />

            {/* Local */}
            <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-32 h-32 md:w-48 md:h-48 rounded-xl absolute top-4 left-4 z-10 border-2 border-white"
            />

            {/* Controls */}
            <div className="absolute bottom-8 flex space-x-6">
                <button
                    onClick={toggleMute}
                    className={`p-4 rounded-full ${isMuted ? "bg-red-500" : "bg-gray-700"}`}
                >
                    {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </button>
                <button
                    onClick={toggleCamera}
                    className={`p-4 rounded-full ${isCameraOff ? "bg-red-500" : "bg-gray-700"}`}
                >
                    {isCameraOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
                </button>
                <button onClick={handleEndCall} className="p-4 rounded-full bg-red-600">
                    <PhoneOff className="h-6 w-6 text-white" />
                </button>
            </div>

            {/* Duration */}
            {startTime && (
                <div className="absolute top-4 right-4 text-gray-400">
                    ⏱️ {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, "0")}
                </div>
            )}
        </div>
    );
}
