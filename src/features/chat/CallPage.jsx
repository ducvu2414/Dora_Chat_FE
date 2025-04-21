import React, { useEffect, useRef } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCallStarted } from "./callSlice";
import AudioCallComponent from "./components/AudioCallComponent";
import VideoCallComponent from "./components/VideoChatComponent";
import { v4 as uuidv4 } from "uuid";

export default function CallPage() {
    const { conversationId } = useParams();
    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");
    const dispatch = useDispatch();
    const currentCall = useSelector((state) => state.call.currentCall);
    const hasStartedRef = useRef(false); // 👈 Dùng để đảm bảo chỉ gọi 1 lần

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!currentCall && user && type && conversationId && !hasStartedRef.current) {
            const peerId = uuidv4();
            console.log("📞 Initializing call with peerId:", peerId);

            hasStartedRef.current = true; // Đánh dấu đã gọi rồi
            dispatch(
                setCallStarted({
                    type,
                    conversationId,
                    peerId,
                    userId: user._id,
                    initiator: true,
                })
            );
        }
    }, [currentCall, type, conversationId, dispatch]);

    useEffect(() => {
        console.log("📞 [CallPage] Current Call State:", currentCall);
    }, [currentCall]);

    if (!currentCall) {
        return (
            <div className="flex items-center justify-center h-screen bg-white text-gray-800 text-lg">
                🔄 Đang khởi tạo cuộc gọi...
            </div>
        );
    }

    return (
        <div className="h-screen  bg-black">
            {type === "audio" ? <AudioCallComponent /> : <VideoCallComponent />}
        </div>
    );
}
