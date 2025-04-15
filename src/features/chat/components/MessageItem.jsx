/* eslint-disable react/prop-types */
import Avatar from "@assets/chat/avatar.png";
import { AiOutlinePaperClip } from "react-icons/ai";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState, useEffect } from "react";
import MessageActionsMenu from "./MessageActionsMenu";
import { MdError } from "react-icons/md";

export default function MessageItem({ msg, showAvatar, showTime }) {
  dayjs.extend(relativeTime);
  const userId = JSON.parse(localStorage.getItem("user"))?._id;
  const [expanded, setExpanded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [hoverVideoUrl, setHoverVideoUrl] = useState("");
  const MAX_TEXT_LENGTH = 350;

  const isImage = msg.type === "IMAGE";
  const isFile = msg.type === "FILE";
  const isVideo = msg.type === "VIDEO";
  const isMe = msg.memberId?.userId === userId;

  useEffect(() => {
    if (!msg?.content) return; // Kiểm tra nếu msg.content không tồn tại

    try {
      const videoParts = msg.content.split("videos/");
      if (videoParts.length < 2) {
        throw new Error("Invalid video URL format");
      }

      const videoPath = videoParts[1];
      const videoIdParts = videoPath.split(".");
      if (videoIdParts.length === 0) {
        throw new Error("Invalid video file name");
      }

      const videoId = videoIdParts[0];
      const generatedThumbnailUrl = `https://res.cloudinary.com/dicvz8vw5/video/upload/so_1.0,f_jpg,w_500/videos/${videoId}.jpg`;
      const generatedHoverVideoUrl = msg.content.replace(
        "/upload/",
        "/upload/du_10,q_auto,w_500/"
      );

      setThumbnailUrl(generatedThumbnailUrl);
      setHoverVideoUrl(generatedHoverVideoUrl);
    } catch (error) {
      console.error("Error generating video URLs:", error);

      setThumbnailUrl("");
      setHoverVideoUrl("");
    }
  }, [msg?.content]);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
    setVideoError(false);
  };

  const handleVideoError = () => {
    setVideoLoaded(false);
  };

  useEffect(() => {
    setVideoLoaded(true);
    setVideoError(false);
  }, [msg._id]);

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
          <div className="relative">
            {!videoLoaded && !videoError && (
              <div className="bg-gray-100 rounded-lg flex items-center justify-center w-[300px] h-[200px]">
                <div className="animate-pulse">Đang tải video...</div>
              </div>
            )}

            {videoError && (
              <div className="bg-gray-100 rounded-lg flex flex-col items-center justify-center w-[300px] h-[150px] p-4">
                <MdError size={32} className="text-red-500 mb-2" />
                <p className="text-sm text-gray-600 text-center">
                  Không thể tải video
                </p>
              </div>
            )}

            {/* Container video */}
            <div
              className="relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => setIsClicked(true)}
            >
              {/* Hiển thị thumbnail khi không hover và chưa click */}
              {!isClicked && !isHovered && thumbnailUrl && (
                <img
                  src={thumbnailUrl}
                  className="max-w-[468px] max-h-[468px] object-contain rounded-lg cursor-pointer"
                  alt="Image thumbnail"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "fallback-thumbnail.jpg"; // Fallback nếu thumbnail lỗi
                  }}
                />
              )}

              {/* Hiển thị video hover khi hover và chưa click */}
              {!isClicked && isHovered && (
                <video
                  src={hoverVideoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="max-w-[468px] max-h-[468px] object-contain rounded-lg cursor-pointer"
                />
              )}

              {/* Hiển thị video đầy đủ khi click */}
              {isClicked && (
                <video
                  src={msg.content}
                  controls
                  className="max-w-[468px] max-h-[468px] object-contain rounded-lg"
                  onLoadedData={handleVideoLoad}
                  onError={handleVideoError}
                />
              )}
            </div>
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
