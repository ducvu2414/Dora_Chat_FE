import messageApi from "@/api/message";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Spinner } from "@/page/Spinner";
import {
  markRead,
  setActiveConversation,
  setMessages,
} from "../../features/chat/chatSlice";
import ChatBox from "./components/ChatBox";
import DetailChat from "./components/DetailChat";
import HeaderSignleChat from "./components/HeaderSignleChat";
import MessageInput from "./components/MessageInput";
import conversationApi from "@/api/conversation";
import channelApi from "@/api/channel";

export default function ChatSingle() {
  const { id: conversationId } = useParams();
  const dispatch = useDispatch();
  const { messages, unread } = useSelector((state) => state.chat);
  const conversationMessages = messages[conversationId] || [];
  const [conversation, setConversation] = useState(null);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        dispatch(setActiveConversation(conversationId)); // Đặt cuộc trò chuyện đang mở
        const fetchConversation = async () => {
          try {
            const res = await conversationApi.getConversationById(
              conversationId
            );
            const channels = await channelApi.getAllChannelByConversationId(
              conversationId
            );
            const mappedChannels = channels.map((channel) => ({
              id: channel._id,
              label: channel.name,
            }));
            setChannels(mappedChannels);
            setConversation(res);
          } catch (error) {
            console.error("Error fetching conversation:", error);
          }
        };
        fetchConversation();
        // Lấy tin nhắn ban đầu
        messageApi
          .fetchMessages(conversationId)
          .then((res) => {
            dispatch(setMessages({ conversationId, messages: res }));
          })
          .catch((error) => {
            console.error("Error fetching messages:", error);
          });

        // Đánh dấu đã đọc
        if (unread[conversationId] > 0) {
          dispatch(markRead({ conversationId }));
        }
      } catch (error) {
        console.error("Error in useEffect:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [conversationId, dispatch, unread]);

  const handleSendMessage = async ({ content, type, files }) => {
    try {
      if (type === "TEXT") {
        await messageApi.sendTextMessage({ conversationId, content });
      } else if (type === "IMAGE") {
        await messageApi.sendImageMessage(conversationId, files);
      } else if (type === "FILE") {
        await messageApi.sendFileMessage(conversationId, files[0]);
      } else if (type === "VIDEO") {
        await messageApi.sendVideoMessage(conversationId, files[0]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      {loading || !conversation || channels.length === 0 ? (
        <div className="flex items-center justify-center w-full h-screen bg-white">
          <Spinner />
        </div>
      ) : (
        <div className="flex w-full h-screen">
          {/* Main Content */}
          <div className="flex flex-1 overflow-sauto ">
            {/* ChatBox  */}
            <div className="flex flex-col flex-1 bg-gradient-to-b from-blue-50/50 to-white">
              <HeaderSignleChat
                channelTabs={channels}
                activeTab={channels[0].id}
                handleDetail={setShowDetail}
                conversation={conversation}
              />
              <ChatBox messages={conversationMessages} />
              <MessageInput onSend={handleSendMessage} />
            </div>

            {/* DetailChat*/}
            <div
              className={`bg-white shadow-xl transition-all duration-200 my-3 rounded-[20px]  ${
                showDetail ? "w-[385px]" : "w-0"
              }`}
            >
              {showDetail && <DetailChat isConversation={conversation.type} conversationId={conversationId} />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
