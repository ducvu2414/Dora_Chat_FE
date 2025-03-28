import { useEffect, useState } from "react";
import ChatBox from "./components/ChatBox";
import DetailChat from "./components/DetailChat";
import HeaderSignleChat from "./components/HeaderSignleChat";
import MessageInput from "./components/MessageInput";
import { socket } from "../../utils/socketClient";
import { SOCKET_EVENTS } from "../../utils/constant";
import messageApi from "@/api/message";
export default function ChatSingle() {
  // const [messages, setMessages] = useState([
  //   { id: 1, text: "Hello!", type: "TEXT", time: "10:25", sender: "other" },
  //   {
  //     id: 2,
  //     text: "Hello!",
  //     type: "TEXT",
  //     time: "10:27",
  //     sender: "other",
  //   },
  //   {
  //     id: 3,
  //     text: "Hi! How are you?",
  //     type: "TEXT",
  //     time: "10:30",
  //     sender: "me",
  //   },
  //   {
  //     id: 4,
  //     text: "https://plus.unsplash.com/premium_photo-1661962309696-c429126b237e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     type: "IMAGE",
  //     time: "10:32",
  //     sender: "other",
  //   },
  //   {
  //     id: 5,
  //     text: "Hi! How are you? Kính gửi các chiến hữu trong cộng đồng P Hi! How are you? Kính gửi các chiến hữu trong cộng đồng PiHi! How are you? Kính gửi các chiến hữu trong cộng đồng PiHi! How are you? Kính gửi các chiến hữu trong cộng đồng PiHi! How are you? Kính gửi các chiến hữu trong cộng đồng Pii 🥲 Hôm nay, tôi ngồi xuống viết những Kính gửi các chiến hữu trong cộng đồng Pi 🥲 Hôm nay, tôi ngồi xuống viết những dòng này với một tấm lòng đầy ăn năn ",
  //     type: "TEXT",
  //     time: "10:35",
  //     sender: "me",
  //   },
  //   {
  //     id: 6,
  //     text: "https://example.com/image.word",
  //     type: "FILE",
  //     sender: "other",
  //     time: "10:02 ",
  //   },
  //   {
  //     id: 7,
  //     text: "https://example.com/document.pdf",
  //     type: "FILE",
  //     fileName: "document.pdf",
  //     sender: "me",
  //     time: "10:05 ",
  //   },
  // ]);
  const conversationId = "67dcf8eac3a67270b6534c60";
  const [messages, setMessages] = useState([]);
  const handleNewMessage = (message) => {
    console.log("New message:", message);
    setMessages((prevMessages) => [...prevMessages, message]);
  };
  const joinConversation = (conversationId) => {
    socket.emit(SOCKET_EVENTS.JOIN_CONVERSATIONS, conversationId);
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
      const response = await messageApi.sendMessage({
        conversationId: conversationId,
        content: message,
      });
      console.log("Message sent:", response);
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
