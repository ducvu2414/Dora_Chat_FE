/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import messageApi from "../../../api/message";
import pinMessageApi from "../../../api/pinMessage";
import memberApi from "../../../api/member";
import ForwardMessageModal from "./ForwardMessageModal";

export default function MessageActionsMenu({
  isMe,
  messageId,
  conversationId,
  messageContent,
  type,
  isOpen,
  setIsOpen,
}) {
  const [showAbove, setShowAbove] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Toggle menu bằng click
  const toggleMenu = (e) => {
    e.stopPropagation();
    if (!isOpen) {
      calculateMenuPosition();
    }
    setIsOpen(!isOpen);
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
      alert("Message cannot be recalled");
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
      alert("Cannot delete message");
    }
  };

  const handlePinMessage = async () => {
    try {
      const res = await pinMessageApi.addPinMessage(
        messageId,
        conversationId,
        await memberApi.getByConversationIdAndUserId(conversationId, JSON.parse(localStorage.getItem('user'))._id).then((res) => res.data._id)
      );
      console.log("Pinned message:", res);
      setIsOpen(false);
    } catch (error) {
      console.error("Error pin message:", error);
      alert(error.response?.data?.message);
    }
  };



  const handleSpeakMessage = async () => {
    try {
      const res = await messageApi.convertTextToSpeech(
        messageContent,
        1,
        1.0
      );
      if (res.success && res.url) {
        setAudioUrl(null);
        setTimeout(() => {
          setAudioUrl(res.url);
        }, 100);
        setIsOpen(false);
      } else {
        throw new Error("TTS API không trả về URL");
      }
    } catch (error) {
      console.error("Lỗi TTS:", error);
    }
  };

  return (
    <>
      <div className="relative">
        {/* Button với cả hover và click */}
        <button
          className={`p-1 rounded-full transition-colors duration-200 ${isOpen ? "bg-gray-200" : "hover:bg-gray-200"
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
            className={`absolute ${showAbove ? "bottom-full mb-1" : "top-full mt-1"
              } right-0 bg-white border rounded-md shadow-md z-50 py-1 min-w-[140px] z-100000000`}
            ref={menuRef}
          >
            <button className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 bg-transparent">
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
            content: messageContent,
            conversationId,
            type,
          }}
          onClose={() => setShowForwardModal(false)}
        />
      )}
    </>
  );
}
