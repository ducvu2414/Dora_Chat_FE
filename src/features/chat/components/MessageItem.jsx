/* eslint-disable react/prop-types */
import Avatar from "@assets/chat/avatar.png";
import { useState } from "react";

export default function MessageItem({ msg, showAvatar }) {
  const [expanded, setExpanded] = useState(false);
  const MAX_TEXT_LENGTH = 350;

  const isImage = (type) => type === "IMAGE";
  const isMe = msg.sender === "me";
  return (
    <div
      key={msg.id}
      className={`flex items-end gap-2 ${
        msg.sender === "me" ? " flex-row-reverse" : "justify-start"
      }`}
    >
      {/* Hiển thị avatar nếu là tin nhắn cuối trong nhóm */}
      {showAvatar ? (
        <img src={Avatar} alt="avatar" className="w-10 h-10 rounded-full" />
      ) : (
        <div className="w-10 h-10 rounded-full"></div>
      )}

      {/* Nội dung tin nhắn */}
      <div
        key={msg.id}
        className="flex flex-col max-w-[45%] break-words w-fit text-start"
      >
        {/* Nếu tin nhắn là hình ảnh */}
        {isImage(msg.type) ? (
          <img
            src={msg.text}
            alt="sent image"
            className="max-w-[468px] max-h-[468px] object-contain rounded-lg"
            loading="lazy"
          />
        ) : (
          <p
            className={`px-3 py-[14px] rounded-2xl text-sm
           ${
             isMe
               ? "bg-[#EFF8FF] text-[#000000] ml-auto"
               : "bg-[#F5F5F5] text-[#000000]"
           }`}
          >
            {expanded ? msg.text : msg.text.slice(0, MAX_TEXT_LENGTH) + "..."}
            {msg.text.length > MAX_TEXT_LENGTH && (
              <span
                className="text-blue-500 hover:underline ml-1 cursor-pointer"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Thu gọn" : "Xem thêm"}
              </span>
            )}
          </p>
        )}
        {showAvatar && (
          <span
            className={`text-xs text-[#959595F3] mt-2 ${
              isMe ? "self-end" : ""
            }`}
          >
            {msg.time}
          </span>
        )}
      </div>
    </div>
  );
}
