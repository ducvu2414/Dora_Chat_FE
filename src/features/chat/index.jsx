/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef, useCallback } from "react";
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

export default function ChatSingle() {
  const { id: conversationId } = useParams();
  const dispatch = useDispatch();
  const { messages, unread, pinMessages, conversations, channels } =
    useSelector((state) => state.chat);
  const conversationMessages = messages[conversationId] || [];
  const [activeChannel, setActiveChannel] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [photosVideos, setPhotosVideos] = useState([]);
  const [files, setFiles] = useState([]);
  const [links, setLinks] = useState([]);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [member, setMember] = useState(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [conversation, setConversation] = useState(
    conversations.filter((conv) => conv._id === conversationId)[0]
  );
  const [members, setMembers] = useState([]);
  const chatBoxRef = useRef(null);

  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [messageSkip, setMessageSkip] = useState(100);

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
        setMessageSkip((prev) => prev + uniqueMessages.length);
      }
    } catch (error) {
      console.error("Error loading more messages", error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setConversation(
      conversations.filter((conv) => conv._id === conversationId)[0]
    );
  }, [conversationId, conversation]);

  useEffect(() => {
    const resetState = () => {
      setActiveChannel(null);
      setPhotosVideos([]);
      setFiles([]);
      setLinks([]);
      setIsLoadingMessages(true);
    };

    const fetchData = async () => {
      if (!conversationId) return;

      resetState();

      try {
        setIsLoadingMessages(true);
        dispatch(setActiveConversation(conversationId));

        let channelsRes = [];

        try {
          channelsRes = await channelApi.getAllChannelByConversationId(
            conversationId
          );

          setMember(
            await memberApi.getByConversationIdAndUserId(
              conversationId,
              JSON.parse(localStorage.getItem("user"))._id
            )
          );

          const isMemberRes = (
            await memberApi.isMember(
              conversationId,
              JSON.parse(localStorage.getItem("user"))._id
            )
          ).data;

          const pinMessages = await pinMessageApi.getAllByConversationId(
            conversationId
          );

          const MembersRes = await memberApi.getMembers(conversationId);
          setMembers(MembersRes.data);

          dispatch(setPinMessages(pinMessages));
          dispatch(setChannels(channelsRes));
          setIsMember(isMemberRes);
          setActiveChannel((prev) => prev || channelsRes[0]?._id || null);
        } catch (error) {
          console.error("Error fetching conversation:", error);
        }

        if (conversation) {
          if (!conversation.type) {
            // single chat
            try {
              const messages = await messageApi.fetchMessages(conversationId, {
                skip: 0,
                limit: 100,
              });
              dispatch(setMessages({ conversationId, messages }));
            } catch (error) {
              console.error("Error fetching messages:", error);
            }
          }
        }

        if (unread[conversationId] > 0) {
          dispatch(markRead({ conversationId }));
        }
      } catch (error) {
        console.error("Error in useEffect:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchData();
  }, [conversationId, dispatch, unread]);

  useEffect(() => {
    if (!activeChannel || !conversationId || !conversation?.type) return;

    const fetchChannelMessages = async () => {
      try {
        const messages = await messageApi.fetchMessagesByChannelId(
          activeChannel,
          {
            skip: 0,
            limit: 100,
          }
        );
        dispatch(setMessages({ conversationId, messages }));
      } catch (error) {
        console.error("Error fetching messages by channel:", error);
      }
    };

    fetchChannelMessages();
  }, [activeChannel, conversationId, dispatch, conversation?.type]);

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

  const handleSendMessage = async ({
    content,
    type,
    tags,
    tagPositions,
    files,
  }) => {
    const channelId = activeChannel;
    try {
      if (type === "TEXT") {
        await messageApi.sendTextMessage({
          conversationId,
          content,
          channelId,
          tags,
          tagPositions,
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

  const handleCreateVote = async (vote) => {
    const newVote = {
      memberId: member.data._id,
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

    console.log("vote", vote);
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
    console.log("Scrolling to message:", messageId);
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollToMessage(messageId);
    } else {
      console.log("ChatBox ref is null");
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

      setActiveChannel((prev) =>
        prev === channelId ? channels[0]?.id || null : prev
      );
    } catch (error) {
      console.error("Error deleting channel:", error.response.data.message);
    }
  };

  const handleAddChannel = async (channelData, channelId) => {
    try {
      if (!channelId) {
        const newChannel = await channelApi.createChannel(
          channelData.name,
          member.data._id,
          conversationId
        );
        setActiveChannel(newChannel._id);
      } else {
        await channelApi.updateChannel(
          channelId,
          channelData.name,
          member.data._id,
          conversationId
        );
      }
    } catch (error) {
      console.error("Error adding channel:", error.response.data.message);
    }
  };

  return (
    <>
      <VoteModal
        isOpen={isVoteModalOpen}
        onClose={() => setIsVoteModalOpen(false)}
        onSubmit={handleCreateVote}
      />

      {!conversation || isLoadingMessages || !messages[conversationId] ? (
        <div className="flex items-center justify-center w-full h-screen bg-white">
          <Spinner />
        </div>
      ) : (
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
                onChannelChange={setActiveChannel}
                onDeleteChannel={handleDeleteChannel}
                onAddChannel={handleAddChannel}
              />
              <ChatBox
                key={conversationId}
                messages={messages[conversationId]}
                onSelected={onSelected}
                member={member?.data}
                onSave={handleUpdateVote}
                onLock={handleLockVote}
                ref={chatBoxRef}
                onLoadMore={hasMoreMessages ? loadMoreMessages : () => {}}
              />
              <MessageInput
                onSend={handleSendMessage}
                isMember={isMember}
                setIsVoteModalOpen={setIsVoteModalOpen}
                isGroup={conversation.type}
                members={members}
                member={member?.data}
              />
            </div>

            {/* DetailChat*/}
            <div
              className={`bg-white shadow-xl transition-all duration-200 my-3 rounded-[20px]  ${
                showDetail ? "w-[385px]" : "w-0"
              }`}
            >
              {/* log messages */}
              {showDetail && (
                <DetailChat
                  conversation={
                    conversations.filter(
                      (conv) => conv._id === conversationId
                    )[0]
                  }
                  imagesVideos={photosVideos}
                  files={files}
                  links={links}
                  pinMessages={pinMessages}
                  onScrollToMessage={handleScrollToMessage}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
