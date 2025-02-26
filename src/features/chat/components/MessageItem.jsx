/* eslint-disable react/prop-types */
import Avatar from "@assets/chat/avatar.png";
import { useState } from "react";

export default function MessageItem({ msg, showAvatar }) {
  const [expanded, setExpanded] = useState(false);
  const MAX_TEXT_LENGTH = 350;

  const isImage = (url) => /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url);
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
        className={` px-3 py-[14px] rounded-2xl max-w-[45%] text-sm  break-words w-fit ${
          msg.sender === "me"
            ? "bg-[#EFF8FF] text-[#000000] ml-auto"
            : "bg-[#F5F5F5] text-[#000000]"
        }
              ${msg.sender === "me" ? "text-end" : "text-start"}`}
      >
        {/* Nếu tin nhắn là hình ảnh */}
        {isImage(msg.text) ? (
          <img
            src={msg.text}
            alt="sent image"
            className="max-w-[468px] max-h-[468px] object-contain rounded-lg"
            loading="lazy"
          />
        ) : (
          <>
            {expanded ? msg.text : msg.text.slice(0, MAX_TEXT_LENGTH) + "..."}
            {msg.text.length > MAX_TEXT_LENGTH && (
              <span
                className="text-blue-500 hover:underline ml-1 cursor-pointer"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Thu gọn" : "Xem thêm"}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
