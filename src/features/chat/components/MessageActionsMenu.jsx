/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import messageApi from "../../../api/message";
import pinMessageApi from "../../../api/pinMessage";
import memberApi from "../../../api/member";
import ForwardMessageModal from "./ForwardMessageModal";
import { REACT_ICONS } from "../../../utils/constant";
import { AlertMessage } from "@/components/ui/alert-message";

export default function MessageActionsMenu({
  isMe,
  messageId,
  conversationId,
  message,
  type,
  isOpen,
  setIsOpen,
  onReply,
}) {
  const [showAbove, setShowAbove] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [showReactions, setShowReactions] = useState(false); // Trạng thái hiển thị reactions

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Toggle menu bằng click
  const toggleMenu = (e) => {
    e.stopPropagation();
    if (!isOpen) {
      calculateMenuPosition();
    }
    setIsOpen(!isOpen);
    setShowReactions(false);
  };

  // Tính toán vị trí menu
  const calculateMenuPosition = () => {
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const menuHeight = menuRef.current?.offsetHeight || 0;
    const windowHeight = window.innerHeight;
    const spaceBelow = windowHeight - buttonRect.bottom;
    setShowAbove(spaceBelow < menuHeight + 100);
  };

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setShowReactions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen, setIsOpen]);

  const handleRecallMessage = async () => {
    try {
      await messageApi.recallMessage(messageId, conversationId);
      setIsOpen(false);
    } catch (error) {
      console.error("Error recalling message:", error);
      AlertMessage({
        type: "error",
        message: error.response?.data?.message || "Message cannot be recalled",
      });
    }
  };

  const handleForwardMessage = () => {
    setShowForwardModal(true);
    setIsOpen(false);
  };

  const handleDeleteForMe = async () => {
    try {
      const res = await messageApi.deleteMessageForMe(
        messageId,
        conversationId
      );
      console.log("Deleted message for me:", res);
      setIsOpen(false);
    } catch (error) {
      console.error("Error deleting message for me:", error);
      AlertMessage({
        type: "error",
        message: error.response?.data?.message || "Cannot delete message",
      });
    }
  };

  const handlePinMessage = async () => {
    try {
      const res = await pinMessageApi.addPinMessage(
        messageId,
        conversationId,
        await memberApi
          .getByConversationIdAndUserId(
            conversationId,
            JSON.parse(localStorage.getItem("user"))._id
          )
          .then((res) => res.data._id)
      );
      console.log("Pinned message:", res);
      setIsOpen(false);
    } catch (error) {
      console.error("Error pin message:", error);
      AlertMessage({
        type: "error",
        message: error.response?.data?.message || "Cannot pin message",
      });
    }
  };

  const handleSpeakMessage = async () => {
    try {
      const res = await messageApi.convertTextToSpeech(message.content, 1, 1.0);
      if (res.success && res.url) {
        setAudioUrl(null);
        setTimeout(() => {
          setAudioUrl(res.url);
        }, 1000);
        setIsOpen(false);
      } else {
        throw new Error("TTS API không trả về URL");
      }
    } catch (error) {
      console.error("Lỗi TTS:", error);
    }
  };

  // Xử lý chọn reaction
  const handleReactMessage = async (reactType) => {
    try {
      const res = await messageApi.reactToMessage({
        conversationId,
        messageId,
        reactType,
      });
      console.log("Reacted to message:", res);
      setShowReactions(false);
      setIsOpen(false);
    } catch (error) {
      console.error("Error reacting to message:", error);
      AlertMessage({
        type: "error",
        message: error.response?.data?.message || "Cannot react to message",
      });
    }
  };
  // Xử lý chọn Reply
  const handleReply = () => {
    onReply({
      messageId,
      content: message.content,
      type,
      member: message.memberId.name,
    });
    setIsOpen(false);
  };
  return (
    <>
      <div className="relative">
        {/* Button với cả hover và click */}
        <button
          className={`p-1 rounded-full transition-colors duration-200 ${
            isOpen ? "bg-gray-200" : "hover:bg-gray-200"
          }`}
          onClick={toggleMenu}
          ref={buttonRef}
          aria-label="Message actions"
        >
          <HiOutlineDotsHorizontal size={18} />
        </button>

        {/* Menu dropdown */}
        {isOpen && (
          <div
            className={`absolute ${
              showAbove ? "bottom-full mb-1" : "top-full mt-1"
            } right-0 bg-white border rounded-md shadow-md z-50 py-1 min-w-[140px] z-100000000`}
            ref={menuRef}
          >
            <button
              className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 bg-transparent"
              onClick={() => setShowReactions(!showReactions)}
            >
              React
            </button>
            <button
              className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 bg-transparent"
              onClick={handleReply}
            >
              Reply
            </button>
            <button
              className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 bg-transparent"
              onClick={handleForwardMessage}
            >
              Forward
            </button>
            {isMe && (
              <button
                className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 bg-transparent"
                onClick={handleRecallMessage}
              >
                Retrieve
              </button>
            )}
            <button
              className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 bg-transparent"
              onClick={handleDeleteForMe}
            >
              Delete my side
            </button>
            <button
              className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 bg-transparent"
              onClick={handlePinMessage}
            >
              Pin
            </button>
            {type === "TEXT" && (
              <button
                className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100"
                onClick={handleSpeakMessage}
              >
                Speak Message
              </button>
            )}
            {/* Menu reactions */}
            {showReactions && (
              <div className="absolute z-50 flex gap-2 p-2 ml-2 bg-white border rounded-md shadow-md -top-12 -left-10">
                {Object.entries(REACT_ICONS).map(([type, icon]) => (
                  <button
                    key={type}
                    className="p-1 text-sm rounded-full hover:bg-gray-100"
                    onClick={() => handleReactMessage(Number(type))}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {audioUrl && (
        <audio
          key={audioUrl}
          src={audioUrl}
          autoPlay
          onEnded={() => setAudioUrl(null)}
          style={{ display: "block" }}
        />
      )}

      {showForwardModal && (
        <ForwardMessageModal
          message={{
            _id: messageId,
            content: message.content,
            conversationId,
            type,
          }}
          onClose={() => setShowForwardModal(false)}
        />
      )}
    </>
  );
}
