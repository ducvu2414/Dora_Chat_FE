/* eslint-disable react-hooks/exhaustive-deps */
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
import memberApi from "@/api/member";
import { SOCKET_EVENTS } from "../../utils/constant";
import { socket } from "../../utils/socketClient";

export default function ChatSingle() {
  const { id: conversationId } = useParams();
  const dispatch = useDispatch();
  const { messages, unread } = useSelector((state) => state.chat);
  const conversationMessages = messages[conversationId] || [];
  const [conversation, setConversation] = useState(null);
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [photosVideos, setPhotosVideos] = useState([]);
  const [files, setFiles] = useState([]);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!conversationId) return;

      try {
        dispatch(setActiveConversation(conversationId));

        let res = null;
        let channels = [];

        try {
          res = await conversationApi.getConversationById(conversationId);
          channels = await channelApi.getAllChannelByConversationId(
            conversationId
          );
          const isMember = (
            await memberApi.isMember(
              conversationId,
              JSON.parse(localStorage.getItem("user"))._id
            )
          ).data;
          const mappedChannels = channels.map((channel) => ({
            id: channel._id,
            label: channel.name,
          }));
          setIsMember(isMember);
          setChannels(mappedChannels);
          setConversation(res);
          setActiveChannel(channels[0]?._id || null);
        } catch (error) {
          console.error("Error fetching conversation:", error);
        }

        if (res) {
          if (!res.type) {
            try {
              const messages = await messageApi.fetchMessages(conversationId);
              dispatch(setMessages({ conversationId, messages }));
            } catch (error) {
              console.error("Error fetching messages:", error);
            }
          } else {
            try {
              const messages = await messageApi.fetchMessagesByChannelId(
                channels[0]?._id
              );
              dispatch(setMessages({ conversationId, messages }));
            } catch (error) {
              console.error("Error fetching messages by channel:", error);
            }
          }
        }

        if (unread[conversationId] > 0) {
          dispatch(markRead({ conversationId }));
        }
      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    };

    fetchData();
  }, [conversationId, dispatch, unread]);

  useEffect(() => {
    // filter type message is image, video in array conversationMessages
    const photosVideos = conversationMessages.filter(
      (message) => message.type === "IMAGE" || message.type === "VIDEO"
    );

    const files = conversationMessages.filter(
      (message) => message.type === "FILE"
    );

    const links = conversationMessages.filter(
      (message) => message.type === "TEXT" && message.content.includes("http")
    );

    setPhotosVideos(photosVideos);
    setFiles(files);
    setLinks(links);

  }, [conversationMessages.length]);

  useEffect(() => {
    socket.on(SOCKET_EVENTS.UPDATE_NAME_CONVERSATION, (name) => {
      if (name) {
        setConversation((prev) => ({ ...prev, name }));
      }
    });
  });

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
              <MessageInput onSend={handleSendMessage} isMember={isMember} />
            </div>

            {/* DetailChat*/}
            <div
              className={`bg-white shadow-xl transition-all duration-200 my-3 rounded-[20px]  ${
                showDetail ? "w-[385px]" : "w-0"
              }`}
            >
              {/* log messages */}
              {showDetail && <DetailChat conversation={conversation} imagesVideos={photosVideos} files={files} links={links} />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
