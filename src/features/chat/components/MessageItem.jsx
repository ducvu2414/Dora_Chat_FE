/* eslint-disable react/prop-types */
import Avatar from "@assets/chat/avatar.png";
import { AiOutlineDownload, AiOutlinePaperClip } from "react-icons/ai";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import MessageActionsMenu from "./MessageActionsMenu";

export default function MessageItem({ msg, showAvatar, showTime }) {
  dayjs.extend(relativeTime);
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const [expanded, setExpanded] = useState(false);
  const MAX_TEXT_LENGTH = 350;
  const isImage = (type) => type === "IMAGE";
  const isFile = msg.type === "FILE";
  const isMe = msg.memberId.userId === userId;

  return (
    <div
      key={msg._id}
      className={`flex items-end gap-2 ${
        isMe ? "flex-row-reverse" : "justify-start"
      } group`} // Thêm class "group" vào đây để làm trigger hover
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
      <div
        key={msg._id}
        className="flex flex-col max-w-[468px] text-start relative"
      >
        <div
          className={`absolute top-3 ${
            isMe ? "left-[-30px]" : "right-[-30px]"
          } opacity-0 group-hover:opacity-100 transition-opacity`}
        >
          {!msg.isDeleted && (
            <MessageActionsMenu
              isMe={isMe}
              messageId={msg._id.toString()}
              conversationId={msg.conversationId.toString()}
              messageContent={msg.content}
            />
          )}
        </div>
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
              msg.isDeleted
                ? "bg-gray-100 text-gray-400 italic"
                : isMe
                ? "bg-[#EFF8FF] text-[#000000] ml-auto"
                : "bg-[#F5F5F5] text-[#000000]"
            }`}
          >
            {expanded ? msg.content : msg.content.slice(0, MAX_TEXT_LENGTH)}
            {!msg.isDeleted && msg.content.length > MAX_TEXT_LENGTH && (
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
            {dayjs(msg.createdAt).fromNow()}
          </span>
        )}
      </div>
    </div>
  );
}
