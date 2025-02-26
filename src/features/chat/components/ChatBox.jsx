import { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";
/* eslint-disable react/prop-types */
export default function ChatBox({ messages }) {
  const chatContainerRef = useRef(null);

  // Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div className="flex-1 flex flex-col bg-[#fff] py-2">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-2 p-4 max-h-[calc(100vh-195px)]"
      >
        {messages.map((msg, index) => {
          const isLastInGroup =
            index === messages.length - 1 ||
            messages[index + 1].sender !== msg.sender;
          return (
            <MessageItem key={msg.id} msg={msg} showAvatar={isLastInGroup} />
          );
        })}
      </div>
    </div>
  );
}
