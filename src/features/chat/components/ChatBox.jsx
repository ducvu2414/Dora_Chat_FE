/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import {
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import MessageItem from "./MessageItem";
import memberApi from "@/api/member";

const ChatBox = forwardRef(
  (
    { messages, onReply, onSelected, member, onSave, onLock, onLoadMore },
    ref
  ) => {
    const [enrichedMessages, setEnrichedMessages] = useState([]);

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

    useEffect(() => {
      const enrichMessages = async () => {
        const updated = await Promise.all(
          messages.map(async (msg) => {
            if (typeof msg.memberId === "object") return msg;

            try {
              const res = await memberApi.getByMemberId(msg.memberId);
              return {
                ...msg,
                memberId: {
                  _id: res.data._id,
                  userId: res.data.userId,
                  name: res.data.name,
                  avatar: res.data.avatar,
                },
              };
            } catch (err) {
              console.error("Error fetching member:", err);
              console.error("Failed to fetch member:", msg.memberId);
              return msg;
            }
          })
        );

        setEnrichedMessages(updated);
      };

      if (messages.length > 0) enrichMessages();
    }, [messages]);

    // Tự động cuộn xuống khi có tin nhắn mới
    useEffect(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }, [messages.length]);

    useEffect(() => {
      const container = chatContainerRef.current;
      if (!container) return;

      const handleScroll = () => {
        if (container.scrollTop < 100) {
          onLoadMore();
        }
      };

      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }, [onLoadMore]);

    return (
      <div className="flex-1 flex flex-col h-px bg-[#fff] py-2">
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto space-y-2 p-4 max-h-[calc(100vh-210px)]"
        >
          {enrichedMessages.map((msg, index) => {
            const currentUserId = msg.memberId?.userId;
            const prevUserId =
              index > 0 ? enrichedMessages[index - 1]?.memberId?.userId : null;
            const nextUserId =
              index < enrichedMessages.length - 1
                ? enrichedMessages[index + 1]?.memberId?.userId
                : null;

            const isFirstInGroup =
              index === 0 ||
              !prevUserId ||
              !currentUserId ||
              prevUserId !== currentUserId;
            const isLastInGroup =
              index === enrichedMessages.length - 1 ||
              !nextUserId ||
              !currentUserId ||
              nextUserId !== currentUserId;

            if (!currentUserId) return null;

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
                  onReply={onReply}
                  messages={enrichedMessages}
                  handleScrollToMessage={scrollToMessage}
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
