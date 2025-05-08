/* eslint-disable react/prop-types */
import {
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import MessageItem from "./MessageItem";
const ChatBox = forwardRef(
  ({ messages, onSelected, member, onSave, onLock }, ref) => {
    const chatContainerRef = useRef(null);
    const messageRefs = useRef({});

    const scrollToMessage = useCallback((messageId) => {
      const messageElement = messageRefs.current[messageId];
      if (messageElement) {
        messageElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Highlight message tạm thời (bg-blue-100 and rounded-md, border-2 border-blue-500)
        messageElement.classList.add("rounded-2xl", "bg-blue-100");
        setTimeout(() => {
          messageElement.classList.remove("rounded-2xl", "bg-blue-100");
        }, 2000);
      } else {
        console.log("Message element not found for ID:", messageId);
      }
    }, []);

    // Expose scrollToMessage to parent via ref
    useImperativeHandle(ref, () => ({
      scrollToMessage,
    }));

    const setMessageRef = useCallback((messageId, element) => {
      if (element) {
        messageRefs.current[messageId] = element;
      } else {
        delete messageRefs.current[messageId];
      }
    }, []);

    // Tự động cuộn xuống khi có tin nhắn mới
    useEffect(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }, [messages.length]);

    return (
      <div className="flex-1 flex flex-col h-px bg-[#fff] py-2">
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto space-y-2 p-4 max-h-[calc(100vh-210px)]"
        >
          {messages.map((msg, index) => {
            const isFirstInGroup =
              index === 0 ||
              messages[index - 1].memberId.userId !== msg.memberId.userId;
            const isLastInGroup =
              index === messages.length - 1 ||
              messages[index + 1].memberId.userId !== msg.memberId.userId;

            return (
              <div key={msg._id} ref={(el) => setMessageRef(msg._id, el)}>
                <MessageItem
                  msg={msg}
                  showAvatar={isFirstInGroup}
                  showTime={isLastInGroup}
                  onSelected={onSelected}
                  member={member}
                  onSave={onSave}
                  onLock={onLock}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

export default ChatBox;
