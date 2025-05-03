import { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";
/* eslint-disable react/prop-types */
export default function ChatBox({ messages, onSelected, onDeselected, member }) {
  const chatContainerRef = useRef(null);

  // Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages.length]);

  return (
    <div className="flex-1 flex flex-col h-px bg-[#fff] py-2">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-2 p-4 max-h-[calc(100vh-210px)]"
      >
        {messages.map((msg, index) => {
          const isFirstInGroup =
            index === 0 ||
            messages[index - 1].memberId.userId !== msg.memberId.userId;
          const isLastInGroup =
            index === messages.length - 1 ||
            messages[index + 1].memberId.userId !== msg.memberId.userId;

          return (
            <MessageItem
              key={msg._id}
              msg={msg}
              showAvatar={isFirstInGroup}
              showTime={isLastInGroup}
              onSelected={onSelected}
              onDeselected={onDeselected}
              member={member}
            />
          );
        })}
      </div>
    </div>
  );
}
