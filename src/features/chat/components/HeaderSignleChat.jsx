/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { PhoneCall, Video } from "lucide-react";
import { SOCKET_EVENTS } from "@/utils/constant";
import { socket } from "@/utils/socketClient";
import { v4 as uuidv4 } from "uuid";

export default function HeaderSignleChat({ conversation }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user._id;

  const partner = conversation.members?.find(
    (member) => member.userId !== userId
  );
  const avatarMessage = conversation.avatar || partner?.avatar;
  const name = conversation.name || partner?.name || partner?.username;

  const peerId = uuidv4(); // Unique peerId for each call

  const handleCall = (type) => {
    if (!conversation._id || !userId) return;

    const payload = {
      conversationId: conversation._id,
      userId,
      peerId,
    };

    if (type === "audio") {
      socket.emit(SOCKET_EVENTS.SUBSCRIBE_CALL_AUDIO, payload);
    } else {
      socket.emit(SOCKET_EVENTS.SUBSCRIBE_CALL_VIDEO, payload);
    }

    // Navigate to call page with params
    navigate(`/call/${conversation._id}?type=${type}`, {
      state: {
        conversation,
        initiator: true,
        peerId,
      },
    });
  };

  return (
    <div className="flex items-center px-4 pt-5 pb-1 border-b">
      <img
        src={avatarMessage || "/placeholder.svg"}
        className="w-[70px] h-[70px] object-cover rounded-full"
        alt="avatar"
      />
      <div className="ml-3 flex-1">
        <h2 className="font-semibold text-[22px] text-[#086DC0] truncate">
          {name}
        </h2>
      </div>
      <div className="flex space-x-4">
        <button onClick={() => handleCall("audio")}>
          <PhoneCall className="text-blue-600 w-6 h-6" />
        </button>
        <button onClick={() => handleCall("video")}>
          <Video className="text-blue-600 w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
