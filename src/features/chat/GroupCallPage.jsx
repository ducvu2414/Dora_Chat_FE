import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "../../utils/socketClient";
import { SOCKET_EVENTS } from "../../utils/constant";
import Meeting from "./components/Meeting";
import MeetingEnded from "./components/MeetingEnded";
import { useDispatch, useSelector } from "react-redux";
import { setCallStarted, endCall } from "../../features/chat/callSlice";

export default function GroupCallComponent() {
    const navigate = useNavigate();
    const location = useLocation();
    const { channelId, conversation } = location.state || {};
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const API = import.meta.env.VITE_BACKEND_URL;
    const dispatch = useDispatch();
    const { currentCall } = useSelector((state) => state.call);

    const meetingRef = useRef(null);
    const hasStartedRef = useRef(false);
    const prevLocationRef = useRef(location.pathname); // Theo dõi vị trí trước đó

    const [meetingJoined, setMeetingJoined] = useState(false);
    const [meetingEnded, setMeetingEnded] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [remoteTracks, setRemoteTracks] = useState([]);
    const [localVideoStream, setLocalVideoStream] = useState(null);
    const [meetingInfo, setMeetingInfo] = useState({});
    const [micShared, setMicShared] = useState(false);
    const [cameraShared, setCameraShared] = useState(false);
    const [screenShared, setScreenShared] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    // Hàm dọn dẹp cuộc họp
    const cleanupMeeting = async () => {
        try {
            if (meetingRef.current) {
                meetingRef.current.removeAllListeners();
                await meetingRef.current.leaveMeeting();
                meetingRef.current = null;
            }
        } catch (err) {
            console.error("Lỗi khi dọn dẹp cuộc họp:", err);
        }
        dispatch(endCall());
        setMeetingEnded(true);
    };

    // Chặn điều hướng tùy chỉnh
    useEffect(() => {
        const handleNavigation = async () => {
            if (meetingJoined && !meetingEnded && !isLeaving && prevLocationRef.current !== location.pathname) {
                const confirmLeave = window.confirm("Bạn có chắc muốn rời cuộc gọi?");
                if (confirmLeave) {
                    setIsLeaving(true);
                    await cleanupMeeting();
                } else {
                    // Hoàn nguyên điều hướng bằng cách đẩy về tuyến đường hiện tại
                    navigate(location.pathname, { replace: true });
                }
            }
            prevLocationRef.current = location.pathname;
        };

        handleNavigation();
    }, [location, meetingJoined, meetingEnded, isLeaving, navigate]);

    // Dọn dẹp khi component bị hủy
    useEffect(() => {
        return () => {
            if (meetingJoined && !meetingEnded && !isLeaving) {
                cleanupMeeting();
            }
        };
    }, [meetingJoined, meetingEnded, isLeaving]);

    // Xử lý beforeunload (đóng tab, tải lại trang)
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (meetingJoined && !meetingEnded && !isLeaving) {
                event.preventDefault();
                event.returnValue = "Bạn có chắc muốn rời cuộc gọi?";
                cleanupMeeting();
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [meetingJoined, meetingEnded, isLeaving]);

    // Khởi tạo cuộc họp
    useEffect(() => {
        if (!channelId || !conversation?._id) {
            navigate("/home");
            return;
        }
        if (hasStartedRef.current) return;
        hasStartedRef.current = true;

        async function startGroupCall() {
            if (currentCall) {
                alert("Bạn đang tham gia cuộc gọi nhóm khác. Vui lòng rời khỏi trước khi tham gia kênh mới.");
                navigate("/home");
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

                meeting.on("onlineParticipants", (parts) => setOnlineUsers(parts));
                meeting.on("participantJoined", (p) =>
                    setOnlineUsers((prev) => (prev.some((x) => x._id === p._id) ? prev : [...prev, p]))
                );
                meeting.on("participantLeft", (p) => {
                    setOnlineUsers((prev) => prev.filter((x) => x._id !== p._id));
                    setRemoteTracks((prev) => prev.filter((t) => t.participantSessionId !== p._id));
                });
                meeting.on("remoteTrackStarted", (t) => setRemoteTracks((prev) => [...prev, t]));
                meeting.on("remoteTrackStopped", (t) =>
                    setRemoteTracks((prev) => prev.filter((x) => x.streamId !== t.streamId))
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
                const { data: dom } = await axios.get(`${API}/api/metered/metered-domain`);
                const roomURL = `${dom.domain}/${roomName}`;

                const info = await meeting.join({
                    name: user.name || "Anonymous",
                    roomURL,
                });
                setMeetingInfo(info);
                setMeetingJoined(true);

                dispatch(
                    setCallStarted({
                        type: "group",
                        conversationId: conversation._id,
                        channelId,
                        roomUrl: roomURL,
                        initiator: true,
                    })
                );

                socket.emit(SOCKET_EVENTS.GROUP_CALL_USER, {
                    conversationId: conversation._id,
                    channelId,
                    roomUrl: roomURL,
                });
            } catch (err) {
                console.error("Lỗi khi bắt đầu cuộc gọi nhóm:", err);
                setMeetingEnded(true);
            }
        }

        startGroupCall();
    }, [API, channelId, conversation?._id, navigate, user.name, currentCall, dispatch]);

    // Xử lý lời mời socket
    useEffect(() => {
        const onInvite = async ({ conversationId, roomUrl }) => {
            if (conversationId !== conversation._id) return;
            if (!meetingRef.current || meetingJoined) return;

            try {
                const info = await meetingRef.current.join({
                    name: user.name || "Anonymous",
                    roomURL: roomUrl,
                });
                setMeetingInfo(info);
                setMeetingJoined(true);
            } catch (e) {
                console.error("Không thể tham gia qua lời mời:", e);
            }
        };

        socket.on(SOCKET_EVENTS.GROUP_CALL_USER, onInvite);
        return () => socket.off(SOCKET_EVENTS.GROUP_CALL_USER, onInvite);
    }, [conversation._id, user.name, meetingJoined]);

    // Các trình xử lý điều khiển
    const handleMicBtn = async () => {
        if (!meetingRef.current) return;
        if (micShared) await meetingRef.current.stopAudio();
        else await meetingRef.current.startAudio();
        setMicShared((m) => !m);
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
        setCameraShared((c) => !c);
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
            console.error("Không thể chuyển đổi chia sẻ màn hình:", err);
        }
    };

    const handleLeaveBtn = async () => {
        if (isLeaving) return;
        setIsLeaving(true);
        await cleanupMeeting();
        navigate("/home");
    };

    if (meetingEnded) {
        return <MeetingEnded />;
    }

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