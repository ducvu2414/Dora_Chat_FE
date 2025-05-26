import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "../../utils/socketClient";
import { SOCKET_EVENTS } from "../../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setCallStarted, endCall } from "../../features/chat/callSlice";
import { AlertMessage } from "@/components/ui/alert-message";
import DailyIframe from "@daily-co/daily-js";

export default function GroupCallComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { channelId, conversation } = location.state || {};
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const API = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();
  const { currentCall } = useSelector((state) => state.call);

  const callFrameRef = useRef(null);
  const hasStartedRef = useRef(false);

  const [meetingEnded, setMeetingEnded] = useState(false);

  const cleanupMeeting = async () => {
    try {
      if (callFrameRef.current) {
        await callFrameRef.current.leave();
        callFrameRef.current.destroy();
        callFrameRef.current = null;
      }
    } catch (err) {
      console.error("Lỗi khi dọn dẹp Daily:", err);
    }
    dispatch(endCall());
    setMeetingEnded(true);
  };

  // Dọn dẹp khi component unmount
  useEffect(() => {
    return () => {
      if (!meetingEnded) {
        cleanupMeeting();
      }
    };
  }, [meetingEnded]);

  // 🟡 Dọn dẹp khi refresh/tab close (F5, close tab)
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      cleanupMeeting();
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [cleanupMeeting]);

  useEffect(() => {
    if (!channelId || !conversation?._id) {
      navigate("/home");
      return;
    }
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    async function startGroupCall() {
      if (currentCall) {
        AlertMessage({
          type: "error",
          message: "Bạn đang tham gia cuộc gọi khác\nVui lòng rời khỏi trước khi tham gia kênh mới",
        });
        navigate("/home");
        return;
      }

      const conversationIdRoom = conversation._id + channelId;
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.post(
          `${API}/api/daily/create-room`,
          { conversationId: conversationIdRoom },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const roomUrl = data.url;
        console.log("roomUrl: ", roomUrl);
        const callFrame = DailyIframe.createFrame({
          showLeaveButton: true,
          iframeStyle: {
            position: "fixed",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            zIndex: 999,
          },
        });

        callFrame.join({
          url: roomUrl,
          userName: user.name || "Anonymous",
        });

        callFrame.on("left-meeting", () => {
          cleanupMeeting();
          navigate("/home");
        });

        callFrameRef.current = callFrame;

        dispatch(
          setCallStarted({
            type: "group",
            conversationId: conversation._id,
            channelId,
            roomUrl,
            initiator: true,
          })
        );

        socket.emit(SOCKET_EVENTS.GROUP_CALL_USER, {
          conversationId: conversation._id,
          channelId,
          roomUrl,
        });
      } catch (err) {
        if (err.response && err.response.status === 409) {
          AlertMessage({
            type: "error",
            message: "Bạn đang tham gia một cuộc gọi khác. Vui lòng thoát trước khi tham gia phòng mới.",
          });
          navigate("/home");
        } else {
          console.error("Lỗi khi bắt đầu Daily:", err);
          setMeetingEnded(true);
        }
      }
    }

    startGroupCall();
  }, [API, channelId, conversation, currentCall, dispatch, navigate]);

  return (
    <div className="flex items-center justify-center h-screen text-center">
      Đang tham gia cuộc họp…
    </div>
  );
}
