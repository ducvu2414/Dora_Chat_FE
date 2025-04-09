/* eslint-disable react/prop-types */
import Avatar from "@assets/chat/avatar.png";
import { AiOutlineDownload, AiOutlinePaperClip } from "react-icons/ai";

import { useState } from "react";

export default function MessageItem({ msg, showAvatar, showTime }) {
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const [expanded, setExpanded] = useState(false);
  const MAX_TEXT_LENGTH = 350;
  console.log("tin nhắn", msg);
  const isImage = (type) => type === "IMAGE";
  const isFile = msg.type === "FILE";
  const isMe = msg.memberId.userId === userId;
  return (
    <div
      key={msg._id}
      className={`flex items-end gap-2 ${
        msg.memberId.userId === userId ? " flex-row-reverse" : "justify-start"
      }`}
    >
      {/* Hiển thị avatar nếu là tin nhắn cuối trong nhóm */}
      {showAvatar ? (
        <img
          src={Avatar}
          alt="avatar"
          className="self-start w-10 h-10 rounded-full"
        />
      ) : (
        <div className="w-10 h-10 rounded-full"></div>
      )}

      {/* Nội dung tin nhắn */}
      <div key={msg._id} className="flex flex-col max-w-[468px]   text-start">
        {/* Nếu tin nhắn là hình ảnh */}
        {isImage(msg.type) ? (
          <img
            src={msg.content}
            alt="sent image"
            className="max-w-[468px] max-h-[468px] object-contain rounded-lg"
            loading="lazy"
          />
        ) : isFile ? (
          <div className="px-3 py-[14px]  rounded-2xl flex flex-col items-center gap-1 bg-[#EFF8FF] ">
            <div className="w-[120px] h-[120px] flex items-center justify-center bg-[#F5F5F5] rounded-md">
              <AiOutlineDownload
                size={24}
                className="text-[#086DC0] font-medium"
              />
            </div>

            {/* Link tải file */}
            <a
              href={msg.content}
              download
              className="flex items-center text-[#086DC0] text-sm hover:underline mt-2"
            >
              <AiOutlinePaperClip size={20} className="mr-1" />
              {msg.fileName || "Tải xuống file"}
            </a>
          </div>
        ) : (
          <p
            className={`px-3 py-[14px] rounded-2xl text-sm break-words w-full
           ${
             isMe
               ? "bg-[#EFF8FF] text-[#000000] ml-auto"
               : "bg-[#F5F5F5] text-[#000000]"
           }`}
          >
            {expanded ? msg.content : msg.content.slice(0, MAX_TEXT_LENGTH)}
            {msg.content.length > MAX_TEXT_LENGTH && (
              <span
                className="text-[#086DC0] hover:underline ml-1 cursor-pointer"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Thu gọn" : "Xem thêm"}
              </span>
            )}
          </p>
        )}
        {showTime && (
          <span
            className={`text-xs text-[#959595F3] mt-2 ${
              isMe ? "self-end" : ""
            }`}
          >
            {msg.createdAt}
          </span>
        )}
      </div>
    </div>
  );
}
