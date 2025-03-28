import { SideBar } from "@/components/ui/side-bar";
import { memo, Suspense, useRef, useState, useTransition } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { codeRevokeRef, SOCKET_EVENTS } from "../../utils/constant";
import { init, socket, isConnected } from "../../utils/socketClient";
import { useDispatch, useSelector } from "react-redux";
import {
  setNewFriend,
  setMyRequestFriend,
  updateMyRequestFriend,
  updateRequestFriends,
  updateFriend,
  updateFriendChat,
  setNewRequestFriend,
  setAmountNotify,
  setFriendOnlineStatus,
  setFriendTypingStatus,
} from "../../features/friend/friendSlice";

const messages = [
  {
    id: 1,
    avatar:
      "https://s3-alpha-sig.figma.com/img/b716/471e/a92dba5e34fe4ed85bd7c5f535acdaae?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LjxeFExG2mfQsIC1PhfgwD5sI1KwkgcdwdyUS5AyHkUVuwcJf1wR0ZiKF7RZrM0i8GSlA7aHsoF51XhpRQLxR4qVXSw6UnYprvVtc7RNpJffWnq1ukN~P7L77ZIPtjU6181DFElG8PGlTyFsLtC0TD24WIb-y7s7EIcnJrVTSDRyotmNCUq-j0qSMuU1rOM301xCYXHB3Ul70GKtqsgBKK8x79HKBZgu-laGa4Oy7rfMzDnlbjS2pO6EwNUu~wFvwhBiGnMSUcfFZeD4txGpwBhJCUDT8epFoEW82g1cYS81ClzjFuMme3-BsB9QFjlEHrquHOeBoH-A9zON9uXx4g__",
    name: "Iris Paul",
    message: "How are you?",
    time: "Now",
  },
  {
    id: 2,
    avatar:
      "https://s3-alpha-sig.figma.com/img/77c6/8849/96c44a460b55a989d90970fc2b0d81ac?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=iNBXCAYM3XkbLwPPyDFsTOF1VUQ0bDb9tl-CwAtztbj1ZjtN2hARIoDC2VTA~txeqLZZ7WjmCJ-3Ecc6WY1lMMz2762duRsHiNhuSpSAcgpx5YCi070aaug2lmT2xEEizj1zIJYJZrh~fs2fc8AjHjM~Dtg2d4AzCOtMakm02pw~6VIajB6AlFxd4M9l-esyKuKy65lQKwG0w~mgAvsScnIry7uMWeC923sSRbV4RMUY7mfHkG3kr6rcFeOq2jmEhL4dAwyHri0ALLzVRe3brQ5o7M3f2SVquTzqRZtwTSedEjUg55O5M-Ka7p68--Q~DsX6yKZWbk00uWVqFaWjxA__",
    name: "Jone Nguyen",
    message: "How are you?",
    time: "2 mins",
  },
  {
    id: 3,
    avatar:
      "https://s3-alpha-sig.figma.com/img/b3c2/3d22/9e7189a7eb428bd40284e032a6a646cc?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=qeF61cmLHi1NPEez5ZCWxrLsDss5xAGHt44FH3cPc7oQ7s86nIJayB064zDnzpKYCACqeOGGjVO5VjCOWtWm3fbpjw~hGaYG~ebUaTfu597TWCIiEvJ99gdk5F2Ig~zirHOUZFvCEAorIZhiX0JRJ-rOUnJqOOWX7fzzorNBpHis2wHEWU6zfdBdbeBQ0cQrH4OB6K02bMK4cHfCkM2t3foddVeShTHUv9U2Zt3~A1jSbkF4VzAs0QXoCnrUF4RP0WIYaetUZfLZyFWL9uOq-McF12Xj~Vj4Hrkpy6dxfeZnxwLwD52tN8dz7gIdRflVlN6P26cxdAD50byl2XUr2A__",
    name: "Aurora Bonita",
    message: "How are you?",
    time: "20 mins",
  },
  {
    id: 4,
    avatar:
      "https://s3-alpha-sig.figma.com/img/4b44/1d65/e43e4a32db699d94c4bada7aa2ccff06?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LC4Lf-~lXiy7cXb7W7bD7gMkfkKG-MuT1w9BHPIT8MHna451KqaiuFaI4a23dJQ5CFyzf~P8yG7ti1rf02Gr9rEJ9J1SKuRUvRkrngZfD-YCPsydqKLarHXUglcV1-it82Q-Tn1-lKMOBTOnWIfBwUlsv44X8XdtuXLdkbUAG5wDOsmGyRde4i0CC6ZEw7TnIIPmM75HI9tE7GTRy4jjWwhf23ixSZF39XVOL-yoUSCzZyU--khY6RXRrznHqXD6lt3REZY8WXjrjzG01RmlftfhMhJQ3UkkWYanFEnX-S~d1tbMMpNc3A20DYYddm5ENQuaA-NMR~y~mFKd7Xak6g__",
    name: "Tom Athony",
    message: "How are you?",
    time: "4 hours",
  },
  {
    id: 5,
    avatar:
      "https://s3-alpha-sig.figma.com/img/0dca/d322/bd3b28a9327f195eb0ce730500f0d0da?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=bQj558EhPLvR54rq0b2PL0gPgTXPT19sHatuctR86Gn3FfMyB3lzgRTgxMdL77chQqFQPJ3sx4cWwEXLU5aYsS7S8BZUhbdtL5oaxwYPaZ2CRJH7TVyWElUBQenup5CcNzIlLxgsg6MMnDsF0xWYt3kYGayvLEYTTLolGfsVTooWyxuCiuY-yqwIty5yV88U7cdCUrkYTSptvCP7H3Z-RpanK5nFfbepVkyVs~fZzICaYORaMItemepGNBfanrzYXn5Y6-XdcYyi-OVi17uFT559yksnRvi4dQ0gsFjNphLXbS0Jz4IsBEFqxhEdgnzOjkWtpc0nMaZr92ke9dju~Q__",
    name: "Liam Hemsworth",
    message: "How are you?",
    time: "6 hours",
  },
  {
    id: 6,
    avatar:
      "https://s3-alpha-sig.figma.com/img/05a9/c731/be92cab5736e28f18b4b2ca1d65fd213?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Etqp8TCP2Bt6L7~3qfgv1ckwPVILUO88ZAO3IJkqAcqyZRRIi9YFFxxoNr-~SFaVN7vNI1XrKBB8iH0v-0S5mHoC2QngbIQzNPM-3UkMYGmU1ZYt9xGINd7tldlqJVniAYXv-0PlynrhWrSKgTJe~J~Wiwo-wy5YDp-V63iI7u00cOSeZTxGdZwx1SNN7a8MFK6OUL0v~OBB-e498DbrtsDXL8BOinhAToKDp71dRgj-eWIG4QCWeV~P3GRx2aYiCDtYvU3DtlCtPYL2ceY35KmSOQXJ77BWSMVYUplcu8OgNsWbOsaCWS95Ln8LuOq6FqC7X94exi8ZtupWhJmHVg__",
    name: "Daria Julli",
    message: "How are you?",
    time: "21 hours",
  },
  {
    id: 7,
    avatar:
      "https://s3-alpha-sig.figma.com/img/4f96/6c32/0b9a00911f35a7ae254f6846bb1f4021?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RZT9n-2xU0OV8osbPbAYdd9QxuYH93wC6VE9dRymL0hPPUZ2RrulkhHwVDP9WDfRJ7I2sgUnBX5gtvWi1gXCuM~DJ-9iwXYx9E3IFuWp-zhH14Bm6--o6Vj3ebU9u1GmG0h0Q445KGb9rFAwuGD3N-VDabqhIYv0xy-hmyRzZxfaX9fTzNtctDMCis-~0QNLwxuVBFTUx9TjaCznyHzRvqhq1NHtvhE~H488WFMLDxbFJpy52EZn7fK7ZCS4x98dGgsHTYzwuqReluqWUwLKcPQl0RR-ShqPub-vYnjN-NxMmsVHzoAzPD1Pc4Eu1TYzBAWTzGgchaiYyFXO-FEWuA__",
    name: "Monica William",
    message: "How are you?",
    time: "Yesterday",
  },
];

