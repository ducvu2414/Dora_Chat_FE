/* eslint-disable react/prop-types */
import { useState } from "react";
import FileIcon from "@assets/chat/file_icon.svg";
import PitureIcon from "@assets/chat/picture_icon.svg";
import EmojiIcon from "@assets/chat/emoji_icon.svg";
import SendIcon from "@assets/chat/send_icon.svg";
export default function MessageInput({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="p-3 border-t flex items-center">
      <label className="cursor-pointer mr-2">
        <img src={FileIcon} />
        <input type="file" className="hidden" />
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
          className="w-full bg-inherit outline-none text-sm "
        />
        <label className="cursor-pointer">
          <img src={PitureIcon} className="p-2" />
          <input type="file" accept="image/*" className="hidden" />
        </label>

        {/* Nút emoji */}
        <button className="bg-inherit  hover:border-transparent px-2">
          <img src={EmojiIcon} />
        </button>
      </div>
      <div
        onClick={handleSend}
        className="ml-1 px-4 py-2 cursor-pointer hover:translate-x-2 duration-200 ease-in-out"
      >
        <img src={SendIcon} />
      </div>
    </div>
  );
}
