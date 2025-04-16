/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import messageApi from "../../../api/message";
import ForwardMessageModal from "./ForwardMessageModal";
export default function MessageActionsMenu({
  isMe,
  messageId,
  conversationId,
  messageContent,
  type,
}) {
  const [open, setOpen] = useState(false);
  const [showAbove, setShowAbove] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const timeoutRef = useRef(null);
  // Xử lý sự kiện khi di chuột vào
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpen(true);
  };

  // Xử lý sự kiện khi di chuột ra
  const handleMouseLeave = () => {
    // Tạo độ trễ khi rời khỏi để người dùng có thời gian di chuyển chuột
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 300); // 300ms để người dùng có thời gian di chuyển chuột
  };

  // Kiểm tra vị trí và quyết định hiển thị menu phía trên hay phía dưới
  useEffect(() => {
    if (open && menuRef.current && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const menuHeight = menuRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      // Nếu khoảng cách từ nút đến cuối màn hình nhỏ hơn chiều cao menu + 100px (margin)
      const spaceBelow = windowHeight - buttonRect.bottom;
      if (spaceBelow < menuHeight + 100) {
        setShowAbove(true);
      } else {
        setShowAbove(false);
      }
    }
  }, [open]);
  const handleRecallMessage = async () => {
    try {
      await messageApi.recallMessage(messageId, conversationId);
      setOpen(false);
    } catch (error) {
      console.error("Error recalling message:", error);
      alert("Không thể thu hồi tin nhắn");
    }
  };
  const handleForwardMessage = () => {
    setShowForwardModal((prev) => !prev);
    setOpen(false);
  };
  const handleDeleteForMe = async () => {
    try {
      const res = await messageApi.deleteMessageForMe(
        messageId,
        conversationId
      );
      console.log("Deleted message for me:", res);
      // dispatch(
      //   deleteMessageForMe({
      //     messageId,
      //     conversationId,
      //     deletedMemberIds: response.deletedMemberIds,
      //   })
      // );
      setOpen(false);
    } catch (error) {
      console.error("Error deleting message for me:", error);
      alert("Không thể xóa tin nhắn");
    }
  };
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="relative transition-opacity duration-200 opacity-0 group-hover:opacity-100">
        <button
          className="p-1 bg-transparent rounded-full hover:bg-gray-200"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          ref={buttonRef}
        >
          <HiOutlineDotsHorizontal size={18} />
        </button>

        {/* Menu chọn hành động */}
        {open && (
          <div
            className={`absolute ${
              showAbove ? "bottom-full mb-1" : "top-full mt-1"
            } right-0 bg-white border rounded-md shadow-md z-50 py-1 min-w-[140px]`}
            ref={menuRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 bg-transparent">
              Trả lời
            </button>
            <button
              className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 bg-transparent"
              onClick={handleForwardMessage}
            >
              Chuyển tiếp
            </button>
            {isMe && (
              <button
                className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 bg-transparent"
                onClick={handleRecallMessage}
              >
                Thu hồi
              </button>
            )}
            <button
              className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 bg-transparent"
              onClick={handleDeleteForMe}
            >
              Xóa phía tôi
            </button>
            <button className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 bg-transparent">
              Ghim
            </button>
          </div>
        )}
      </div>
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
