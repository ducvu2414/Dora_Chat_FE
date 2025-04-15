/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import FileIcon from "@assets/chat/file_icon.svg";
import PictureIcon from "@assets/chat/picture_icon.svg";
import EmojiIcon from "@assets/chat/emoji_icon.svg";
import SendIcon from "@assets/chat/send_icon.svg";
import cloudApi from "@/api/cloud";

export default function MessageInput({ onSend }) {
  const [input, setInput] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [file, setFile] = useState(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSend = async () => {
    if (!input.trim() && !imageFiles.length && !file) return;

    try {
      // Gửi tin nhắn văn bản nếu có
      if (input.trim()) {
        await onSend({
          content: input,
          type: "TEXT",
        });
      }

      // Upload và gửi tin nhắn cho mỗi hình ảnh
      if (imageFiles.length > 0) {
        const uploadedImages = await cloudApi.uploadImages(
          user._id.toString(),
          imageFiles
        );
        for (const img of uploadedImages) {
          await onSend({
            content: img.url,
            type: "IMAGE",
          });
        }
      }

      // Upload và gửi tin nhắn cho file
      if (file) {
        const uploadedFile = await cloudApi.uploadFile(
          user._id.toString(),
          file
        );
        await onSend({
          content: uploadedFile.url,
          type: "FILE",
        });
      }

      // Reset state
      setInput("");
      setImageFiles([]);
      setFile(null);
      imageInputRef.current.value = "";
      fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Không thể gửi tin nhắn");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex items-center p-3 border-t">
      <label className="mr-2 cursor-pointer">
        <img src={FileIcon} />
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileSelect}
        />
      </label>
      <div
        className="flex-1 flex h-12 border rounded-[32px] items-center bg-[#F6F6F6] px-4 
        focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-300"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          type="text"
          placeholder="Type a message..."
          className="w-full text-sm outline-none bg-inherit"
        />
        <label className="cursor-pointer">
          <img src={PictureIcon} className="p-2" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            multiple
            ref={imageInputRef}
            onChange={handleImageSelect}
          />
        </label>
        <button className="px-2 bg-inherit hover:border-transparent">
          <img src={EmojiIcon} />
        </button>
      </div>
      <div
        onClick={handleSend}
        className="px-4 py-2 ml-1 duration-200 ease-in-out cursor-pointer hover:translate-x-2"
      >
        <img src={SendIcon} />
      </div>
    </div>
  );
}
