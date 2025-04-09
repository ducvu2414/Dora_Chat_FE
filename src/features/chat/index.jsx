import { useEffect, useState } from "react";
import ChatBox from "./components/ChatBox";
import DetailChat from "./components/DetailChat";
import HeaderSignleChat from "./components/HeaderSignleChat";
import MessageInput from "./components/MessageInput";
import { socket } from "../../utils/socketClient";
import { SOCKET_EVENTS } from "../../utils/constant";
import messageApi from "@/api/message";
export default function ChatSingle() {
  const conversationId = "67ee2539dc14e5903dc8b4ce";
  const [messages, setMessages] = useState([]);
  const handleNewMessage = (message) => {
    setMessages((prevMessages) => {
      const exists = prevMessages.some((m) => m._id === message._id);
      if (exists) return prevMessages;
      return [...prevMessages, message];
    });
  };
  const joinConversation = (conversationId) => {
    socket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, conversationId);
  };
  const onNewMessage = (callback) => {
    if (socket) {
      socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, callback);
    }
  };
  useEffect(() => {
    joinConversation(conversationId);

    // Gọi API lấy danh sách tin nhắn ban đầu
    messageApi
      .fetchMessages(conversationId)
      .then((res) => {
        setMessages(res);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
    // Lắng nghe tin nhắn mới
    onNewMessage(handleNewMessage);
  }, [conversationId]);
  const handleSendMessage = async (message) => {
    if (!message.trim()) return;
    try {
      await messageApi.sendMessage({
        conversationId: conversationId,
        content: message,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const [showDetail, setShowDetail] = useState(false);
  return (
    <div className="flex w-full h-screen">
      {/* Main Content */}
      <div className="flex flex-1 overflow-auto ">
        {/* ChatBox  */}
        <div className="flex flex-col flex-1 bg-gradient-to-b from-blue-50/50 to-white">
          <HeaderSignleChat handleDetail={setShowDetail} />
          <ChatBox messages={messages} />
          <MessageInput onSend={handleSendMessage} />
        </div>

        {/* DetailChat*/}
        <div
          className={`bg-white shadow-xl transition-all duration-200 my-3 rounded-[20px]  ${
            showDetail ? "w-[385px]" : "w-0"
          }`}
        >
          {showDetail && <DetailChat />}
        </div>
      </div>
    </div>
  );
}
