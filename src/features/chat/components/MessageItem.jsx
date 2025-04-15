/* eslint-disable react/prop-types */
import Avatar from "@assets/chat/avatar.png";
import { AiOutlinePaperClip } from "react-icons/ai";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import MessageActionsMenu from "./MessageActionsMenu";

export default function MessageItem({ msg, showAvatar, showTime }) {
  dayjs.extend(relativeTime);

  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const [expanded, setExpanded] = useState(false);

  const MAX_TEXT_LENGTH = 350;
  const isImage = msg.type === "IMAGE";
  const isFile = msg.type === "FILE";
  const isVideo = msg.type === "VIDEO";
  const isMe = msg.memberId.userId === userId;

  const getVideoThumbnail = (url) => {
    const parts = url.split("/upload/");
    if (parts.length === 2) {
      return `${parts[0]}/upload/du_10,q_auto,w_500/${parts[1]}`;
    }
    return url;
  };

  const getFileTypeLabel = (url = "") => {
    const ext = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) return "Hình ảnh";
    if (["mp4", "mov", "avi", "webm"].includes(ext)) return "Video";
    if (["pdf"].includes(ext)) return "PDF";
    if (["doc", "docx"].includes(ext)) return "Word";
    if (["xls", "xlsx", "csv"].includes(ext)) return "Excel";
    if (["zip", "rar", "7z"].includes(ext)) return "Lưu trữ";
    if (["mp3", "wav", "ogg"].includes(ext)) return "Âm thanh";
    return "Tệp khác";
  };

  const handleOpenInNewTab = () => {
    const url = encodeURIComponent(msg.content);
    const name = encodeURIComponent(msg.content?.split("/").pop());
    window.open(`/preview?url=${url}&name=${name}`, "_blank");
  };

  return (
    <div
      key={msg._id}
      className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "justify-start"} group`}
    >
      {showAvatar ? (
        <img src={Avatar} alt="avatar" className="self-start w-10 h-10 rounded-full" />
      ) : (
        <div className="w-10 h-10 rounded-full" />
      )}

      <div className="flex flex-col max-w-[468px] text-start relative">
        <div
          className={`absolute top-3 ${isMe ? "left-[-30px]" : "right-[-30px]"} opacity-0 group-hover:opacity-100 transition-opacity`}
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

        {isImage ? (
          <img
            src={msg.content}
            alt="sent"
            className="max-w-[468px] max-h-[468px] object-contain rounded-lg"
          />
        ) : isVideo ? (
          <div className="px-3 py-[14px] rounded-2xl flex flex-col items-center gap-2 bg-[#EFF8FF]">
            <img
              src={getVideoThumbnail(msg.content)}
              alt="video thumbnail"
              className="cursor-pointer w-[120px] h-[120px] object-cover rounded-md border"
              onClick={handleOpenInNewTab}
            />
            <span className="text-[#086DC0] text-sm">{'file' + msg.content.split("file").pop() || "Xem video"}</span>
            <span className="text-xs text-gray-500">Loại: {getFileTypeLabel(msg.content)}</span>
            <span
              onClick={handleOpenInNewTab}
              className="text-xs text-[#086DC0] hover:underline cursor-pointer"
            >
              Xem trước
            </span>
          </div>
        ) : isFile ? (
          <div className="px-3 py-[14px] rounded-2xl flex flex-col items-center gap-2 bg-[#EFF8FF]">
            <div className="w-[120px] h-[120px] bg-[#F5F5F5] rounded-md flex items-center justify-center text-[#086DC0] text-sm">
              File
            </div>
            <a
              href={msg.content}
              download
              className="flex items-center text-[#086DC0] text-sm hover:underline"
            >
              <AiOutlinePaperClip size={20} className="mr-1" />
              {'file' + msg.content.split("file").pop() || "Tải xuống file"}
            </a>
            <span className="text-xs text-gray-500">Loại: {getFileTypeLabel(msg.content)}</span>
            <span
              onClick={handleOpenInNewTab}
              className="text-xs text-[#086DC0] hover:underline cursor-pointer"
            >
              Xem trước
            </span>
          </div>
        ) : (
          <p
            className={`px-3 py-[14px] rounded-2xl text-sm break-words w-full
              ${msg.isDeleted
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
          <span className={`text-xs text-[#959595F3] mt-2 ${isMe ? "self-end" : ""}`}>
            {dayjs(msg.createdAt).fromNow()}
          </span>
        )}
      </div>
    </div>
  );
}
