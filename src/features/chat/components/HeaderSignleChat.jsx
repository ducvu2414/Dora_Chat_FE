/* eslint-disable react/prop-types */
import Call from "@assets/chat/call.svg";
import DetailChatIcon from "@assets/chat/detail_chat.svg";
import VideoCall from "@assets/chat/video_call.svg";
import { useNavigate } from "react-router-dom";
import { PhoneCall, Video } from "lucide-react";
import { SOCKET_EVENTS } from "@/utils/constant";
import { socket } from "@/utils/socketClient";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import { ChannelTab } from "@/features/chat/components/ChannelTab";

export default function HeaderSignleChat({
  channelTabs,
  activeTab,
  handleDetail,
  conversation,
}) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [activeChannel, setActiveChannel] = useState(activeTab);
  const userId = user._id;
  const partner =
    conversation.name ||
    conversation.members?.filter((member) => {
      return member.userId !== user._id;
    });

  const avatarMessage = conversation.avatar || partner?.avatar;
  const name = conversation.name || partner?.name || partner?.username;

  const peerId = uuidv4();

  const handleCall = (type) => {

    if (!conversation._id || !userId) return;
    const payload = {
      conversationId: conversation._id,
      userId,
      peerId,
      type,
    };
    console.log("🚀 ~ file: HeaderSignleChat.jsx:22 ~ handleCall ~ payload", payload);


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

  useEffect(() => {
    setActiveChannel(activeTab);
  }, [activeTab]);

  return (
    <div className="relative z-10 flex flex-col shadow-md w-full h-auto ">
      <div className="flex items-center px-4 pt-5 pb-1 border-b">
        <img
          src={avatarMessage || "/placeholder.svg"}
          className="w-[70px] h-[70px] object-cover rounded-full"
        />
        <div className="ml-3">
          <h2 className="font-semibold text-[22px] text-[#086DC0]">
            {conversation.name ? conversation.name : partner[0].name}
          </h2>
          <div className="flex items-center gap-2">
            <p className="w-[10px] h-[10px] bg-[#00F026] rounded-full"></p>
            <span className="text-sm">Active</span>
          </div>
        </div>
        <div className="flex flex-row ml-auto space-x-4">
          <button className="p-2 duration-200 ease-in-out cursor-pointer hover:scale-110" onClick={() => handleCall("audio")}>
            <img src={Call} alt="Call" />
          </button>
          <button className="p-2 duration-200 ease-in-out cursor-pointer hover:scale-110" onClick={() => handleCall("video")}>
            <img src={VideoCall} alt="Video Call" />
          </button>
          <div
            className="p-2 duration-200 ease-in-out cursor-pointer hover:scale-110"
            onClick={() => handleDetail((prev) => !prev)}
          >
            <img src={DetailChatIcon} alt="Detail Chat" />
          </div>
        </div>
      </div>
      <ChannelTab
        tabs={channelTabs}
        activeTab={activeChannel}
        onTabChange={setActiveChannel}
        className="fixed top-0 right-0 left-0"
      />
    </div>

  );
}
