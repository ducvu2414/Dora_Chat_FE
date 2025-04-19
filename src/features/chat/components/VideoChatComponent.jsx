import React, { useEffect, useState, useRef } from 'react';
import simplePeerService from '../../../utils/peerService';
import { Mic, MicOff, PhoneOff, Video, VideoOff } from 'lucide-react';

export default function VideoChatComponent({ conversationId, onEndCall }) {
    const [remoteVideos, setRemoteVideos] = useState([]);
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const localVideoRef = useRef(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user._id;

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                console.log('🎥 VideoCall init:', { userId, conversationId });
                await simplePeerService.init({
                    initiator: true,
                    userId,
                    streamType: 'video',
                    conversationId,
                });

                simplePeerService.onRemoteStream('*', (stream, id) => {
                    if (mounted) {
                        setRemoteVideos((prev) => [...prev, { id, stream }]);
                    }
                });

                // Gán local stream vào local video element
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = simplePeerService.localStream;
                }
            } catch (err) {
                console.error('❌ Call error:', err);
                onEndCall();
            }
        })();

        return () => {
            mounted = false;
            simplePeerService.endCall();
        };
    }, [conversationId]);

    const toggleMute = () => {
        const muted = simplePeerService.toggleAudio();
        setIsMuted(muted);
    };

    const toggleCamera = () => {
        const off = simplePeerService.toggleVideo();
        setIsCameraOff(off);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full bg-black text-white px-4">
            <video
                ref={localVideoRef}
                autoPlay
                muted
                className="w-64 h-48 rounded mb-4 border border-gray-600"
            />
            {remoteVideos.map(({ id, stream }) => (
                <video
                    key={id}
                    autoPlay
                    ref={(ref) => ref && (ref.srcObject = stream)}
                    className="w-64 h-48 rounded border border-blue-400 mb-2"
                />
            ))}

            <div className="flex space-x-6 mt-8">
                <button
                    onClick={toggleMute}
                    className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-700'}`}
                >
                    {isMuted ? <MicOff /> : <Mic />}
                </button>
                <button
                    onClick={toggleCamera}
                    className={`p-3 rounded-full ${isCameraOff ? 'bg-yellow-500' : 'bg-gray-700'}`}
                >
                    {isCameraOff ? <VideoOff /> : <Video />}
                </button>
                <button onClick={onEndCall} className="p-3 rounded-full bg-red-600">
                    <PhoneOff />
                </button>
            </div>
        </div>
    );
}
