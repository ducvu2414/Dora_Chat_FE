import React, { useEffect } from "react";
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

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!currentCall && user && type && conversationId) {
            const peerId = uuidv4();
            console.log("📞 Initializing call with peerId:", peerId);

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
    }, [currentCall, conversationId, type, dispatch]);

    console.log("📞 [CallPage] Current Call State:", currentCall);

    if (!currentCall) {
        return (
            <div style={{ padding: "20px", fontSize: "18px", color: "#333" }}>
                🔄 Đang khởi tạo cuộc gọi...
            </div>
        );
    }

    return (
        <div>
            {type === "audio" ? <AudioCallComponent /> : <VideoCallComponent />}
            <video id="remote-video" autoPlay playsInline />
            <video id="local-video" autoPlay muted playsInline />

        </div>
    );
}
