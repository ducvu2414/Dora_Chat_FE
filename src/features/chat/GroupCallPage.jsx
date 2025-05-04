import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "../../utils/socketClient";
import { SOCKET_EVENTS } from "../../utils/constant";
import Meeting from "./components/Meeting";
import MeetingEnded from "./components/MeetingEnded";

export default function GroupCallComponent() {
    const navigate = useNavigate();
    const { channelId, conversation } = useLocation().state || {};
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const API = import.meta.env.VITE_BACKEND_URL;

    const currentGroupCall = JSON.parse(localStorage.getItem("currentGroupCall"));

    const meetingRef = useRef(null);
    const hasStartedRef = useRef(false);

    const [meetingJoined, setMeetingJoined] = useState(false);
    const [meetingEnded, setMeetingEnded] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [remoteTracks, setRemoteTracks] = useState([]);
    const [localVideoStream, setLocalVideoStream] = useState(null);
    const [meetingInfo, setMeetingInfo] = useState({});
    const [micShared, setMicShared] = useState(false);
    const [cameraShared, setCameraShared] = useState(false);
    const [screenShared, setScreenShared] = useState(false);

    useEffect(() => {
        if (!channelId || !conversation?._id) {
            navigate("/home");
            return;
        }
        if (hasStartedRef.current) return;
        hasStartedRef.current = true;


        async function startGroupCall() {
            if (currentGroupCall) {
                alert("Bạn đang tham gia cuộc gọi nhóm khác. Vui lòng rời khỏi trước khi tham gia kênh mới.");
                return;
            }


            try {
                if (meetingRef.current) {
                    meetingRef.current.removeAllListeners();
                    await meetingRef.current.leaveMeeting();
                    meetingRef.current = null;
                }

                setOnlineUsers([]);
                setRemoteTracks([]);
                setLocalVideoStream(null);
                setMeetingJoined(false);
                setMeetingEnded(false);

                const meeting = new window.Metered.Meeting();
                meetingRef.current = meeting;

                meeting.on("onlineParticipants", parts => {
                    setOnlineUsers(parts);
                });
                meeting.on("participantJoined", p => {
                    setOnlineUsers(prev =>
                        prev.some(x => x._id === p._id) ? prev : [...prev, p]
                    );
                });
                meeting.on("participantLeft", p => {
                    setOnlineUsers(prev => prev.filter(x => x._id !== p._id));
                    setRemoteTracks(prev =>
                        prev.filter(t => t.participantSessionId !== p._id)
                    );
                });
                meeting.on("remoteTrackStarted", t =>
                    setRemoteTracks(prev => [...prev, t])
                );
                meeting.on("remoteTrackStopped", t =>
                    setRemoteTracks(prev => prev.filter(x => x.streamId !== t.streamId))
                );
                meeting.on("localTrackUpdated", ({ track }) => {
                    setLocalVideoStream(new MediaStream([track]));
                });

                const meetingId = `${channelId}_${conversation._id}`;
                const { data: valid } = await axios.get(
                    `${API}/api/metered/validate-meeting?meetingId=${meetingId}`
                );
                let roomName = meetingId;
                if (!valid.exists) {
                    const { data: created } = await axios.post(
                        `${API}/api/metered/create-meeting-room?roomName=${meetingId}`
                    );
                    roomName = created.roomName;
                }
                const { data: dom } = await axios.get(
                    `${API}/api/metered/metered-domain`
                );
                const roomURL = `${dom.domain}/${roomName}`;

                const info = await meeting.join({
                    name: user.name || "Anonymous",
                    roomURL
                });
                setMeetingInfo(info);
                setMeetingJoined(true);

                const callInfo = {
                    conversationId: conversation._id,
                    channelId,
                    roomUrl: roomURL
                };
                localStorage.setItem("currentGroupCall", JSON.stringify(callInfo));

                socket.emit(SOCKET_EVENTS.GROUP_CALL_USER, {
                    conversationId: conversation._id,
                    channelId,
                    roomUrl: roomURL
                });


            } catch (err) {
                console.error("Error starting group call:", err);
                setMeetingEnded(true);
            }
        }

        startGroupCall();


    }, [API, channelId, conversation._id, navigate, user.name]);


    useEffect(() => {
        const onInvite = async ({ conversationId, roomUrl }) => {
            if (conversationId !== conversation._id) return;
            // console.log(currentGroupCall);
            // if (
            //     currentGroupCall &&
            //     (currentGroupCall.conversationId !== conversationId ||
            //         currentGroupCall.channelId !== invitedChannel)
            // ) {
            //     if (meetingRef.current) {
            //         meetingRef.current.removeAllListeners();
            //         await meetingRef.current.leaveMeeting();
            //         meetingRef.current = null;
            //     }
            //     dispatch(endGroupCall());
            // }

            if (!meetingRef.current || meetingJoined) return;

            try {
                const info = await meetingRef.current.join({
                    name: user.name || "Anonymous",
                    roomURL: roomUrl
                });
                setMeetingInfo(info);
                setMeetingJoined(true);
            } catch (e) {
                console.error("Failed to join on invite:", e);
            }
        };

        socket.on(SOCKET_EVENTS.GROUP_CALL_USER, onInvite);
        return () => {
            socket.off(SOCKET_EVENTS.GROUP_CALL_USER, onInvite);
        };
    }, [conversation._id, user.name, socket]);


    // useEffect(() => {
    //     const onGroupEnded = () => {
    //         setMeetingEnded(true);
    //     };
    //     socket.on(SOCKET_EVENTS.GROUP_CALL_ENDED, onGroupEnded);
    //     return () => {
    //         socket.off(SOCKET_EVENTS.GROUP_CALL_ENDED, onGroupEnded);
    //     };
    // }, []);


    // 4️⃣ Các nút điều khiển
    const handleMicBtn = async () => {
        if (!meetingRef.current) return;
        if (micShared) await meetingRef.current.stopAudio();
        else await meetingRef.current.startAudio();
        setMicShared(m => !m);
    };

    const handleCameraBtn = async () => {
        if (!meetingRef.current) return;
        if (cameraShared) {
            await meetingRef.current.stopVideo();
            setLocalVideoStream(null);
        } else {
            await meetingRef.current.startVideo();
            const s = await meetingRef.current.getLocalVideoStream();
            setLocalVideoStream(s);
        }
        setCameraShared(c => !c);
    };

    const handleScreenBtn = async () => {
        if (!meetingRef.current) return;

        try {
            if (!screenShared) {
                await meetingRef.current.startScreenShare();
                setScreenShared(true);
            } else {
                await meetingRef.current.stopVideo();
                setScreenShared(false);
            }
        } catch (err) {
            console.error("Screen share toggle failed:", err);
        }
    };

    const handleLeaveBtn = async () => {
        if (meetingRef.current) {
            meetingRef.current.removeAllListeners();
            await meetingRef.current.leaveMeeting();
            meetingRef.current = null;
        }
        setMeetingEnded(true);
        localStorage.removeItem("currentGroupCall");
        navigate("/home");
    };


    // 5️⃣ Render UI
    if (meetingEnded) return <MeetingEnded />;
    if (!meetingJoined) {
        return (
            <div className="flex items-center justify-center h-screen">
                Đang tham gia cuộc họp…
            </div>
        );
    }

    return (
        <Meeting
            handleMicBtn={handleMicBtn}
            handleCameraBtn={handleCameraBtn}
            handelScreenBtn={handleScreenBtn}
            handleLeaveBtn={handleLeaveBtn}
            localVideoStream={localVideoStream}
            onlineUsers={onlineUsers}
            remoteTracks={remoteTracks}
            meetingInfo={meetingInfo}
            micShared={micShared}
            cameraShared={cameraShared}
            screenShared={screenShared}
            username={user.name}
        />
    );
}