const groups = [
  {
    id: 1,
    avatar:
      "https://cdn.sanity.io/images/599r6htc/regionalized/5094051dac77593d0f0978bdcbabaf79e5bb855c-1080x1080.png?w=540&h=540&q=75&fit=max&auto=format",
    name: "Design Team",
    message: "New project discussion",
    time: "5 mins",
  },
  {
    id: 2,
    avatar:
      "https://cdn.bap-software.net/2024/01/03211643/How-is-AI-applied-to-Java-programming-e1704266486769.jpg",
    name: "Development Team",
    message: "Sprint planning",
    time: "1 hour",
  },
  {
    id: 3,
    avatar:
      "https://osd.vn/media/data/news/2022/06/seo-la-gi-seo-web-la-gi-ban-hieu-the-nao-ve-seo-2.jpg",
    name: "Marketing Team",
    message: "Campaign updates",
    time: "3 hours",
  },
];

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
  const [isPending, startTransition] = useTransition();
  const [socketInitialized, setSocketInitialized] = useState(false);
  const user = useRef(JSON.parse(localStorage.getItem("user") || "{}"));

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

  useEffect(() => {
    if (!socket || !user.current?._id) return;

    socket.on("connect", () => {
      socket.emit(SOCKET_EVENTS.JOIN, user.current._id);
      // socket.emit(SOCKET_EVENTS.USER_ONLINE, { userId: user.current._id, isOnline: true });
    });

    const handleAcceptFriend = (value) => {
      startTransition(() => {
        console.log("handleAcceptFriend", value);
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

    const handleRevokeToken = ({ key }) => {
      if (codeRevokeRef.current !== key) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.reload();
      }
    };
    // kha add id user join socket
    if (socketInitialized) {
      const user = JSON.parse(localStorage.getItem("user"));
      socket.emit(SOCKET_EVENTS.JOIN_USER, user._id);
    }
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

    // Register all event listeners
    socket.on(SOCKET_EVENTS.ACCEPT_FRIEND, handleAcceptFriend);
    socket.on(SOCKET_EVENTS.SEND_FRIEND_INVITE, handleFriendInvite);
    socket.on(SOCKET_EVENTS.DELETED_FRIEND_INVITE, handleDeleteFriendInvite);
    socket.on(SOCKET_EVENTS.DELETED_INVITE_WAS_SEND, handleDeleteInviteSend);
    socket.on(SOCKET_EVENTS.DELETED_FRIEND, handleDeleteFriend);
    socket.on(SOCKET_EVENTS.REVOKE_TOKEN, handleRevokeToken);

    socket.on(SOCKET_EVENTS.FRIEND_ONLINE_STATUS, handleFriendOnlineStatus);
    socket.on(SOCKET_EVENTS.FRIEND_TYPING, handleFriendTyping);

    return () => {
      socket.off(SOCKET_EVENTS.ACCEPT_FRIEND, handleAcceptFriend);
      socket.off(SOCKET_EVENTS.SEND_FRIEND_INVITE, handleFriendInvite);
      socket.off(SOCKET_EVENTS.DELETED_FRIEND_INVITE, handleDeleteFriendInvite);
      socket.off(SOCKET_EVENTS.DELETED_INVITE_WAS_SEND, handleDeleteInviteSend);
      socket.off(SOCKET_EVENTS.DELETED_FRIEND, handleDeleteFriend);
      socket.off(SOCKET_EVENTS.REVOKE_TOKEN, handleRevokeToken);

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
