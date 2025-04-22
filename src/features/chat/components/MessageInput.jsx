/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import FileIcon from "@assets/chat/file_icon.svg";
import PictureIcon from "@assets/chat/picture_icon.svg";
import EmojiIcon from "@assets/chat/emoji_icon.svg";
import SendIcon from "@assets/chat/send_icon.svg";
import EmojiPicker from "emoji-picker-react"; // dùng thư viện emoji-picker-react

export default function MessageInput({ onSend, isMember }) {
  const [input, setInput] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMemberState, setIsMember] = useState(isMember);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null); // dùng để thao tác con trỏ input

  useEffect(() => {
    setIsMember(isMember);
  }, [isMember]);

  useEffect(() => {
    if (imageFiles.length > 0) {
      const previews = imageFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
      return () => {
        previews.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [imageFiles]);

  useEffect(() => {
    if (videoFiles.length > 0) {
      const previews = videoFiles.map((file) => URL.createObjectURL(file));
      setVideoPreviews(previews);
      return () => {
        previews.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [videoFiles]);

  useEffect(() => {
    if (file) {
      const filePreview = {
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
      };
      setFilePreviews([filePreview]);
    } else {
      setFilePreviews([]);
    }
  }, [file]);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const handleImageOrVideoSelect = (e) => {
    const files = Array.from(e.target.files);
    // nếu file là ảnh
    if (files.some((file) => file.type.startsWith("image/"))) {
      setImageFiles(files);
    }
    // nếu file là video
    else if (files.some((file) => file.type.startsWith("video/"))) {
      setVideoFiles(files);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideoFiles((prev) => prev.filter((_, i) => i !== index));
    setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeFile = () => {
    setFile(null);
    setFilePreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async () => {
    if (!input.trim() && !imageFiles.length && !file && !videoFiles.length)
      return;

    setIsLoading(true);
    try {
      if (input.trim()) {
        await onSend({
          content: input.trim(),
          type: "TEXT",
        });
      }

      if (imageFiles.length > 0) {
        await onSend({
          type: "IMAGE",
          files: imageFiles,
        });
      }

      if (videoFiles.length > 0) {
        await onSend({
          type: "VIDEO",
          files: videoFiles,
        });
      }

      if (file) {
        await onSend({
          type: "FILE",
          files: [file],
        });
      }

      setInput("");
      setImageFiles([]);
      setVideoFiles([]);
      setImagePreviews([]);
      setVideoPreviews([]);
      setFile(null);
      setFilePreviews([]);
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Send message error:", error);
      alert("Gửi tin nhắn thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const onEmojiClick = (emojiData) => {
    const cursorPos = inputRef.current.selectionStart;
    const newText =
      input.slice(0, cursorPos) + emojiData.emoji + input.slice(cursorPos);
    setInput(newText || "");

    // Cập nhật vị trí con trỏ sau khi thêm emoji
    setTimeout(() => {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(
        cursorPos + emojiData.emoji.length,
        cursorPos + emojiData.emoji.length
      );
    }, 0);
  };

  return (
    <div className="relative flex flex-col w-full">
      {/* Previews (chỉ hiển thị 1 trong 2: image hoặc video) */}
      {(imagePreviews.length > 0 ||
        videoPreviews.length > 0 ||
        filePreviews.length > 0) && (
        <div className="p-2 mx-3 border-t border-gray-200">
          {/* Hiển thị image previews nếu có */}
          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="object-cover w-16 h-16 rounded"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-2 -right-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Hiển thị video previews nếu có */}
          {videoPreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {videoPreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <video
                    src={preview}
                    controls
                    className="object-cover w-16 h-16 rounded"
                  />
                  <button
                    onClick={() => removeVideo(index)}
                    className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-2 -right-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Hiển thị file preview nếu có */}
          {filePreviews.length > 0 && (
            <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
              <div className="flex items-center">
                <div className="mr-2">📄</div>
                <div>
                  <div className="max-w-xs text-sm font-medium truncate">
                    {filePreviews[0].name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {filePreviews[0].size}
                  </div>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-[70px] right-4 z-10">
          <EmojiPicker onEmojiClick={onEmojiClick} theme="light" />
        </div>
      )}

      <div className="flex items-center p-3 border-t">
        {isLoading || !isMemberState ? (
          <></>
        ) : (
          <label className="mr-2 cursor-pointer hover:opacity-70">
            <img src={FileIcon} alt="File" />
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
          </label>
        )}

        <div
          className="flex-1 flex h-12 border rounded-[32px] items-center bg-[#F6F6F6] px-4
           focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-300"
        >
          {isLoading || !isMemberState ? (
            <input
              type="text"
              placeholder="You cannot message this conversation"
              className="w-full text-sm italic outline-none bg-inherit placeholder:text-center"
              disabled={true}
            />
          ) : (
            <>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                type="text"
                placeholder="Type a message..."
                className="w-full text-sm outline-none bg-inherit"
              />
              <label className="cursor-pointer hover:opacity-70">
                <img src={PictureIcon} className="p-2" alt="Picture" />
                <input
                  type="file"
                  // accept="image/*,video/*"
                  accept="image/*,video/*"
                  className="hidden"
                  multiple
                  ref={imageInputRef}
                  onChange={handleImageOrVideoSelect}
                  disabled={isLoading}
                />
              </label>
              <button
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="px-2 bg-inherit hover:border-transparent hover:opacity-70"
              >
                <img src={EmojiIcon} alt="Emoji" />
              </button>
            </>
          )}
        </div>
        {isLoading || !isMemberState ? (
          <></>
        ) : (
          <div
            onClick={handleSend}
            className={`px-4 py-2 ml-1 duration-200 ease-in-out cursor-pointer hover:translate-x-2 ${
              isLoading ? "opacity-50" : ""
            }`}
          >
            <img src={SendIcon} alt="Send" />
          </div>
        )}
      </div>
    </div>
  );
}
