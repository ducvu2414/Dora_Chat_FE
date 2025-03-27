import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { ContactList } from "@/components/ui/Contact/ContactList";
import { FriendRequestList } from "@/components/ui/Contact/FriendRequestList";
import { SentRequestList } from "@/components/ui/Contact/SentRequestList";
import GroupList from "@/components/ui/Contact/GroupList";
import { GroupRequestList } from "@/components/ui/Contact/GroupRequestList";
import { ContactTabs } from "@/components/ui/Contact/ContactTabs";
import { ContactSearch } from "@/components/ui/Contact/ContactSearch";
import { AlertMessage } from "@/components/ui/alert-message";
import { useDispatch, useSelector } from "react-redux";
import {
  setFriends,
  setRequestFriends,
  setMyRequestFriends,
  updateFriend,
  updateRequestFriends,
  updateMyRequestFriend
} from "@/features/friend/friendSlice";
import friendApi from "@/api/friend";

export default function ContactsPage() {
  const [activeTab, setActiveTab] = useState("friend-list");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const friendList = useSelector(state => state.friend.friends);
  const friendRequests = useSelector(state => state.friend.requestFriends);
  const sentRequests = useSelector(state => state.friend.myRequestFriends);
  const groupList = [];

  const debouncedSearch = useCallback(
    debounce((term) => {
      fetchFriends(term);
    }, 500),
    []
  );

  const fetchFriends = async (searchName = "") => {
    try {
      setIsLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await friendApi.fetchFriends(user._id, searchName);
      console.log("Friend API response:", response);

      if (response) {
        let friendsData = [];
        if (Array.isArray(response)) {
          friendsData = response;
        } else if (response && Array.isArray(response)) {
          friendsData = response;
        } else if (response.friendsTempt && Array.isArray(response.friendsTempt)) {
          friendsData = response.friendsTempt;
        } else {
          console.error("Unexpected response format:", response);
        }
        dispatch(setFriends(friendsData));
      } else {
        setError("Không thể tải danh sách bạn bè");
        AlertMessage({
          type: "error",
          message: "Không thể tải danh sách bạn bè"
        });
      }
    } catch (err) {
      console.error("Error fetching friends:", err);
      setError("Đã xảy ra lỗi khi tải danh sách bạn bè");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      setIsLoading(true);
      const response = await friendApi.fetchListRequestFriend();
      if (response && !response.error) {
        dispatch(setRequestFriends(response || []));
      } else {
        setError("Không thể tải danh sách lời mời kết bạn");
      }
    } catch (err) {
      console.error("Error fetching friend requests:", err);
      setError("Đã xảy ra lỗi khi tải danh sách lời mời kết bạn");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptFriendRequest = async (userId) => {
    try {
      const response = await friendApi.acceptRequestFriend(userId);
      if (response && !response.error) {
        dispatch(updateRequestFriends(userId));
        fetchFriends();
        AlertMessage({
          type: "success",
          message: "Đã chấp nhận lời mời kết bạn"
        });
      } else {
        AlertMessage({
          type: "error",
          message: "Không thể chấp nhận lời mời kết bạn"
        });
      }
    } catch (err) {
      console.error("Error accepting friend request:", err);
      AlertMessage({
        type: "error",
        message: "Đã xảy ra lỗi khi chấp nhận lời mời kết bạn"
      });
    }
  };

  const handleRejectFriendRequest = async (userId) => {
    try {
      const response = await friendApi.deleteRequestFriend(userId);
      if (response && !response.error) {
        dispatch(updateRequestFriends(userId));
        AlertMessage({
          type: "success",
          message: "Đã từ chối lời mời kết bạn"
        });
      } else {
        AlertMessage({
          type: "error",
          message: "Không thể từ chối lời mời kết bạn"
        });
      }
    } catch (err) {
      console.error("Error rejecting friend request:", err);
      AlertMessage({
        type: "error",
        message: "Đã xảy ra lỗi khi từ chối lời mời kết bạn"
      });
    }
  };

  const handleDeleteFriend = async (userId) => {
    try {
      const response = await friendApi.deleteFriend(userId);
      if (response && !response.error) {
        dispatch(updateFriend(userId));
        AlertMessage({
          type: "success",
          message: "Đã xóa bạn bè thành công"
        });
      } else {
        AlertMessage({
          type: "error",
          message: "Không thể xóa bạn bè"
        });
      }
    } catch (err) {
      console.error("Error deleting friend:", err);
      AlertMessage({
        type: "error",
        message: "Đã xảy ra lỗi khi xóa bạn bè"
      });
    }
  };

  const fetchSentRequests = async () => {
    try {
      setIsLoading(true);
      const response = await friendApi.fetchMyRequestFriend();
      if (response && !response.error) {
        dispatch(setMyRequestFriends(response || []));
      } else {
        setError("Không thể tải danh sách lời mời kết bạn đã gửi");
      }
    } catch (err) {
      console.error("Error fetching sent friend requests:", err);
      setError("Đã xảy ra lỗi khi tải danh sách lời mời kết bạn đã gửi");
    } finally {
      setIsLoading(false);
    }
  }

  // Xử lý hủy lời mời kết bạn đã gửi
  const handleCancelFriendRequest = async (userId) => {
    try {
      const response = await friendApi.deleteSentRequestFriend(userId);
      if (response && !response.error) {
        dispatch(updateMyRequestFriend(userId));
        AlertMessage({
          type: "success",
          message: "Đã hủy lời mời kết bạn"
        });
      } else {
        AlertMessage({
          type: "error",
          message: "Không thể hủy lời mời kết bạn"
        });
      }
    } catch (err) {
      console.error("Error canceling friend request:", err);
      AlertMessage({
        type: "error",
        message: "Đã xảy ra lỗi khi hủy lời mời kết bạn"
      });
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (activeTab === "friend-list") {
      debouncedSearch(term);
    } else if (activeTab === "friend-requests") {
      const filteredRequests = friendRequests.filter((request) =>
        request.name.toLowerCase().includes(term.toLowerCase())
      );
      dispatch(setRequestFriends(filteredRequests));

      if (!term) {
        fetchFriendRequests();
      }
    } else if (activeTab === "sent-requests") {
      const filteredSent = sentRequests.filter((request) =>
        request.name.toLowerCase().includes(term.toLowerCase())
      );
      dispatch(setMyRequestFriends(filteredSent));

      if (!term) {
        fetchSentRequests();
      }
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setError(null);

    if (tabId === "friend-list") {
      fetchFriends(searchTerm);
    } else if (tabId === "friend-requests") {
      fetchFriendRequests();
    } else if (tabId === "sent-requests") {
      fetchSentRequests();
    }
  };

  // Fetching Data on ContactsPage Load
  useEffect(() => {
    setError(null);

    fetchFriends();
    fetchFriendRequests();
    fetchSentRequests();

    return () => {
      debouncedSearch.cancel();
    };
  }, []);
  useEffect(() => {
    setError(null);
    return () => {
      debouncedSearch.cancel();
    };
  }, [activeTab]);

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-64">Đang tải...</div>;
    }

    if (error) {
      return <div className="text-red-500 text-center">{error}</div>;
    }

    switch (activeTab) {
      case "friend-list":
        return <ContactList
          contacts={friendList}
          onDeleteFriend={handleDeleteFriend}
        />;
      case "friend-requests":
        return <FriendRequestList
          friendRequests={friendRequests}
          onAccept={handleAcceptFriendRequest}
          onReject={handleRejectFriendRequest}
        />;
      case "sent-requests":
        return <SentRequestList
          sentRequests={sentRequests}
          onCancel={handleCancelFriendRequest}
        />;
      case "group-list":
        return <GroupList groups={groupList} />;
      case "group-requests":
        return <GroupRequestList groupRequests={[
          {
            id: "1",
            avatar: "https://cdn.sanity.io/images/599r6htc/regionalized/5094051dac77593d0f0978bdcbabaf79e5bb855c-1080x1080.png?w=540&h=540&q=75&fit=max&auto=format",
            name: "Design Team",
            message: "You have been invited to join Design Team"
          }
        ]} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/4 p-6 border-r border-gray-200 bg-white">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">Contacts</h1>
        <ContactTabs activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
      <div className="w-3/4 p-6">
        <ContactSearch onSearch={handleSearch} />
        {renderContent()}
      </div>
    </div>
  );
}
