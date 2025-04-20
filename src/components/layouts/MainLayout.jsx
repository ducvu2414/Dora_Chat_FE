import { SideBar } from "@/components/ui/side-bar";
import { memo, Suspense, useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import conversationApi from "@/api/conversation";
import {
  setConversations,
  addMessage,
  recallMessage,
  deleteMessageForMe,
  addConversation,
  updateConversation,
} from "../../features/chat/chatSlice";
import {
  setIncomingCall,
  clearIncomingCall,
  setCallStarted,
} from "../../features/chat/callSlice";
import {
  setAmountNotify,
  setFriendOnlineStatus,
  setFriendTypingStatus,
  setNewFriend,
  setNewRequestFriend,
  updateFriend,
  updateFriendChat,
  updateMyRequestFriend,
  updateRequestFriends,
} from "../../features/friend/friendSlice";
import { SOCKET_EVENTS } from "../../utils/constant";
import { init, isConnected, socket } from "../../utils/socketClient";
import IncomingCallModal from "../ui/IncomingCallModal";

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { conversations } = useSelector((state) => state.chat);
  const currentCall = useSelector((state) => state.call.currentCall);

  const [isPending, startTransition] = useTransition();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));
  const userId = user?.current?._id || user?._id;

  // 1. Fetch conversations once
  useEffect(() => {
    (async () => {
      try {
        const data = await conversationApi.fetchConversations();
        dispatch(setConversations(data));
      } catch (err) {
        console.error("Error fetching conversations", err);
      }
    })();
  }, [dispatch]);

  // 2. Sync user from localStorage
  useEffect(() => {
    const onStorage = () => setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // 3. Init socket
  useEffect(() => {
    if (!isConnected()) {
      startTransition(() => init());
    }
  }, []);

  // 4. Handle incoming call events (NEW_USER_CALL & CALL_USER)
  useEffect(() => {
    const handleNewUserCall = ({ conversationId, userId: callerId, peerId, type, initiator }) => {
      console.log("⚡️ NEW_USER_CALL", { conversationId, callerId, peerId, type, initiator });
      if (currentCall) {
        console.log("📵 Bỏ qua NEW_USER_CALL vì đang trong cuộc gọi");
        return;
      }
      const base = `/call/${conversationId}`;
      if (location.pathname.startsWith(base)) return;
      const conv = conversations.find(c => c._id === conversationId);
      if (initiator) {
        // caller
        dispatch(clearIncomingCall());
        dispatch(setCallStarted({ type, conversationId, initiator: true, peerId, remotePeerId: null, conversation: conv }));
        console.log("caller", { type, conversationId, callerId, peerId, remotePeerId: null, conversation: conv });
        navigate(`${base}?type=${type}`, { state: { conversation: conv } });
      } else {
        // callee (room‑broadcast)
        console.log("callee", { type, conversationId, callerId, peerId, remotePeerId: null, conversation: conv });
        dispatch(setIncomingCall({ type, conversationId, callerId, peerId, remotePeerId: null, conversation: conv }));
      }
    };

    const handleCallUser = ({ from: callerId, fromName, conversationId, type, peerId }) => {
      console.log("⚡️ CALL_USER", { callerId, fromName, conversationId, type, peerId });
      const base = `/call/${conversationId}`;
      if (location.pathname.startsWith(base)) return;
      const conv = conversations.find(c => c._id === conversationId);
      console.log("handleCallUser", { type, conversationId, callerId, fromName, peerId, remotePeerId: null, conversation: conv });
      dispatch(setIncomingCall({
        type,
        conversationId,
        callerId, fromName,
        peerId,         // đây chính là peerId của caller
        remotePeerId: null,
        conversation: conv,
      }));
    };

    socket.on(SOCKET_EVENTS.NEW_USER_CALL, handleNewUserCall);
    socket.on(SOCKET_EVENTS.CALL_USER, handleCallUser);

    return () => {
      socket.off(SOCKET_EVENTS.NEW_USER_CALL, handleNewUserCall);
      socket.off(SOCKET_EVENTS.CALL_USER, handleCallUser);
    };
  }, [conversations, dispatch, location.pathname, navigate]);


  // 5. Chat & friend events
  useEffect(() => {
    if (!socket) return;

    // join all conversation rooms
    if (conversations.length) {
      socket.emit(
        SOCKET_EVENTS.JOIN_CONVERSATIONS,
        conversations.map((c) => c._id)
      );
    }

    const onMessage = (msg) => {
      startTransition(() => {
        dispatch(addMessage({ conversationId: msg.conversationId, message: msg }));
        dispatch(updateConversation({ conversationId: msg.conversationId, lastMessage: msg }));
      });
    };
    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, onMessage);

    socket.on(SOCKET_EVENTS.MESSAGE_RECALLED, (data) =>
      startTransition(() =>
        dispatch(
          recallMessage({
            messageId: data._id,
            conversationId: data.conversationId,
            isRecalled: data.isRecalled,
            content: data.content,
          })
        )
      )
    );
    socket.on(SOCKET_EVENTS.MESSAGE_DELETED_FOR_ME, ({ deletedMessage, newLastMessage }) =>
      startTransition(() =>
        dispatch(
          deleteMessageForMe({
            messageId: deletedMessage._id,
            conversationId: deletedMessage.conversationId,
            deletedMemberIds: deletedMessage.deletedMemberIds,
            newLastMessage,
          })
        )
      )
    );

    const onJoinConv = (conv) => {
      if (conv._id && userId) {
        socket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, conv._id);
        dispatch(addConversation(conv));
      }
    };
    socket.on(SOCKET_EVENTS.JOIN_CONVERSATION, onJoinConv);

    socket.on(SOCKET_EVENTS.SEND_FRIEND_INVITE, (v) =>
      startTransition(() => dispatch(setNewRequestFriend(v)))
    );
    socket.on(SOCKET_EVENTS.ACCEPT_FRIEND, (v) =>
      startTransition(() => dispatch(setNewFriend(v)))
    );
    socket.on(SOCKET_EVENTS.DELETED_FRIEND_INVITE, (id) =>
      startTransition(() => dispatch(updateMyRequestFriend(id)))
    );
    socket.on(SOCKET_EVENTS.DELETED_INVITE_WAS_SEND, (id) =>
      startTransition(() => dispatch(updateRequestFriends(id)))
    );
    socket.on(SOCKET_EVENTS.DELETED_FRIEND, (id) =>
      startTransition(() => {
        dispatch(updateFriend(id));
        dispatch(updateFriendChat(id));
      })
    );
    socket.on(SOCKET_EVENTS.FRIEND_ONLINE_STATUS, (d) =>
      startTransition(() =>
        dispatch(setFriendOnlineStatus({ friendId: d.userId, isOnline: d.isOnline }))
      )
    );
    socket.on(SOCKET_EVENTS.FRIEND_TYPING, (d) =>
      startTransition(() =>
        dispatch(setFriendTypingStatus({ friendId: d.userId, isTyping: d.isTyping }))
      )
    );

    return () => {
      socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, onMessage);
      socket.off(SOCKET_EVENTS.MESSAGE_RECALLED);
      socket.off(SOCKET_EVENTS.MESSAGE_DELETED_FOR_ME);
      socket.off(SOCKET_EVENTS.JOIN_CONVERSATION, onJoinConv);
      socket.off(SOCKET_EVENTS.SEND_FRIEND_INVITE);
      socket.off(SOCKET_EVENTS.ACCEPT_FRIEND);
      socket.off(SOCKET_EVENTS.DELETED_FRIEND_INVITE);
      socket.off(SOCKET_EVENTS.DELETED_INVITE_WAS_SEND);
      socket.off(SOCKET_EVENTS.DELETED_FRIEND);
      socket.off(SOCKET_EVENTS.FRIEND_ONLINE_STATUS);
      socket.off(SOCKET_EVENTS.FRIEND_TYPING);
    };
  }, [conversations, dispatch, userId]);

  // 6. Emit JOIN on connect
  useEffect(() => {
    const onConnect = () => {
      socket.emit(SOCKET_EVENTS.JOIN, userId);
      if (conversations.length) {
        socket.emit(
          SOCKET_EVENTS.JOIN_CONVERSATIONS,
          conversations.map((c) => c._id)
        );
      }
    };
    socket.on("connect", onConnect);
    return () => socket.off("connect", onConnect);
  }, [conversations, userId]);

  const handleConversationClick = (id) => startTransition(() => navigate(`/chat/${id}`));

  return (
    <div className="flex w-full h-screen bg-gradient-to-b from-blue-50/50 to-white">
      <SideBar
        messages={conversations.filter((c) => !c.type)}
        groups={conversations.filter((c) => c.type)}
        requests={[]}
        user={user}
        onConversationClick={handleConversationClick}
      />
      <div className="flex-1 overflow-auto">
        {isPending ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin" />
          </div>
        ) : (
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin" />
              </div>
            }
          >
            <Outlet />
            <IncomingCallModal />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default memo(MainLayout);
