import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { endCall } from '../callSlice';
import { PhoneOff, Video, VideoOff } from 'lucide-react';
import peerService from '../../../utils/peerService';

export default function VideoCallComponent({ conversationId, onEndCall, conversation }) {
    const dispatch = useDispatch();
    const [remoteStreams, setRemoteStreams] = useState({});
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);
    const localVideoRef = useRef(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user._id;

    const partner = conversation?.members?.find(member => member.userId !== userId);
    const partnerName = partner?.name || 'Unknown';
    const partnerAvatar = partner?.avatar || null;

    useEffect(() => {
        let mounted = true;

        const initCall = async () => {
            try {
                console.log('🎥 VideoCall init:', { userId, conversationId });

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });

                await peerService.init({
                    initiator: true,
                    userId,
                    type: 'video',
                    conversationId,
                    stream,
                });

                // Gán stream local vào thẻ video
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                peerService.onRemoteStream('*', (stream, id) => {
                    if (!mounted) return;
                    console.log(`📡 Received remote video stream from ${id}`);
                    setRemoteStreams(prev => ({ ...prev, [id]: stream }));
                    setIsConnecting(false);
                });

            } catch (err) {
                console.error('❌ Video call error:', err);
                if (onEndCall) onEndCall();
                else dispatch(endCall());
            }
        };

        initCall();

        return () => {
            mounted = false;
            peerService.endCall();
        };
    }, [conversationId, userId]);

    const toggleCamera = () => {
        const videoTracks = peerService.localStream?.getVideoTracks();
        if (videoTracks && videoTracks.length > 0) {
            videoTracks[0].enabled = !videoTracks[0].enabled;
            setIsCameraOff(!videoTracks[0].enabled);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full bg-black text-white px-4 relative">
            {isConnecting && (
                <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
                    <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center mb-4">
                        <Video className="h-12 w-12 text-white" />
                    </div>
                    <h2 className="text-white text-2xl font-semibold mb-2">{partnerName || 'Đang kết nối...'}</h2>
                    <p className="text-gray-300">Đang chờ người khác tham gia cuộc gọi...</p>
                </div>
            )}

            {/* Local video */}
            <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-40 h-40 md:w-64 md:h-64 rounded-xl absolute top-4 left-4 z-10 border-2 border-white"
            />

            {/* Remote videos */}
            <div className="flex flex-wrap justify-center items-center w-full h-full">
                {Object.entries(remoteStreams).map(([id, stream]) => (
                    <video
                        key={id}
                        autoPlay
                        playsInline
                        className="w-full max-w-[800px] max-h-[90vh] object-cover"
                        ref={(el) => {
                            if (el) el.srcObject = stream;
                        }}
                    />
                ))}
            </div>

            {/* Controls */}
            <div className="absolute bottom-8 flex space-x-6">
                <button
                    onClick={toggleCamera}
                    className={`p-4 rounded-full ${isCameraOff ? 'bg-red-500' : 'bg-gray-700'}`}
                >
                    {isCameraOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
                </button>
                <button
                    onClick={onEndCall || (() => dispatch(endCall()))}
                    className="p-4 rounded-full bg-red-600"
                >
                    <PhoneOff className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
}
