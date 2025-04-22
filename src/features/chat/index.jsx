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
  const [activeChannel, setActiveChannel] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setActiveConversation(conversationId)); // Đặt cuộc trò chuyện đang mở
        const fetchConversation = async () => {
          try {
            const res = await conversationApi.getConversationById(
              conversationId
            );
            const channels = await channelApi.getAllChannelByConversationId(
              conversationId
            );
            console.log("res", res);
            const mappedChannels = channels.map((channel) => ({
              id: channel._id,
              label: channel.name,
            }));
            setChannels(mappedChannels);
            setConversation(res);
            setActiveChannel(channels[0]?._id || null); // Đặt kênh đầu tiên làm kênh hoạt động
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
      }
    };

    fetchData();
  }, [conversationId, dispatch, unread]);
  const handleSendMessage = async ({ content, type, files }) => {
    const channelId = activeChannel;
    try {
      if (type === "TEXT") {
        await messageApi.sendTextMessage({
          conversationId,
          content,
          channelId,
        });
      } else if (type === "IMAGE") {
        await messageApi.sendImageMessage(conversationId, files, channelId);
      } else if (type === "FILE") {
        await messageApi.sendFileMessage(conversationId, files[0], channelId);
      } else if (type === "VIDEO") {
        await messageApi.sendVideoMessage(conversationId, files[0], channelId);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };
  const [showDetail, setShowDetail] = useState(false);
  console.log("channels", activeChannel);
  return (
    <>
      {console.log(
        conversation,
        conversation?.type ? channels.length === 0 : false
      )}
      {!conversation ? (
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
                activeTab={activeChannel}
                handleDetail={setShowDetail}
                conversation={conversation}
                setActiveChannel={setActiveChannel}
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
              {showDetail && <DetailChat conversation={conversation} />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
