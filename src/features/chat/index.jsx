/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Spinner } from "@/page/Spinner";
import {
  markRead,
  setActiveConversation,
  setMessages,
  setPinMessages,
  setChannels,
  deleteChannel,
  addMessage,
  updateConversation,
} from "../../features/chat/chatSlice";
import ChatBox from "./components/ChatBox";
import DetailChat from "./components/DetailChat";
import HeaderSignleChat from "./components/HeaderSignleChat";
import MessageInput from "./components/MessageInput";
import channelApi from "@/api/channel";
import memberApi from "@/api/member";
import messageApi from "@/api/message";
import pinMessageApi from "@/api/pinMessage";
import voteApi from "@/api/vote";
import VoteModal from "@/components/ui/vote-modal";
import { AlertMessage } from "@/components/ui/alert-message";

const conversationCache = new Map();
const channelMessagesCache = new Map();

export default function ChatSingle() {
  const { id: conversationId } = useParams();
  const dispatch = useDispatch();
  const { messages, unread, pinMessages, conversations, channels } =
    useSelector((state) => state.chat);

  const conversationMessages = useMemo(
    () => messages[conversationId] || [],
    [messages, conversationId]
  );
  const conversation = useMemo(
    () => conversations.find((conv) => conv._id === conversationId),
    [conversations, conversationId]
  );

  const [activeChannel, setActiveChannel] = useState(null);
  const [isMember, setIsMember] = useState(undefined);
  const [photosVideos, setPhotosVideos] = useState([]);
  const [files, setFiles] = useState([]);
  const [links, setLinks] = useState([]);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [member, setMember] = useState(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [members, setMembers] = useState([]);
  const chatBoxRef = useRef(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [messageSkip, setMessageSkip] = useState(100);
  const [replyMessage, setReplyMessage] = useState(null);
  const [latestFetchedConversationId, setLatestFetchedConversationId] =
    useState(null);

  const isInitialMount = useRef(true);
  const previousConversationId = useRef(conversationId);
  const loadingConversationId = useRef(null);
  const previousChannelId = useRef(activeChannel);
  const loadingChannelId = useRef(null);
  const currentActiveChannelRef = useRef(activeChannel);
  const isSendingMessage = useRef(false);
  const previousActiveChannelRef = useRef(null);

  const debugCache = useCallback(() => {
    console.log("=== CACHE DEBUG ===");
    console.log("Current conversationId:", conversationId);
    console.log("Current activeChannel:", activeChannel);
    console.log(
      "Previous activeChannel ref:",
      previousActiveChannelRef.current
    );
    console.log("Cache contents:");
    for (const [key, value] of channelMessagesCache.entries()) {
      console.log(`  ${key}: ${value.length} messages`);
    }
    console.log("Conversation cache:");
    for (const [key, value] of conversationCache.entries()) {
      console.log(`  ${key}:`, value);
    }
    console.log("==================");
  }, [conversationId, activeChannel]);

  useEffect(() => {
    currentActiveChannelRef.current = activeChannel;
  }, [activeChannel]);

  const clearChannelCache = useCallback(
    (channelId) => {
      if (conversationId && channelId) {
        const cacheKey = `${conversationId}_${channelId}`;
        channelMessagesCache.delete(cacheKey);
      }
    },
    [conversationId]
  );

  const loadMoreMessages = async () => {
    if (loadingMore || !conversationId || !activeChannel) return;

    setLoadingMore(true);

    try {
      const res = await messageApi.fetchMessagesByChannelId(activeChannel, {
        skip: messageSkip,
        limit: 100,
      });

      const existingIds = new Set(
        messages[conversationId]?.map((msg) => msg._id)
      );
      const uniqueMessages = res.filter((msg) => !existingIds.has(msg._id));

      if (uniqueMessages.length === 0) {
        setHasMoreMessages(false);
      } else {
        dispatch(
          setMessages({
            conversationId,
            messages: [...uniqueMessages, ...messages[conversationId]],
          })
        );

        const cacheKey = `${conversationId}_${activeChannel}`;
        const cachedMessages = channelMessagesCache.get(cacheKey) || [];
        channelMessagesCache.set(cacheKey, [
          ...uniqueMessages,
          ...cachedMessages,
        ]);

        setMessageSkip((prev) => prev + uniqueMessages.length);
      }
    } catch (error) {
      console.error("Error loading more messages", error);
      AlertMessage({
        type: "error",
        message: error.response?.data.message || "Error loading more messages",
      });
    } finally {
      setLoadingMore(false);
    }
  };

  const handleChannelChange = useCallback(
    (newChannelId) => {
      const validChannel = channels.find((ch) => ch._id === newChannelId);
      const isFromCorrectConversation =
        latestFetchedConversationId === conversationId;

      if (!validChannel || !isFromCorrectConversation) return;

      setActiveChannel(newChannelId);
    },
    [conversationId, channels, latestFetchedConversationId]
  );

  useEffect(() => {
    if (
      !conversationId ||
      !channels?.length ||
      latestFetchedConversationId !== conversationId
    )
      return;

    const defaultChannel = channels[0]?._id || null;
    setActiveChannel(defaultChannel);
  }, [conversationId, channels, latestFetchedConversationId]);

  useEffect(() => {
    if (previousConversationId.current !== conversationId) {
      const oldConversationId = previousConversationId.current;
      const oldActiveChannel = previousActiveChannelRef.current;

      if (oldConversationId && member && oldActiveChannel) {
        const oldCacheKey = `${oldConversationId}_${oldActiveChannel}`;
        const currentMessages = messages[oldConversationId] || [];

        if (currentMessages.length > 0) {
          channelMessagesCache.set(oldCacheKey, currentMessages);
        }

        const oldConvData = {
          activeChannel: oldActiveChannel,
          isMember,
          member,
          members,
          photosVideos,
          files,
          links,
        };
        conversationCache.set(oldConversationId, oldConvData);
      }

      if (oldConversationId) {
        const keysToDelete = [];
        for (const key of channelMessagesCache.keys()) {
          if (key.startsWith(oldConversationId + "_")) {
            keysToDelete.push(key);
          }
        }
        keysToDelete.forEach((key) => channelMessagesCache.delete(key));
      }

      setActiveChannel(null);
      currentActiveChannelRef.current = null;
      previousActiveChannelRef.current = null;

      setIsMember(undefined);
      setPhotosVideos([]);
      setFiles([]);
      setLinks([]);
      setReplyMessage(null);
      setMessageSkip(100);
      setHasMoreMessages(true);
      setIsLoadingMessages(true);

      if (conversationCache.has(conversationId)) {
        const cachedData = conversationCache.get(conversationId);

        setIsMember(cachedData.isMember);
        setMember(cachedData.member);
        setMembers(cachedData.members);
        setPhotosVideos(cachedData.photosVideos || []);
        setFiles(cachedData.files || []);
        setLinks(cachedData.links || []);
        setIsLoadingMessages(false);
      }

      previousConversationId.current = conversationId;
      previousChannelId.current = null;
    }
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId || loadingConversationId.current === conversationId)
      return;

    const fetchData = async () => {
      loadingConversationId.current = conversationId;

      try {
        dispatch(setActiveConversation(conversationId));

        const [
          channelsRes,
          memberRes,
          isMemberRes,
          pinMessagesRes,
          membersRes,
        ] = await Promise.all([
          channelApi.getAllChannelByConversationId(conversationId),
          memberApi.getByConversationIdAndUserId(
            conversationId,
            JSON.parse(localStorage.getItem("user"))._id
          ),
          memberApi.isMember(
            conversationId,
            JSON.parse(localStorage.getItem("user"))._id
          ),
          pinMessageApi.getAllByConversationId(conversationId),
          memberApi.getMembers(conversationId),
        ]);

        dispatch(setPinMessages(pinMessagesRes));
        dispatch(setChannels(channelsRes));
        setMember(memberRes);
        setIsMember(isMemberRes.data);
        setMembers(membersRes.data);

        if (channelsRes.length > 0) {
          const firstChannelId = channelsRes[0]?._id || null;
          setActiveChannel(firstChannelId);
          currentActiveChannelRef.current = firstChannelId;
          previousActiveChannelRef.current = firstChannelId;
        }

        if (conversation && !conversation.type) {
          const messagesRes = await messageApi.fetchMessages(conversationId, {
            skip: 0,
            limit: 100,
          });
          dispatch(setMessages({ conversationId, messages: messagesRes }));
        }

        if (unread[conversationId] > 0) {
          dispatch(markRead({ conversationId }));
        }

        conversationCache.set(conversationId, {
          activeChannel: channelsRes[0]?._id || null,
          isMember: isMemberRes.data,
          member: memberRes,
          members: membersRes.data,
        });
        setLatestFetchedConversationId(conversationId);
      } catch (error) {
        console.error("Error fetching data", error);
        AlertMessage({
          type: "error",
          message: error.response?.data.message || "Error fetching data",
        });
      } finally {
        setIsLoadingMessages(false);
        loadingConversationId.current = null;
      }
    };

    fetchData();
    isInitialMount.current = false;
  }, [conversationId, dispatch, conversation]);

  useEffect(() => {
    if (activeChannel) {
      previousActiveChannelRef.current = activeChannel;
    }
  }, [activeChannel]);

  useEffect(() => {
    if (!activeChannel || !conversationId || !conversation?.type) return;
    if (previousChannelId.current === activeChannel) return;
    if (loadingChannelId.current === activeChannel) return;

    const fetchChannelMessages = async () => {
      const cacheKey = `${conversationId}_${activeChannel}`;
      const cachedMessages = channelMessagesCache.get(cacheKey);

      if (cachedMessages) {
        console.log("Using cached messages for channel:", activeChannel);
        dispatch(setMessages({ conversationId, messages: cachedMessages }));
        setIsLoadingMessages(false);
        return;
      }

      try {
        loadingChannelId.current = activeChannel;
        setIsLoadingMessages(true);
        const messagesRes = await messageApi.fetchMessagesByChannelId(
          activeChannel,
          {
            skip: 0,
            limit: 100,
          }
        );
        dispatch(setMessages({ conversationId, messages: messagesRes }));
        channelMessagesCache.set(cacheKey, messagesRes);
        setMessageSkip(100);
        setHasMoreMessages(true);
      } catch (error) {
        console.error("Error fetching channel messages", error);
        AlertMessage({
          type: "error",
          message:
            error.response?.data.message || "Error fetching channel messages",
        });
      } finally {
        setIsLoadingMessages(false);
        loadingChannelId.current = null;
      }
    };

    fetchChannelMessages();
    previousChannelId.current = activeChannel;
  }, [activeChannel, conversationId, dispatch, conversation?.type]);

  useEffect(() => {
    if (isSendingMessage.current) return;

    if (conversationId && activeChannel && conversationMessages.length > 0) {
      const cacheKey = `${conversationId}_${activeChannel}`;
      const existingCache = channelMessagesCache.get(cacheKey);

      // Chỉ update cache nếu messages thực sự thay đổi
      if (
        !existingCache ||
        existingCache.length !== conversationMessages.length
      ) {
        channelMessagesCache.set(cacheKey, conversationMessages);
      }
    }
  }, [conversationId, activeChannel, conversationMessages]);

  useEffect(() => {
    if (!conversationMessages.length) return;

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
  }, [conversationMessages]);

  const handleSendMessage = async ({
    content,
    type,
    tags,
    tagPositions,
    files,
    replyMessageId,
    location,
  }) => {
    const channelId = currentActiveChannelRef.current || activeChannel;

    // Kiểm tra member trước khi gửi tin nhắn
    if (!member?.data?._id) {
      console.error("Member data not available")
      AlertMessage({
        type: "error",
        message: "Unable to send message. Please try again.",
      })
      return
    }

    isSendingMessage.current = true;
    try {
      let newMessage = null;
      if (type === "TEXT") {
        const resSend = await messageApi.sendTextMessage({
          conversationId,
          content,
          channelId,
          tags,
          tagPositions,
          replyMessageId,
        });
        newMessage = resSend;
      } else if (type === "IMAGE") {
        const resSend = await messageApi.sendImageMessage(
          conversationId,
          files,
          channelId,
          replyMessageId
        );
        newMessage = resSend;
      } else if (type === "FILE") {
        const resSend = await messageApi.sendFileMessage(
          conversationId,
          files[0],
          channelId,
          replyMessageId
        );
        newMessage = resSend;
      } else if (type === "VIDEO") {
        const resSend = await messageApi.sendVideoMessage(
          conversationId,
          files[0],
          channelId,
          replyMessageId
        );
        newMessage = resSend;
      } else if (type === "LOCATION") {
        const resSend = await messageApi.sendLocationMessage({
          conversationId,
          location,
          channelId,
        });
        newMessage = resSend;
      }

      if (!newMessage) {
        throw new Error("Failed to create message")
      }

      const cacheKey = `${conversationId}_${channelId}`;
      const cachedMessages = channelMessagesCache.get(cacheKey) || [];
      channelMessagesCache.set(cacheKey, [...cachedMessages, newMessage]);
      if ((type === "IMAGE" && Array.isArray(newMessage)) || (type === "VIDEO" && Array.isArray(newMessage))) {
        newMessage.forEach((msg) => {
          channelMessagesCache.set(cacheKey, [...cachedMessages, msg]);
          dispatch(
            addMessage({
              conversationId,
              message: msg,
            })
          );
          dispatch(
            updateConversation({
              conversationId: msg.conversationId,
              lastMessage: msg,
            })
          );
        });
      }
      dispatch(
        addMessage({
          conversationId,
          message: newMessage,
        })
      );
      dispatch(
        updateConversation({
          conversationId: newMessage.conversationId,
          lastMessage: newMessage,
        })
      );
    } catch (error) {
      console.error("Error sending message", error);
      AlertMessage({
        type: "error",
        message: error.response?.data.message || "Error sending message",
      });
      throw error;
    } finally {
      setTimeout(() => {
        isSendingMessage.current = false;
      }, 500);
    }
  };

  const handleReply = (message) => {
    setReplyMessage(message);
  };

  const handleCreateVote = async (vote) => {
    const channelId = currentActiveChannelRef.current || activeChannel;

    const newVote = {
      memberId: channelId,
      conversationId: conversationId,
      channelId: channels[0]?.id,
      content: vote.content,
      isMultipleChoice: vote.isMultipleChoice,
      isAnonymous: vote.isAnonymous,
      options: vote.options.map((option) => ({
        name: option,
        members: [],
      })),
    };

    await voteApi.createVote(newVote);
  };

  const handleUpdateVote = async (vote) => {
    const oldOptions = vote.oldOptions.options.map((option) => option.name);
    const newOptions = vote.options;

    const updatedOptions = newOptions.filter(
      (newOption) => !oldOptions.includes(newOption)
    );
    const deletedOptions = oldOptions.filter(
      (oldOption) => !newOptions.includes(oldOption)
    );
    const deletedOptionIds = deletedOptions.map(
      (option) => vote.oldOptions.options.find((opt) => opt.name === option)._id
    );

    updatedOptions.forEach(async (option) => {
      await voteApi.addVoteOption(vote.oldOptions._id, member.data._id, option);
    });

    deletedOptionIds.forEach(async (optionId) => {
      await voteApi.deleteVoteOption(
        vote.oldOptions._id,
        member.data._id,
        optionId
      );
    });
  };

  const onSelected = (optionIds, vote) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const reqSelectVoteOption = {
      memberId: member.data._id,
      memberInfo: {
        name: user.name,
        avatar: user.avatar,
        avatarColor: "black",
      },
    };

    // array of optionIds selected by memberId in vote.options (optionIds in dbs by memberId)
    const selectedOptionIds = vote.options.reduce((acc, option) => {
      const userVote = option.members?.find(
        (memberTemp) => memberTemp.memberId === member.data._id
      );
      if (userVote) {
        acc.push(option._id);
      }
      return acc;
    }, []);

    // array of optionIds of selectedOptionIds that optionIds does not have (deselected)
    const optionIdsNotHave = selectedOptionIds.filter(
      (optionId) => !optionIds.includes(optionId)
    );

    // array of optionIds of optionIds that selectedOptionIds does not have (selected)
    const optionIdsHave = optionIds.filter(
      (optionId) => !selectedOptionIds.includes(optionId)
    );

    optionIdsHave.forEach(async (optionId) => {
      await voteApi.selectVoteOption(vote._id, optionId, reqSelectVoteOption);
    });

    optionIdsNotHave.forEach(async (optionId) => {
      await voteApi.deselectVoteOption(vote._id, optionId, member.data._id);
    });
  };

  const handleLockVote = async (vote) => {
    await voteApi.lockVote(vote._id, member.data._id);
  };

  const handleScrollToMessage = useCallback((messageId) => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollToMessage(messageId);
    }
  }, []);

  const handleDeleteChannel = async (channelId) => {
    try {
      await channelApi.deleteChannel(
        channelId,
        member.data._id,
        conversationId
      );
      dispatch(deleteChannel({ channelId }));

      clearChannelCache(channelId);

      if (activeChannel === channelId) {
        const remainingChannels = channels.filter((ch) => ch._id !== channelId);
        const newActiveChannel = remainingChannels[0]?._id || null;
        setActiveChannel(newActiveChannel);
        currentActiveChannelRef.current = newActiveChannel;
      }
    } catch (error) {
      console.error("Error deleting channel", error);
      AlertMessage({
        type: "error",
        message: error.response.data.message || "Error deleting channel",
      });
    }
  };

  const handleAddChannel = async (channelData, channelId) => {
    try {
      if (!channelId) {
        if (
          channels.find((channel) => channel.name === channelData.name.trim())
        ) {
          console.error("Channel name already exists");
          AlertMessage({
            type: "error",
            message: "Channel name already exists",
          });
        } else {
          const newChannel = await channelApi.createChannel(
            channelData.name,
            member.data._id,
            conversationId
          );
          setActiveChannel(newChannel._id);
          currentActiveChannelRef.current = newChannel._id;
        }
      } else {
        await channelApi.updateChannel(
          channelId,
          channelData.name,
          member.data._id,
          conversationId
        );
      }
    } catch (error) {
      console.error("Error adding channel", error);
      AlertMessage({
        type: "error",
        message: error.response.data.message || "Error adding channel",
      });
    }
  };

  const clearAllCache = useCallback(() => {
    console.log("🧹 Clearing all cache");
    channelMessagesCache.clear();
    conversationCache.clear();
  }, []);

  // Expose function để test
  window.clearChatCache = clearAllCache;
  window.debugChatCache = debugCache;

  useEffect(() => {
    debugCache();
  }, [conversationId, activeChannel, debugCache]);

  if (!conversation || isLoadingMessages) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-white">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <VoteModal
        isOpen={isVoteModalOpen}
        onClose={() => setIsVoteModalOpen(false)}
        onSubmit={handleCreateVote}
      />

      <div className="flex w-full h-screen">
        {/* Main Content */}
        <div className="flex flex-1 overflow-auto">
          {/* ChatBox  */}
          <div className="flex flex-col flex-1 bg-gradient-to-b from-blue-50/50 to-white">
            <HeaderSignleChat
              channelTabs={channels}
              activeTab={activeChannel}
              handleDetail={setShowDetail}
              conversation={conversation}
              onChannelChange={handleChannelChange}
              onDeleteChannel={handleDeleteChannel}
              onAddChannel={handleAddChannel}
            />
            <ChatBox
              messages={conversationMessages}
              onReply={handleReply}
              onSelected={onSelected}
              member={member?.data}
              onSave={handleUpdateVote}
              onLock={handleLockVote}
              ref={chatBoxRef}
              onLoadMore={hasMoreMessages ? loadMoreMessages : () => {}}
            />
            <MessageInput
              conversation={conversation}
              onSend={handleSendMessage}
              isMember={isMember}
              setIsVoteModalOpen={setIsVoteModalOpen}
              isGroup={conversation.type}
              members={members}
              member={member?.data}
              onReply={setReplyMessage}
              replyMessage={replyMessage}
              isLoading={isLoadingMessages}
            />
          </div>

          {/* DetailChat*/}
          <div
            className={`bg-white shadow-xl transition-all duration-200 my-3 rounded-[20px] ${
              showDetail ? "w-[385px]" : "w-0"
            }`}
          >
            {/* log messages */}
            {showDetail && (
              <DetailChat
                conversation={conversation}
                imagesVideos={photosVideos}
                files={files}
                links={links}
                pinMessages={pinMessages.filter((pinMessage) =>
                  conversationMessages.some(
                    (message) => message._id === pinMessage.messageId
                  )
                )}
                onScrollToMessage={handleScrollToMessage}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
