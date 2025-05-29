/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
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
const channelMessagesCache = new Map(); // Cache cho group conversations (có channels)
const individualMessagesCache = new Map(); // Cache cho individual conversations (không có channels)

export default function ChatSingle() {
  const { id: conversationId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { messages, unread, pinMessages, conversations, channels } =
    useSelector((state) => state.chat);

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
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [messageSkip, setMessageSkip] = useState(100);
  const [replyMessage, setReplyMessage] = useState(null);
  const [latestFetchedConversationId, setLatestFetchedConversationId] =
    useState(null);

  const chatBoxRef = useRef(null);
  const isInitialMount = useRef(true);
  const previousConversationId = useRef(conversationId);
  const loadingConversationId = useRef(null);
  const previousChannelId = useRef(activeChannel);
  const loadingChannelId = useRef(null);
  const currentActiveChannelRef = useRef(activeChannel);
  const isSendingMessage = useRef(false);
  const previousActiveChannelRef = useRef(null);
  const lastFetchedChannelIdRef = useRef(null);
  const lastSyncedRef = useRef({});

  const conversation = useMemo(
    () => conversations.find((conv) => conv._id === conversationId),
    [conversations, conversationId]
  );

  const conversationMessages = useMemo(() => {
    const allMessages = messages[conversationId] || [];
    if (conversation?.type && activeChannel) {
      // Group conversation: lọc theo channel
      return allMessages.filter((msg) => msg.channelId === activeChannel);
    }
    // Individual conversation: không lọc
    return allMessages;
  }, [messages, conversationId, conversation?.type, activeChannel]);

  const syncCacheWithReduxStore = useCallback(
    (conversationId, channelId = null) => {
      const currentMessages = messages[conversationId] || [];

      if (currentMessages.length === 0) return;

      if (conversation?.type && channelId) {
        // Group conversation
        const cacheKey = `${conversationId}_${channelId}`;
        const cachedMessages = channelMessagesCache.get(cacheKey) || [];

        // Chỉ update cache nếu Redux store có data mới hơn
        if (currentMessages.length >= cachedMessages.length) {
          channelMessagesCache.set(cacheKey, [...currentMessages]);
        }
      } else if (!conversation?.type) {
        // Individual conversation
        const cachedMessages =
          individualMessagesCache.get(conversationId) || [];

        // Chỉ update cache nếu Redux store có data mới hơn
        if (currentMessages.length >= cachedMessages.length) {
          individualMessagesCache.set(conversationId, [...currentMessages]);
        }
      }
    },
    [messages, conversation?.type]
  );

  useEffect(() => {
    if (conversationId && conversationMessages.length > 0) {
      if (conversation?.type && activeChannel) {
        const cacheKey = `${conversationId}_${activeChannel}`;

        const currentSerialized = JSON.stringify(conversationMessages);
        if (
          !lastSyncedRef.current[cacheKey] ||
          lastSyncedRef.current[cacheKey] !== currentSerialized
        ) {
          channelMessagesCache.set(cacheKey, conversationMessages);
          lastSyncedRef.current[cacheKey] = currentSerialized;
        }
      }
    }
  }, [conversationId, activeChannel, conversationMessages, conversation?.type]);

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

  // const clearIndividualCache = useCallback((convId) => {
  //   if (convId) {
  //     individualMessagesCache.delete(convId);
  //   }
  // }, []);

  const loadMoreMessages = async () => {
    if (loadingMore || !conversationId) return;

    // Kiểm tra loại conversation để quyết định cách load messages
    const isGroupConversation = conversation?.type;

    if (isGroupConversation && !activeChannel) return;

    setLoadingMore(true);

    try {
      let res;
      if (isGroupConversation) {
        // Load messages cho group conversation (theo channel)
        res = await messageApi.fetchMessagesByChannelId(activeChannel, {
          skip: messageSkip,
          limit: 100,
        });
      } else {
        // Load messages cho individual conversation
        res = await messageApi.fetchMessages(conversationId, {
          skip: messageSkip,
          limit: 100,
        });
      }

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

        // Update cache
        if (isGroupConversation) {
          const cacheKey = `${conversationId}_${activeChannel}`;
          const cachedMessages = channelMessagesCache.get(cacheKey) || [];
          channelMessagesCache.set(cacheKey, [
            ...uniqueMessages,
            ...cachedMessages,
          ]);
        } else {
          const cachedMessages =
            individualMessagesCache.get(conversationId) || [];
          individualMessagesCache.set(conversationId, [
            ...uniqueMessages,
            ...cachedMessages,
          ]);
        }

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
      latestFetchedConversationId !== conversationId ||
      !conversation?.type // Chỉ set activeChannel cho group conversations
    )
      return;

    if (!activeChannel) {
      const defaultChannel = channels[0]?._id || null;
      setActiveChannel(defaultChannel);
    }
  }, [
    conversationId,
    channels,
    latestFetchedConversationId,
    conversation?.type,
    activeChannel,
  ]);

  useEffect(() => {
    if (previousConversationId.current !== conversationId) {
      const oldConversationId = previousConversationId.current;
      const oldActiveChannel = previousActiveChannelRef.current;
      const oldConversation = conversations.find(
        (conv) => conv._id === oldConversationId
      );

      if (oldConversationId && member) {
        syncCacheWithReduxStore(oldConversationId, oldActiveChannel);
        const currentMessages = messages[oldConversationId] || [];

        if (currentMessages.length > 0) {
          if (oldConversation?.type && oldActiveChannel) {
            // Cache cho group conversation
            const oldCacheKey = `${oldConversationId}_${oldActiveChannel}`;
            channelMessagesCache.set(oldCacheKey, currentMessages);
          } else if (!oldConversation?.type) {
            // Cache cho individual conversation
            individualMessagesCache.set(oldConversationId, currentMessages);
          }
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

      // Clear old caches
      if (oldConversationId) {
        if (oldConversation?.type) {
          // Clear channel caches for group conversation
          const keysToDelete = [];
          for (const key of channelMessagesCache.keys()) {
            if (key.startsWith(oldConversationId + "_")) {
              keysToDelete.push(key);
            }
          }
          keysToDelete.forEach((key) => channelMessagesCache.delete(key));
        } else {
          // Clear individual cache
          individualMessagesCache.delete(oldConversationId);
        }
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
  }, [conversationId, conversations]);

  useEffect(() => {
    if (!conversationId || loadingConversationId.current === conversationId)
      return;

    if (!conversation) {
      navigate("/home");
      return;
    }
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

        if (conversation?.type && channelsRes.length > 0) {
          // Group conversation - set active channel
          if (!activeChannel) {
            const firstChannelId = channelsRes[0]?._id || null;
            setActiveChannel(firstChannelId);
            currentActiveChannelRef.current = firstChannelId;
            previousActiveChannelRef.current = firstChannelId;
          }
        } else if (!conversation?.type) {
          // Individual conversation - load messages directly
          const cachedMessages = individualMessagesCache.get(conversationId);

          if (cachedMessages) {
            dispatch(setMessages({ conversationId, messages: cachedMessages }));
          } else {
            const messagesRes = await messageApi.fetchMessages(conversationId, {
              skip: 0,
              limit: 100,
            });
            dispatch(setMessages({ conversationId, messages: messagesRes }));
            individualMessagesCache.set(conversationId, messagesRes);
          }
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
  }, [conversationId, dispatch, navigate]);

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
        lastFetchedChannelIdRef.current = activeChannel;
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

  const onSelected = (optionIds, vote) => {
    console.log("Selected optionIds:", optionIds);
    console.log("Vote data:", vote);
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

    setTimeout(() => {
      const cacheKey = `${conversationId}_${currentActiveChannelRef.current}`;
      const cache = channelMessagesCache;

      const cachedMessages = cache.get(cacheKey) || [];

      const updatedMessages = cachedMessages.map((msg) => {
        if (msg._id === vote._id) {
          return {
            ...msg,
            options: msg.options.map((option) => {
              if (optionIdsHave.includes(option._id)) {
                // ✅ FIX: Structure đúng cho vote-display.jsx
                const newMember = {
                  memberId: member.data._id,
                  name: user.name, // ← Đúng structure
                  avatar: user.avatar, // ← Đúng structure
                  avatarColor: "black",
                };

                return {
                  ...option,
                  members: [...(option.members || []), newMember],
                };
              } else if (optionIdsNotHave.includes(option._id)) {
                return {
                  ...option,
                  members: (option.members || []).filter(
                    (m) => m.memberId !== member.data._id
                  ),
                };
              }
              return option;
            }),
          };
        }
        return msg;
      });

      cache.set(cacheKey, updatedMessages);
    }, 200); // Đợi socket update xong
  };

  useEffect(() => {
    if (!activeChannel || !conversationId || !conversation?.type) return;
    if (previousChannelId.current === activeChannel) return;
    if (loadingChannelId.current === activeChannel) return;

    const channelId = activeChannel;

    const fetchChannelMessages = async () => {
      const cacheKey = `${conversationId}_${channelId}`;
      const cachedMessages = channelMessagesCache.get(cacheKey);

      if (cachedMessages) {
        dispatch(setMessages({ conversationId, messages: cachedMessages }));
        lastFetchedChannelIdRef.current = channelId;
        setIsLoadingMessages(false);
        return;
      }

      try {
        loadingChannelId.current = channelId;
        setIsLoadingMessages(true);
        const messagesRes = await messageApi.fetchMessagesByChannelId(
          channelId,
          {
            skip: 0,
            limit: 100,
          }
        );

        // Chỉ dispatch nếu channelId vẫn còn là active
        if (currentActiveChannelRef.current === channelId) {
          dispatch(setMessages({ conversationId, messages: messagesRes }));
          lastFetchedChannelIdRef.current = channelId;
        }

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
    previousChannelId.current = channelId;
  }, [activeChannel, conversationId, dispatch, conversation?.type]);

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
      AlertMessage({
        type: "error",
        message: "Unable to send message. Please try again.",
      });
      return;
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
        throw new Error("Failed to create message");
      }

      // Update cache
      if (conversation?.type && channelId) {
        // Group conversation
        const cacheKey = `${conversationId}_${channelId}`;
        const cachedMessages = channelMessagesCache.get(cacheKey) || [];
        const isDuplicate = cachedMessages.some(
          (msg) => msg._id === newMessage._id
        );

        if (!isDuplicate) {
          channelMessagesCache.set(cacheKey, [...cachedMessages, newMessage]);
        }
      } else if (!conversation?.type) {
        // Individual conversation
        const cachedMessages =
          individualMessagesCache.get(conversationId) || [];
        const isDuplicate = cachedMessages.some(
          (msg) => msg._id === newMessage._id
        );
        if (!isDuplicate) {
          individualMessagesCache.set(conversationId, [
            ...cachedMessages,
            newMessage,
          ]);
        }
      }

      if (
        (type === "IMAGE" && Array.isArray(newMessage)) ||
        (type === "VIDEO" && Array.isArray(newMessage))
      ) {
        newMessage.forEach((msg) => {
          // Update cache cho từng message trong array
          if (conversation?.type && channelId) {
            const cacheKey = `${conversationId}_${channelId}`;
            const cachedMessages = channelMessagesCache.get(cacheKey) || [];
            channelMessagesCache.set(cacheKey, [...cachedMessages, msg]);
          } else if (!conversation?.type) {
            const cachedMessages =
              individualMessagesCache.get(conversationId) || [];
            individualMessagesCache.set(conversationId, [
              ...cachedMessages,
              msg,
            ]);
          }
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
      } else {
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
      }
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

    // Thêm dòng này để tránh cache sync conflict
    isSendingMessage.current = true;

    const newVote = {
      memberId: member.data._id,
      conversationId: conversationId,
      channelId: channelId,
      content: vote.content,
      isMultipleChoice: vote.isMultipleChoice,
      isAnonymous: vote.isAnonymous,
      options: vote.options.map((option) => ({
        name: option,
        members: [],
      })),
    };

    try {
      const resVote = await voteApi.createVote(newVote);

      // Kiểm tra resVote có hợp lệ không
      if (!resVote || !resVote._id) {
        return;
      }

      // Dispatch trước khi update cache
      dispatch(
        addMessage({
          conversationId: resVote.conversationId,
          message: resVote,
        })
      );

      dispatch(
        updateConversation({
          conversationId: resVote.conversationId,
          lastMessage: resVote,
        })
      );

      // Sau đó mới update cache
      if (conversation?.type && channelId) {
        const cacheKey = `${conversationId}_${channelId}`;
        const cachedMessages = channelMessagesCache.get(cacheKey) || [];
        const updatedCache = [...cachedMessages, resVote];

        channelMessagesCache.set(cacheKey, updatedCache);
      }
    } catch (error) {
      console.error("Error creating vote:", error);
      AlertMessage({
        type: "error",
        message: error.response?.data?.message || "Error creating vote",
      });
    } finally {
      // Reset flag sau một khoảng thời gian ngắn
      setTimeout(() => {
        isSendingMessage.current = false;
      }, 1000);
    }
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

  const handleLockVote = async (vote) => {
    try {
      const resVote = await voteApi.lockVote(vote._id, member.data._id);

      // Merge resVote với message gốc thay vì replace
      const updatedVoteMessage = {
        ...vote, // Giữ nguyên tất cả fields của message gốc
        lockedVote: resVote.lockedVote || { lockedStatus: true }, // Chỉ update lockedVote
        // Merge thêm fields khác nếu API trả về
        ...(resVote.content && { content: resVote.content }),
        ...(resVote.options && { options: resVote.options }),
      };

      setTimeout(() => {
        const channelId = currentActiveChannelRef.current || activeChannel;
        const cacheKey =
          conversation?.type && channelId
            ? `${conversationId}_${channelId}`
            : conversationId;

        const cache = conversation?.type
          ? channelMessagesCache
          : individualMessagesCache;
        const cachedMessages = cache.get(cacheKey) || [];

        const updatedMessages = cachedMessages.map((msg) => {
          if (msg._id === vote._id) {
            return updatedVoteMessage; // Use merged message
          }
          return msg;
        });

        cache.set(cacheKey, updatedMessages);
      }, 200);
    } catch (error) {
      console.error("Error locking vote:", error);
      AlertMessage({
        type: "error",
        message: error.response?.data?.message || "Error locking vote",
      });
    }
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
    individualMessagesCache.clear();
    conversationCache.clear();
  }, []);

  // Expose function để test
  window.clearChatCache = clearAllCache;

  if (!conversation) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-white">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Conversation not found</p>
          <button
            onClick={() => navigate("/home")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (isLoadingMessages) {
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
