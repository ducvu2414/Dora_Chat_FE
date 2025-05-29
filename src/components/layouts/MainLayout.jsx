import { SideBar } from "@/components/ui/side-bar";
import {
  memo,
  Suspense,
  useEffect,
  useState,
  useTransition,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import conversationApi from "@/api/conversation";
import classifiesApi from "../../api/classifies";
import {
  demoteManager,
  toggleJoinApproval,
  setConversations,
  addMessage,
  recallMessage,
  deleteMessageForMe,
  addConversation,
  updateConversation,
  disbandConversation,
  deleteAllMessages,
  updateLeader,
  leaveConverSation,
  addPinMessage,
  deletePinMessage,
  setClassifies,
  updateVote,
  lockVote,
  updateNameConversation,
  updateMemberName,
  addChannel,
  deleteChannel,
  updateChannel,
  updateMessage,
  updateAvatarGroupConversation,
  acceptMultipleJoinRequests,
  rejectJoinRequests,
  removeMemberFromConversation,
  addMemberToConversation,
  addManager,
} from "../../features/chat/chatSlice";
import {
  setCallStarted,
  setIncomingCall,
  clearIncomingCall,
} from "../../features/chat/callSlice";

import {
  setAmountNotify,
  setFriendOnlineStatus,
  setFriendTypingStatus,
  setMyRequestFriend,
  setNewFriend,
  setNewRequestFriend,
  updateFriend,
  updateFriendChat,
  updateMyRequestFriend,
  updateRequestFriends,
} from "../../features/friend/friendSlice";
import { codeRevokeRef, SOCKET_EVENTS } from "../../utils/constant";
import { init, isConnected, socket } from "../../utils/socketClient";
import IncomingCallModal from "../ui/IncomingCallModal";
import callChannel from "../../utils/callChannel";
import { AlertMessage } from "@/components/ui/alert-message";
import memberApi from "../../api/member";

const requests = [];

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { amountNotify } = useSelector((state) => state.friend) || {
    amountNotify: 0,
  };
  const [socketInitialized, setSocketInitialized] = useState(false);
  const { conversations } = useSelector((state) => state.chat);

  const [isPending, startTransition] = useTransition();
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}")
  );
  const userId = user?.current?._id || user?._id;

  const { currentCall, incomingCall } = useSelector((state) => state.call);

  // Lấy conversations khi tải trang
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [convs, classifies] = await Promise.all([
          conversationApi.fetchConversations(),
          classifiesApi.getAllByUserId(),
        ]);
        dispatch(setConversations(convs));
        dispatch(setClassifies(classifies));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [dispatch]);

  // Lọc messages và groups
  const messages = conversations.filter((conv) => !conv.type); // Cá nhân
  const groups = conversations.filter((conv) => conv.type); // Nhóm

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (!socketInitialized && !isConnected()) {
      startTransition(() => {
        init();
        setSocketInitialized(true);
      });
    }

    return () => {
      if (socket && isConnected()) {
        socket.close();
        setSocketInitialized(false);
      }
    };
    //   }, []);
  }, [socketInitialized]);

  const currentCallRef = useRef(currentCall);
  useEffect(() => {
    currentCallRef.current = currentCall;
  }, [currentCall]);

  // Lắng nghe socket cho tin nhắn mới
  useEffect(() => {
    if (!socket) return;
    if (conversations.length > 0) {
      const conversationIds = conversations.map((conv) => conv._id);
      socket.emit(SOCKET_EVENTS.JOIN_CONVERSATIONS, conversationIds);
      console.log("Joined conversations:", conversationIds);
    }
    const handleNewMessage = async (message) => {
      console.log("📩 New message socket:", message);
      console.log("conversations:", message.conversationId);
      const currentPath = location.pathname;
      const member = await memberApi.getByConversationIdAndUserId(
        message.conversationId,
        JSON.parse(localStorage.getItem("user"))._id
      );
      // console.log("Member status:", member);

      if (member.data.active) {
        const isCurrentConversation = currentPath.includes(
          message.conversationId.toString()
        );
        dispatch(
          addMessage({ conversationId: message.conversationId, message })
        );
        if (!isCurrentConversation) {
          dispatch(
            updateConversation({
              conversationId: message.conversationId,
              lastMessage: message,
            })
          );
        }
      }
    };

    socket.on(SOCKET_EVENTS.MESSAGE_RECALLED, (data) => {
      startTransition(() => {
        console.log("Received recall message:", data);
        dispatch(
          recallMessage({
            messageId: data._id,
            conversationId: data.conversationId,
            isRecalled: data.isRecalled,
            content: data.content,
          })
        );
        dispatch(
          updateConversation({
            conversationId: data.conversationId,
            lastMessage: data,
          })
        );
      });
    });
    socket.on(
      SOCKET_EVENTS.MESSAGE_DELETED_FOR_ME,
      ({ deletedMessage, newLastMessage }) => {
        startTransition(() => {
          console.log(
            "Received deleted for me:",
            deletedMessage,
            newLastMessage
          );
          dispatch(
            deleteMessageForMe({
              messageId: deletedMessage._id,
              conversationId: deletedMessage.conversationId,
              deletedMemberIds: deletedMessage.deletedMemberIds,
              newLastMessage: newLastMessage,
            })
          );
        });
      }
    );
    socket.on(SOCKET_EVENTS.DELETE_CONVERSATION, (result) => {
      startTransition(() => {
        console.log("Received delete conversation:", result);
        dispatch(
          updateConversation({
            conversationId: result.conversationId,
            lastMessage: null,
          })
        );
        dispatch(
          deleteAllMessages({
            conversationId: result.conversationId,
          })
        );
      });
    });
    socket.on(SOCKET_EVENTS.TRANSFER_ADMIN, ({ newAdmin, notifyMessage }) => {
      startTransition(() => {
        dispatch(
          updateLeader({
            conversationId: notifyMessage.conversationId,
            lastMessage: notifyMessage,
            newAdmin: newAdmin,
          })
        );
        dispatch(
          updateConversation({
            conversationId: notifyMessage.conversationId,
            lastMessage: notifyMessage,
          })
        );
        dispatch(
          addMessage({
            conversationId: notifyMessage.conversationId,
            message: notifyMessage,
          })
        );
      });
    });
    socket.on(
      SOCKET_EVENTS.UPDATE_MANAGERS,
      ({ conversationId, addedManagers }) => {
        startTransition(() => {
          dispatch(
            addManager({
              conversationId: conversationId,
              addedManagers: addedManagers,
            })
          );
        });
      }
    );
    socket.on(SOCKET_EVENTS.DEMOTE_MANAGER, ({ conversationId, managerId }) => {
      startTransition(() => {
        dispatch(
          demoteManager({
            conversationId: conversationId,
            managerId: managerId,
          })
        );
      });
    });
    socket.on(
      SOCKET_EVENTS.LEAVE_CONVERSATION,
      ({ member, notifyMessage, disbanded }) => {
        startTransition(() => {
          console.log("Received leave conversation:", member, notifyMessage);
          dispatch(
            updateConversation({
              conversationId: notifyMessage.conversationId,
              lastMessage: notifyMessage,
            })
          );
          // dispatch(
          //   addMessage({
          //     conversationId: notifyMessage.conversationId,
          //     message: notifyMessage,
          //   })
          // );
          dispatch(
            leaveConverSation({
              conversationId: notifyMessage.conversationId,
              member: member._id,
              disbanded,
            })
          );
        });
      }
    );
    socket.on(SOCKET_EVENTS.REACT_TO_MESSAGE, (message) => {
      startTransition(() => {
        dispatch(
          updateMessage({
            conversationId: message.conversationId,
            message,
          })
        );
      });
    });
    socket.on(
      SOCKET_EVENTS.TOGGLE_JOIN_APPROVAL,
      ({ conversationId, isStatus }) => {
        startTransition(() => {
          dispatch(
            toggleJoinApproval({
              conversationId,
              newStatus: isStatus,
            })
          );
        });
      }
    );
    const handleAcceptJoinRequest = ({ newMembers, notifyMessage }) => {
      startTransition(() => {
        dispatch(
          acceptMultipleJoinRequests({
            conversationId: notifyMessage.conversationId,
            newMembers,
          })
        );
        handleNewMessage(notifyMessage);
      });
    };
    const handleRejectJoinRequest = ({ conversationId, requestingUserId }) => {
      startTransition(() => {
        dispatch(
          rejectJoinRequests({
            conversationId,
            userIds: [requestingUserId],
          })
        );
      });
    };
    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handleNewMessage);
    socket.on(SOCKET_EVENTS.ACCEPT_JOIN_REQUEST, handleAcceptJoinRequest);
    socket.on(SOCKET_EVENTS.REJECT_JOIN_REQUEST, handleRejectJoinRequest);
    return () => {
      socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handleNewMessage);
      socket.off(SOCKET_EVENTS.ACCEPT_JOIN_REQUEST, handleAcceptJoinRequest);
      socket.off(SOCKET_EVENTS.REJECT_JOIN_REQUEST, handleRejectJoinRequest);
    };
  }, [dispatch, conversations, location.pathname]);

  // Lắng nghe socket cho user connection
  useEffect(() => {
    if (!socket || !userId) return;

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
      socket.emit(SOCKET_EVENTS.JOIN, userId);
      console.log("JOIN:", userId);

      if (conversations.length > 0) {
        const conversationIds = conversations.map((conv) => conv._id);
        socket.emit(SOCKET_EVENTS.JOIN_CONVERSATIONS, conversationIds);
        console.log("JOIN_CONVERSATIONS:", conversationIds);
      }
    };

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
    };
  }, [socket, userId, conversations]);

  // Lắng nghe socket cho cuộc gọi
  useEffect(() => {
    const handleNewUserCall = ({
      conversationId,
      userId: callerId,
      peerId,
      type,
      initiator,
    }) => {
      if (callerId === user._id) {
        console.log("📭 Bỏ qua NEW_USER_CALL từ chính mình (caller)");
        return;
      }

      console.log("⚡️ NEW_USER_CALL", {
        conversationId,
        callerId,
        peerId,
        type,
        initiator,
      });

      if (currentCall) {
        console.log("📵 Đang trong cuộc gọi khác, từ chối cuộc gọi mới");
        AlertMessage({
          type: "error",
          message: "📵 Đang trong cuộc gọi khác, từ chối cuộc gọi mới",
        });
        navigate("/home");
        return;
      }
      const base = `/call/${conversationId}`;
      if (location.pathname.startsWith(base)) return;
      const conv = conversations.find((c) => c._id === conversationId);
      if (initiator) {
        // caller
        // dispatch(clearIncomingCall());
        // dispatch(
        //   setCallStarted({
        //     type,
        //     conversationId,
        //     initiator: true,
        //     peerId,
        //     remotePeerId: null,
        //     conversation: conv,
        //   })
        // );
        // console.log("caller", {
        //   type,
        //   conversationId,
        //   callerId,
        //   peerId,
        //   remotePeerId: null,
        //   conversation: conv,
        // });
        // navigate(`${base}?type=${type}`, { state: { conversation: conv } });
      } else {
        // callee (room‑broadcast)
        console.log("callee", {
          type,
          conversationId,
          callerId,
          peerId,
          remotePeerId: null,
          conversation: conv,
        });
        dispatch(
          setIncomingCall({
            type,
            conversationId,
            callerId,
            peerId,
            remotePeerId: null,
            conversation: conv,
          })
        );
      }
    };

    const handleCallUser = ({
      from: callerId,
      fromName,
      conversationId,
      type,
      peerId,
    }) => {
      const base = `/call/${conversationId}`;
      if (location.pathname.startsWith(base)) return;

      if (currentCallRef.current) {
        console.log("📵 Đang trong cuộc gọi khác, từ chối cuộc gọi mới");

        socket.emit(SOCKET_EVENTS.REJECT_CALL, {
          conversationId: conversationId,
          userId: user._id,
          reason: " Đang trong cuộc gọi khác, từ chối cuộc gọi mới",
        });
        return;
      }

      const conv = conversations.find((c) => c._id === conversationId);
      console.log("📞 handleCallUser - nhận cuộc gọi", {
        type,
        conversationId,
        callerId,
        fromName,
        peerId,
        conversation: conv,
      });

      dispatch(
        setIncomingCall({
          type,
          conversationId,
          callerId,
          fromName,
          peerId,
          remotePeerId: null,
          conversation: conv,
        })
      );
    };

    socket.on(SOCKET_EVENTS.NEW_USER_CALL, handleNewUserCall);
    socket.on(SOCKET_EVENTS.CALL_USER, handleCallUser);

    return () => {
      socket.off(SOCKET_EVENTS.NEW_USER_CALL, handleNewUserCall);
      socket.off(SOCKET_EVENTS.CALL_USER, handleCallUser);
    };
  }, [conversations, dispatch, location.pathname, navigate]);

  useEffect(() => {
    const handleCallBroadcast = (event) => {
      const { type, payload } = event.data;

      switch (type) {
        case "START_CALL":
          console.log("📢 Nhận START_CALL từ tab khác:", payload);
          if (!currentCallRef.current) {
            dispatch(setCallStarted(payload));
          }
          break;
        case "END_CALL":
          console.log("📢 Nhận END_CALL từ tab khác");
          dispatch(clearIncomingCall());
          break;
        default:
          break;
      }
    };

    callChannel.addEventListener("message", handleCallBroadcast);

    return () => {
      callChannel.removeEventListener("message", handleCallBroadcast);
    };
  }, [dispatch]);

  useEffect(() => {
    if (!socket || !user?._id) return;

    const handleAcceptFriend = (value) => {
      startTransition(() => {
        dispatch(setNewFriend(value));
        dispatch(setMyRequestFriend(value._id));
      });
    };

    const handleFriendInvite = (value) => {
      console.log("handleFriendInvite " + JSON.stringify(value));
      startTransition(() => {
        dispatch(setNewRequestFriend(value));
        dispatch(setAmountNotify(amountNotify + 1));
      });
    };

    const handleDeleteFriendInvite = (_id) => {
      startTransition(() => {
        dispatch(updateMyRequestFriend(_id));
      });
    };

    const handleDeleteInviteSend = (_id) => {
      startTransition(() => {
        dispatch(updateRequestFriends(_id));
      });
    };

    const handleDeleteFriend = (_id) => {
      startTransition(() => {
        dispatch(updateFriend(_id));
        dispatch(updateFriendChat(_id));
      });
    };

    const handleJoinConversation = (conversation) => {
      console.log("📥 Received JOIN_CONVERSATION:", conversation);
      console.log("conversation._id:", conversation._id);
      console.log("userId:", userId);
      if (!conversation._id || !userId) {
        console.error(
          "❌ Invalid data - conversation._id:",
          conversation._id,
          "userId:",
          userId
        );
        return;
      }
      socket.emit(
        SOCKET_EVENTS.JOIN_CONVERSATION,
        conversation._id.toString(),
        () => {
          console.log("✅ FE joined room:", conversation._id.toString());
          socket.emit("JOINED_CONVERSATION", {
            conversationId: conversation._id.toString(),
            userId: userId,
          });
          console.log("📤 Sent JOINED_CONVERSATION:", {
            conversationId: conversation._id.toString(),
            userId: userId,
          });
        }
      );
      startTransition(() => {
        dispatch(addConversation(conversation));
        console.log("Added conversation to state:", conversation._id);
      });
    };

    const handleNewGroupConversation = ({ conversation, defaultChannel }) => {
      console.log("📥 Received JOIN_CONVERSATION:", conversation);
      console.log("DefaultChannel:", defaultChannel);
      console.log("conversation._id:", conversation._id);
      console.log("userId:", userId);
      if (!conversation._id || !userId) {
        console.error(
          "❌ Invalid data - conversation._id:",
          conversation._id,
          "userId:",
          userId
        );
        return;
      }
      socket.emit(
        SOCKET_EVENTS.JOIN_CONVERSATION,
        conversation._id.toString(),
        () => {
          console.log("✅ FE joined room:", conversation._id.toString());
          socket.emit("JOINED_CONVERSATION", {
            conversationId: conversation._id.toString(),
            userId: userId,
          });
          console.log("📤 Sent JOINED_CONVERSATION:", {
            conversationId: conversation._id.toString(),
            userId: userId,
          });
        }
      );
      startTransition(() => {
        dispatch(addConversation(conversation));
        console.log("Added conversation to state:", conversation._id);
      });
    };

    const handleDisbandedConversation = ({ conversationId }) => {
      console.log("📥 Received JOIN_CONVERSATION:", conversationId);
      socket.emit(SOCKET_EVENTS.HIDE_CONVERSATION, conversationId.toString());
      dispatch(
        disbandConversation({
          conversationId: conversationId.toString(),
          userId: userId,
        })
      );
      navigate("/home");
      startTransition(() => {
        console.log("Added conversation to state:", conversationId);
      });
    };

    const handleRevokeToken = ({ key }) => {
      if (codeRevokeRef.current !== key) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.reload();
      }
    };
    // // kha add id user join socket
    // if (socketInitialized && user?.current?._id) {
    //   socket.emit(SOCKET_EVENTS.JOIN_USER, user.current._id);
    // }
    // Add event listeners

    const handleFriendOnlineStatus = (data) => {
      startTransition(() => {
        dispatch(
          setFriendOnlineStatus({
            friendId: data.userId,
            isOnline: data.isOnline,
          })
        );
      });
    };

    const handleFriendTyping = (data) => {
      startTransition(() => {
        dispatch(
          setFriendTypingStatus({
            friendId: data.userId,
            isTyping: data.isTyping,
          })
        );

        if (data.isTyping) {
          setTimeout(() => {
            dispatch(
              setFriendTypingStatus({ friendId: data.userId, isTyping: false })
            );
          }, 3000);
        }
      });
    };

    const handleUpdateNameConversation = (data) => {
      dispatch(
        updateNameConversation({
          conversationId: data.conversationId,
          name: data.name,
        })
      );
    };

    const handleUpdateAvatarGroupConversation = (data) => {
      dispatch(
        updateAvatarGroupConversation({
          conversationId: data.conversationId,
          avatar: data.avatar,
        })
      );
    };

    const handleRemoveMember = (data) => {
      dispatch(
        removeMemberFromConversation({
          conversationId: data.conversationId,
          memberId: data.memberId,
        })
      );
    };

    const handleAddMember = (data) => {
      dispatch(
        addMemberToConversation({
          conversationId: data.conversationId,
          addedMembers: data.addedMembers,
        })
      );
      console.log("handleAddMember", data);
    };
    // Register all event listeners
    socket.on(SOCKET_EVENTS.ACCEPT_FRIEND, handleAcceptFriend);
    socket.on(SOCKET_EVENTS.SEND_FRIEND_INVITE, handleFriendInvite);
    socket.on(SOCKET_EVENTS.DELETED_FRIEND_INVITE, handleDeleteFriendInvite);
    socket.on(SOCKET_EVENTS.DELETED_INVITE_WAS_SEND, handleDeleteInviteSend);
    socket.on(SOCKET_EVENTS.DELETED_FRIEND, handleDeleteFriend);
    socket.on(SOCKET_EVENTS.REVOKE_TOKEN, handleRevokeToken);

    socket.on(SOCKET_EVENTS.JOIN_CONVERSATION, handleJoinConversation);
    socket.on(SOCKET_EVENTS.FRIEND_ONLINE_STATUS, handleFriendOnlineStatus);
    socket.on(SOCKET_EVENTS.FRIEND_TYPING, handleFriendTyping);

    socket.on(SOCKET_EVENTS.NEW_GROUP_CONVERSATION, handleNewGroupConversation);
    socket.on(
      SOCKET_EVENTS.CONVERSATION_DISBANDED,
      handleDisbandedConversation
    );
    socket.on(
      SOCKET_EVENTS.UPDATE_NAME_CONVERSATION,
      handleUpdateNameConversation
    );
    socket.on(
      SOCKET_EVENTS.UPDATE_AVATAR_GROUP_CONVERSATION,
      handleUpdateAvatarGroupConversation
    );
    socket.on(SOCKET_EVENTS.MEMBER_REMOVED, handleRemoveMember);
    socket.on(SOCKET_EVENTS.MEMBER_ADDED, handleAddMember);

    return () => {
      socket.off(SOCKET_EVENTS.ACCEPT_FRIEND, handleAcceptFriend);
      socket.off(SOCKET_EVENTS.SEND_FRIEND_INVITE, handleFriendInvite);
      socket.off(SOCKET_EVENTS.DELETED_FRIEND_INVITE, handleDeleteFriendInvite);
      socket.off(SOCKET_EVENTS.DELETED_INVITE_WAS_SEND, handleDeleteInviteSend);
      socket.off(SOCKET_EVENTS.DELETED_FRIEND, handleDeleteFriend);
      socket.off(SOCKET_EVENTS.REVOKE_TOKEN, handleRevokeToken);

      socket.off(SOCKET_EVENTS.JOIN_CONVERSATION, handleJoinConversation);
      socket.off(SOCKET_EVENTS.FRIEND_ONLINE_STATUS, handleFriendOnlineStatus);
      socket.off(SOCKET_EVENTS.FRIEND_TYPING, handleFriendTyping);

      socket.off(
        SOCKET_EVENTS.NEW_GROUP_CONVERSATION,
        handleNewGroupConversation
      );
      socket.off(
        SOCKET_EVENTS.CONVERSATION_DISBANDED,
        handleDisbandedConversation
      );
      socket.off(
        SOCKET_EVENTS.UPDATE_AVATAR_GROUP_CONVERSATION,
        handleUpdateAvatarGroupConversation
      );
      socket.off(SOCKET_EVENTS.MEMBER_REMOVED, handleRemoveMember);
      socket.off(SOCKET_EVENTS.MEMBER_ADDED, handleAddMember);
    };
  }, [socket]);

  // Lắng nghe socket cho tin nhắn ghim và bỏ ghim
  useEffect(() => {
    if (!socket || !userId) return;

    const handlePinMessage = (pinMessage) => {
      console.log("test socket listen unpin message", pinMessage);
      if (pinMessage) {
        dispatch(addPinMessage(pinMessage));
      }
    };

    const handleUnpinMessage = (pinMessage) => {
      console.log("test socket listen unpin message", pinMessage);
      if (pinMessage) {
        dispatch(deletePinMessage(pinMessage));
      }
    };

    socket.on(SOCKET_EVENTS.PIN_MESSAGE, handlePinMessage);
    socket.on(SOCKET_EVENTS.UNPIN_MESSAGE, handleUnpinMessage);

    return () => {
      socket.off(SOCKET_EVENTS.PIN_MESSAGE, handlePinMessage);
      socket.off(SOCKET_EVENTS.UNPIN_MESSAGE, handleUnpinMessage);
    };
  }, [socket, dispatch]);

  // Lắng nghe socket cho tính năng vote
  useEffect(() => {
    if (!socket || !userId) return;

    const handleCreateVote = (vote) => {
      if (vote) {
        dispatch(
          addMessage({ conversationId: vote.conversationId, message: vote })
        );
        dispatch(
          updateConversation({
            conversationId: vote.conversationId,
            lastMessage: vote,
          })
        );
      }
    };

    const handleUpdateOption = (vote) => {
      if (vote) {
        dispatch(
          updateVote({ conversationId: vote.conversationId, message: vote })
        );
      }
    };

    const handleLockVote = (vote) => {
      if (vote) {
        dispatch(
          lockVote({ conversationId: vote.conversationId, message: vote })
        );
      }
    };

    socket.on(SOCKET_EVENTS.CREATE_VOTE, handleCreateVote);
    socket.on(SOCKET_EVENTS.VOTE_OPTION_SELECTED, handleUpdateOption);
    socket.on(SOCKET_EVENTS.VOTE_OPTION_DESELECTED, handleUpdateOption);
    socket.on(SOCKET_EVENTS.ADD_VOTE_OPTION, handleUpdateOption);
    socket.on(SOCKET_EVENTS.DELETE_VOTE_OPTION, handleUpdateOption);
    socket.on(SOCKET_EVENTS.VOTE_LOCKED, handleLockVote);

    return () => {
      socket.off(SOCKET_EVENTS.CREATE_VOTE, handleCreateVote);
      socket.off(SOCKET_EVENTS.VOTE_OPTION_SELECTED, handleUpdateOption);
      socket.off(SOCKET_EVENTS.VOTE_OPTION_DESELECTED, handleUpdateOption);
      socket.on(SOCKET_EVENTS.ADD_VOTE_OPTION, handleUpdateOption);
      socket.off(SOCKET_EVENTS.DELETE_VOTE_OPTION, handleUpdateOption);
      socket.off(SOCKET_EVENTS.VOTE_LOCKED, handleLockVote);
    };
  }, [socket, dispatch]);

  // Lắng nghe socket cho kênh
  useEffect(() => {
    if (!socket || !userId) return;

    const handleNewChannel = (newChannel) => {
      if (newChannel) {
        dispatch(addChannel(newChannel));
      }
    };

    const handleDeleteChannel = (channel) => {
      if (channel) {
        dispatch(deleteChannel({ _id: channel._id }));
      }
    };

    const handleUpdateChannel = (channel) => {
      if (channel) {
        dispatch(updateChannel(channel));
      }
    };

    socket.on(SOCKET_EVENTS.NEW_CHANNEL, handleNewChannel);
    socket.on(SOCKET_EVENTS.DELETE_CHANNEL, handleDeleteChannel);
    socket.on(SOCKET_EVENTS.UPDATE_CHANNEL, handleUpdateChannel);

    return () => {
      socket.off(SOCKET_EVENTS.NEW_CHANNEL, handleNewChannel);
      socket.off(SOCKET_EVENTS.DELETE_CHANNEL, handleDeleteChannel);
      socket.off(SOCKET_EVENTS.UPDATE_CHANNEL, handleUpdateChannel);
    };
  }, [socket, dispatch]);

  // Lắng nghe socket cho member
  useEffect(() => {
    if (!socket || !userId) return;

    const handleUpdateNamePersonalConversation = (data) => {
      if (data) {
        dispatch(
          updateMemberName({
            conversationId: data.conversationId,
            memberId: data._id,
            name: data.name,
          })
        );
      }
    };

    socket.on(
      SOCKET_EVENTS.UPDATE_MEMBER_NAME,
      handleUpdateNamePersonalConversation
    );
  }, [socket, dispatch]);

  useEffect(() => {
    const showToastMessage = (message) => {
      AlertMessage({
        type: "info",
        message: `You were mentioned in ${message.conversationName}:\n${message.content}`,
      });
    };

    socket.on(SOCKET_EVENTS.TAGGED, showToastMessage);

    return () => {
      socket.off(SOCKET_EVENTS.TAGGED, showToastMessage);
    };
  }, [socket, dispatch]);

  const handleConversationClick = (id) => {
    startTransition(() => {
      navigate(`/chat/${id}`);
    });
  };

  return (
    <div className="flex w-full h-screen bg-gradient-to-b from-blue-50/50 to-white">
      <SideBar
        messages={messages}
        groups={groups}
        requests={requests}
        user={user}
        onConversationClick={handleConversationClick}
      />
      <div className="flex-1 overflow-auto">
        {isPending ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
              </div>
            }
          >
            {/* <Outlet /> */}
            <Outlet key={location.pathname} />
            {!currentCall && incomingCall && <IncomingCallModal />}
            <AlertMessage />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default memo(MainLayout);
