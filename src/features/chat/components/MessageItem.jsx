/* eslint-disable react/prop-types */
import Avatar from "@assets/chat/avatar.png";
import { AiOutlineClose, AiOutlinePaperClip } from "react-icons/ai";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState, useEffect, useRef } from "react";
import MessageActionsMenu from "./MessageActionsMenu";
import { MdError } from "react-icons/md";
import VoteDisplay from "@/components/ui/vote-display";

export default function MessageItem({
  msg,
  showAvatar,
  showTime,
  onSelected,
  onDeselected,
  member,
  onSave,
  onLock,
}) {
  dayjs.extend(relativeTime);
  const userId = JSON.parse(localStorage.getItem("user"))?._id;
  const [previewImage, setPreviewImage] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [hoverVideoUrl, setHoverVideoUrl] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const timeoutRef = useRef(null);

  const MAX_TEXT_LENGTH = 350;

  const isMe = msg.memberId?.userId === userId;
  const isImage = msg.type === "IMAGE";
  const isFile = msg.type === "FILE";
  const isVideo = msg.type === "VIDEO";
  const isNotify = msg.type === "NOTIFY";
  const isLink = msg.type === "TEXT" && msg.content.includes("http");
  const isVote = msg.type === "VOTE";

  useEffect(() => {
    if (!msg?.content) {
      console.warn("Video content is empty");
      setThumbnailUrl("");
      setHoverVideoUrl("");
      return;
    }

    try {
      // Kiểm tra xem URL có phải là Cloudinary video không
      const isCloudinaryVideo =
        msg.content.includes("res.cloudinary.com") &&
        msg.content.includes("/video/upload/");

      if (!isCloudinaryVideo) {
        throw new Error("Not a Cloudinary video URL");
      }

      // Tách public ID từ URL
      const uploadIndex = msg.content.indexOf("/upload/") + "/upload/".length;
      const publicIdWithExt = msg.content.slice(uploadIndex);
      const publicId = publicIdWithExt.split(".")[0];

      if (!publicId) {
        throw new Error("Could not extract public ID from URL");
      }

      const baseUrl = msg.content.split("/upload/")[0] + "/upload/";
      const generatedThumbnailUrl = `${baseUrl}so_1.0,f_jpg,w_500/${publicId}.jpg`;
      const generatedHoverVideoUrl = `${baseUrl}du_10,q_auto,w_500/${publicIdWithExt}`;

      setThumbnailUrl(generatedThumbnailUrl);
      setHoverVideoUrl(generatedHoverVideoUrl);
    } catch (error) {
      console.warn("Video URL processing warning:", error.message);
      setThumbnailUrl("/placeholder-video-thumbnail.jpg");
      setHoverVideoUrl(msg.content);
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
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext))
      return "Hình ảnh";
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

  const handleHover = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleNonHover = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 300);
  };

  return (
    <>
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative">
            <div
              onClick={() => setPreviewImage(null)}
              className="absolute flex items-center justify-center w-8 h-8 transition-colors rounded-full cursor-pointer top-2 right-2 bg-black/50 hover:bg-black/70"
            >
              <AiOutlineClose className="text-lg text-white" />
            </div>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-[90vw] max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
      {isNotify ? (
        <div className="flex justify-center w-full my-4">
          <div className="bg-[#F0F2F5] text-xs text-gray-600 px-4 py-2 rounded-md shadow-sm italic">
            {msg.content}
          </div>
        </div>
      ) : (
        <div
          key={msg._id}
          className={`flex items-end gap-2 ${
            isMe ? "flex-row-reverse" : "justify-start"
          }  mb-4`}
        >
          {showAvatar ? (
            <img
              src={Avatar}
              alt="avatar"
              className="self-start w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full" />
          )}

          <div
            className="flex flex-col max-w-[468px] text-start relative
          group"
            onMouseEnter={handleHover}
            onMouseLeave={handleNonHover}
          >
            <div
              className={`absolute top-3 ${
                isMe ? "left-[-30px]" : "right-[-30px]"
              }`}
            >
              {!msg.isDeleted && (isHovered || menuOpen) && (
                <MessageActionsMenu
                  isMe={isMe}
                  messageId={msg._id.toString()}
                  conversationId={msg.conversationId.toString()}
                  messageContent={msg.content}
                  type={msg.type}
                  isOpen={menuOpen}
                  setIsOpen={setMenuOpen}
                />
              )}
            </div>

            {/* Message sender name (if not showing avatar and not from current user) */}
            {showAvatar && !isMe && (
              <span className="mb-1 ml-1 text-xs font-medium text-gray-500 ">
                {msg.memberId?.name || "User"}
              </span>
            )}

            {/* Message content */}
            {isImage ? (
              <img
                src={msg.content}
                alt="sent"
                className="max-w-[468px] max-h-[468px] object-contain rounded-lg cursor-pointer"
                onClick={() => setPreviewImage(msg.content)}
              />
            ) : isVideo ? (
              <div className="relative">
                {!videoLoaded && !videoError && (
                  <div className="bg-gray-100 rounded-lg flex items-center justify-center w-[300px] h-[200px]">
                    <div className="animate-pulse">Loading video...</div>
                  </div>
                )}

                {videoError && (
                  <div className="bg-gray-100 rounded-lg flex flex-col items-center justify-center w-[300px] h-[150px] p-4">
                    <MdError size={32} className="mb-2 text-red-500" />
                    <p className="text-sm text-center text-gray-600">
                      Video could not be loaded
                    </p>
                  </div>
                )}

                {/* Container video */}
                <div
                  className="relative"
                  onMouseEnter={handleHover}
                  onMouseLeave={handleNonHover}
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
                  {msg.fileName || "Download file"}
                </a>
                <span className="text-xs text-gray-500">
                  Type: {getFileTypeLabel(msg.content)}
                </span>
                <span
                  onClick={handleOpenInNewTab}
                  className="text-xs text-[#086DC0] hover:underline cursor-pointer"
                >
                  Preview
                </span>
              </div>
            ) : isVote ? (
              <div className="px-3 py-[14px] rounded-2xl bg-[#F5F5F5] text-[#000000]">
                <div className="mt-4">
                  <VoteDisplay
                    vote={msg}
                    onSelected={onSelected}
                    onDeselected={onDeselected}
                    member={member}
                    onSave={onSave}
                    onLock={onLock}
                  />
                </div>
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
            }
            ${isLink ? "text-[#086DC0] hover:underline cursor-pointer" : ""}
              
`}
                onClick={() => {
                  if (isLink) {
                    window.open(msg.content, "_blank");
                  }
                }}
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
      )}
    </>
  );
}
