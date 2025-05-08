import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import peerService from "../../../utils/peerService";
import { SOCKET_EVENTS } from "../../../utils/constant";
import { socket } from "../../../utils/socketClient";
import { Mic, MicOff, PhoneOff, Settings } from "lucide-react";
import { endCall as endCallAction } from "../callSlice";
import { useNavigate } from "react-router-dom";

export default function AudioCallComponent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentCall } = useSelector((state) => state.call);
    const { conversations } = useSelector((state) => state.chat);
    const [remoteStreams, setRemoteStreams] = useState({});
    const [isMuted, setIsMuted] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);
    const [audioDevices, setAudioDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState("default");
    const [showSettings, setShowSettings] = useState(false);
    const localAudioRef = useRef(null);
    const localStreamRef = useRef(null);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [startTime, setStartTime] = useState(null);
    const [duration, setDuration] = useState(0);

    const conversation = conversations.find(c => c._id === currentCall?.conversationId) || {};

    const partner =
        conversation.name ||
        conversation.members?.filter((member) => {
            return member.userId !== user._id;
        });

    const participants = conversation.members || [];

    const didInitRef = useRef(false);

    // Load available audio devices
    useEffect(() => {
        const loadDevices = async () => {
            try {
                // Request permission first by getting a stream
                await navigator.mediaDevices.getUserMedia({ audio: true });

                const devices = await navigator.mediaDevices.enumerateDevices();
                const audioInputs = devices.filter(device => device.kind === 'audioinput');
                setAudioDevices(audioInputs);
                console.log("📱 Available audio devices:", audioInputs);
            } catch (err) {
                console.error("❌ Error loading audio devices", err);
            }
        };

        loadDevices();
    }, []);

    const getOptimalAudioConstraints = () => {
        // Higher-quality audio constraints
        return {
            deviceId: selectedDevice ? { exact: selectedDevice } : undefined,
            sampleRate: 48000,
            sampleSize: 16,
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true, // Enable autoGainControl for better background noise handling
            latency: 0.01,
            // Voice isolation for modern browsers that support it
            ...(window.AudioContext && { voiceIsolation: true })
        };
    };

    // Start or join call
    useEffect(() => {
        const startCall = async () => {
            if (didInitRef.current) return;
            didInitRef.current = true;

            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: getOptimalAudioConstraints()
                });

                const track = stream.getAudioTracks()[0];
                console.log("🎧 Audio Track Settings:", track.getSettings());

                // Apply audio processing constraints again directly to the track if needed
                await track.applyConstraints(getOptimalAudioConstraints())
                    .catch(e => console.warn("Could not apply additional constraints:", e));

                // Apply gain if needed via AudioContext (advanced)
                try {
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    const source = audioContext.createMediaStreamSource(stream);
                    const gainNode = audioContext.createGain();

                    // Adjust gain - values < 1 decrease volume, > 1 increase
                    gainNode.gain.value = 1.2; // Slight boost to volume

                    // Optional: Add a compressor for more consistent audio
                    const compressor = audioContext.createDynamicsCompressor();
                    compressor.threshold.value = -24;
                    compressor.knee.value = 30;
                    compressor.ratio.value = 12;
                    compressor.attack.value = 0.003;
                    compressor.release.value = 0.25;

                    source.connect(compressor);
                    compressor.connect(gainNode);

                    const destination = audioContext.createMediaStreamDestination();
                    gainNode.connect(destination);

                    // Create new stream with processed audio
                    const processedStream = new MediaStream();
                    processedStream.addTrack(destination.stream.getAudioTracks()[0]);

                    // Keep a reference to the original stream to properly clean up
                    localStreamRef.current = stream;

                    // Use the processed stream
                    localAudioRef.current.srcObject = processedStream;

                    // Initialize peer with processed audio
                    await peerService.init({
                        userId: user._id,
                        peerId: currentCall.peerId,
                        conversationId: currentCall.conversationId,
                        stream: processedStream,
                        initiator: currentCall.initiator,
                    });
                } catch (audioProcessingError) {
                    console.warn("Advanced audio processing not available, using standard stream", audioProcessingError);
                    // Fallback to standard audio
                    localStreamRef.current = stream;
                    localAudioRef.current.srcObject = stream;

                    await peerService.init({
                        userId: user._id,
                        peerId: currentCall.peerId,
                        conversationId: currentCall.conversationId,
                        stream: stream,
                        initiator: currentCall.initiator,
                    });
                }

                // on remote stream
                peerService.onRemoteStream((remoteStream, remoteId) => {
                    setRemoteStreams(prev => ({ ...prev, [remoteId]: remoteStream }));
                    setIsConnecting(false);
                    if (!startTime) setStartTime(Date.now());
                });
            } catch (err) {
                console.error("❌ Error accessing audio stream", err);
                alert("Unable to access microphone. Please check your browser's microphone access permissions");
                handleEndCall();
            }
        };

        startCall();

        const timeout = setTimeout(() => {
            if (isConnecting) {
                console.warn("⏳ Timeout: Không kết nối được sau 30s, kết thúc cuộc gọi.");
                handleEndCall();
            }
        }, 30 * 1000);

        return () => {
            clearTimeout(timeout);
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
            peerService.endCall();
        };
    }, []);


    // track duration
    useEffect(() => {
        if (!startTime) return;
        const interval = setInterval(() => {
            setDuration(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    // handle end events
    useEffect(() => {
        const onEnded = () => handleEndCall();
        socket.on(SOCKET_EVENTS.CALL_ENDED, onEnded);
        return () => socket.off(SOCKET_EVENTS.CALL_ENDED, onEnded);
    }, [currentCall]);

    const handleEndCall = async () => {
        // Dừng stream xử lý gốc
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }

        // Dừng cả audio context nếu có
        if (window.audioContextInstance && typeof window.audioContextInstance.close === 'function') {
            await window.audioContextInstance.close();
            window.audioContextInstance = null;
        }

        // Dọn dẹp peer
        await peerService.endCall();

        // Reset UI & state
        didInitRef.current = false;
        if (localAudioRef.current) localAudioRef.current.srcObject = null;
        setRemoteStreams({});
        setIsConnecting(true);
        dispatch(endCallAction());
        navigate('/home');
    };

    useEffect(() => {
        // const onRejected = ({ userId, reason }) => {
        //     console.log(`❌ Cuộc gọi bị từ chối bởi ${userId}. Lý do: ${reason}`);
        //     dispatch(endCall());
        //     navigate("/home");
        // };
        const onEnded = () => handleEndCall();

        socket.on(SOCKET_EVENTS.CALL_REJECTED, onEnded);
        return () => socket.off(SOCKET_EVENTS.CALL_REJECTED, onEnded);
    }, []);

    const toggleMute = () => {
        const muted = peerService.toggleAudio();
        setIsMuted(muted);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white">
            {isConnecting && (
                <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
                    <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center mb-4">
                        <Mic className="h-12 w-12 text-white" />
                    </div>
                    <h2 className="text-white text-2xl font-semibold mb-2">Đang kết nối...</h2>
                </div>
            )}

            {/* Local audio muting */}
            <audio ref={localAudioRef} autoPlay muted />


            {/* Single full-screen remote stream */}
            {Object.entries(remoteStreams).length > 0 && (() => {
                const [peerId, stream] = Object.entries(remoteStreams)[0];
                const member = participants.find(m => m.peerId === peerId) || {};
                // console.log(partner)
                return (
                    <div className="flex flex-col items-center justify-center flex-1">
                        <audio autoPlay ref={el => el && (el.srcObject = stream)} />
                        <div className="mt-4 text-center">
                            <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
                                {partner[0].avatar ? (
                                    <img src={partner[0].avatar} alt={partner[0].name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                                        <span className="text-white text-2xl">{partner[0].name?.charAt(0)}</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-xl font-semibold">{partner[0].name || "Người dùng"}</p>
                        </div>
                    </div>
                );
            })()}


            {/* Call controls */}
            <div className="mt-auto p-4 flex items-center space-x-6">
                <button onClick={toggleMute} className="p-4 rounded-full bg-gray-700">
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>

                <button onClick={handleEndCall} className="p-4 rounded-full bg-red-600">
                    <PhoneOff className="w-6 h-6 text-white" />
                </button>
            </div>

            {/* Duration */}
            {startTime && (
                <div className="absolute top-4 right-4 text-gray-400">
                    ⏱️ {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, '0')}
                </div>
            )}
        </div>
    );
}