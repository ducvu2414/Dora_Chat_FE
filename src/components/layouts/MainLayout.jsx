import { SideBar } from "@/components/ui/side-bar";
import { memo, Suspense, useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import conversationApi from "@/api/conversation";
import {
  setConversations,
  updateConversation,
  addMessage,
  recallMessage,
  deleteMessageForMe,
  addConversation
} from "../../features/chat/chatSlice";
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

const requests = [
  {
    id: 201,
    avatar:
      "https://s3-alpha-sig.figma.com/img/0dca/d322/bd3b28a9327f195eb0ce730500f0d0da?Expires=1739750400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=A85Yi8I9~KWqyXmqyfuBGHshdKrK8tThkb0O2PFT9r3RfGbUHEKPrNooEK6K1kWm3XxH7wkD8ow8hQJhCOW6~-NlzRvt~mwwd69qJg9jePW~hkCxxmmqJhQEX4AmeuMsXxQra5FhE15ZX0dtlvCN8y687T9BjrijhDOIr-RHOrSNsIbJ017SzZabBsEV0tmCsUfJtNheeabH9IO6LPD1aiMV-TnG0Y0S9Sf-Uw5VuS8la3pQx--qHVu9kiJpkNvJVOJs2Zfhkdtw69uR2EH80RhL7KMohgNOuaaoxeRDGDuJaH4~oTzvt9pfY~HnQf8gO37oWR2kQZ2ZdxsWMr28YA__",
    name: "John Doe",
    message: "Hi, I'd like to connect!",
    time: "2 hours ago",
  },
  // Add more requests as needed
];

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { amountNotify } = useSelector((state) => state.friend) || {
    amountNotify: 0,
  };
  const { conversations } = useSelector((state) => state.chat);
  const [isPending, startTransition] = useTransition();
  const [socketInitialized, setSocketInitialized] = useState(false);
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}")
  );
  const userId = user?.current?._id || user?._id;

  // Lấy conversations khi tải trang
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await conversationApi.fetchConversations();
        dispatch(setConversations(response));
      } catch (error) {
        console.error("Error fetching conversations:", error);
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
    if (!isConnected()) {
      startTransition(() => {
        init();
        setSocketInitialized(true);
      });
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);
  // Lắng nghe socket cho tin nhắn mới
  useEffect(() => {
    if (!socket) return;
    if (conversations.length > 0) {
      const conversationIds = conversations.map((conv) => conv._id);
      socket.emit(SOCKET_EVENTS.JOIN_CONVERSATIONS, conversationIds);
      console.log("Joined conversations:", conversationIds);
    }
    const handleNewMessage = (message) => {
      console.log("📩 New message:", message);
      startTransition(() => {
        dispatch(
          addMessage({ conversationId: message.conversationId, message })
        );
        dispatch(
          updateConversation({
            conversationId: message.conversationId,
            lastMessage: message,
          })
        );
      });
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

    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handleNewMessage);

    return () => {
      socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handleNewMessage);
    };
  }, [dispatch, conversations]);

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

  useEffect(() => {
    if (!socket || !user?._id) return;

    const handleAcceptFriend = (value) => {
      startTransition(() => {
        dispatch(setNewFriend(value));
        dispatch(setMyRequestFriend(value._id));
      });
    };

    const handleFriendInvite = (value) => {
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
        console.error("❌ Invalid data - conversation._id:", conversation._id, "userId:", userId);
        return;
      }
      socket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, conversation._id.toString(), () => {
        console.log("✅ FE joined room:", conversation._id.toString());
        socket.emit("JOINED_CONVERSATION", {
          conversationId: conversation._id.toString(),
          userId: userId,
        });
        console.log("📤 Sent JOINED_CONVERSATION:", {
          conversationId: conversation._id.toString(),
          userId: userId,
        });
      });
      startTransition(() => {
        dispatch(addConversation(conversation));
        console.log("Added conversation to state:", conversation._id);
      });
    };

    const handleNewGroupConversation = ({conversation, defaultChannel}) => {
      console.log("📥 Received JOIN_CONVERSATION:", conversation);
      console.log("DefaultChannel:", defaultChannel);
      console.log("conversation._id:", conversation._id);
      console.log("userId:", userId);
      if (!conversation._id || !userId) {
        console.error("❌ Invalid data - conversation._id:", conversation._id, "userId:", userId);
        return;
      }
      socket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, conversation._id.toString(), () => {
        console.log("✅ FE joined room:", conversation._id.toString());
        socket.emit("JOINED_CONVERSATION", {
          conversationId: conversation._id.toString(),
          userId: userId,
        });
        console.log("📤 Sent JOINED_CONVERSATION:", {
          conversationId: conversation._id.toString(),
          userId: userId,
        });
      });
      startTransition(() => {
        dispatch(addConversation(conversation));
        console.log("Added conversation to state:", conversation._id);
      });
    };

    socket.on(SOCKET_EVENTS.JOIN_CONVERSATION, handleJoinConversation);
    socket.on(SOCKET_EVENTS.NEW_GROUP_CONVERSATION, handleNewGroupConversation);

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
            dispatch(setFriendTypingStatus({ friendId: data.userId, isTyping: false }));
          }, 3000);
        }
      });
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
    };
  }, [socket]);

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
            <Outlet />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default memo(MainLayout);
