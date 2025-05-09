/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { MessageCircle, UserRoundPlus, UserRoundMinus } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setFriends,
  setRequestFriends,
  setMyRequestFriends,
  updateFriend,
  updateRequestFriends,
  updateMyRequestFriend,
} from "@/features/friend/friendSlice";
import BannerImage from "@/assets/banner-user-info.png";
import CatIllustration from "@/assets/other-people-information.png";
import friendApi from "../api/friend";
import { updateFriendChat } from "../features/friend/friendSlice";

export default function OtherPeopleInformation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = state?.userData;

  const userLogin = JSON.parse(localStorage.getItem("user"));
  const userId = userLogin._id;


  // Fetch all lists on mount
  useEffect(() => {
    fetchFriends();
    fetchFriendRequests();
    fetchSentRequests();

    return () => {
    };
  }, []);

  // --- API calls with .data extraction to avoid non-serializable ----------
  const fetchFriends = async (searchName = "") => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await friendApi.fetchFriends(user._id, searchName);
      dispatch(setFriends(response));
    } catch (err) {
      console.error("Error fetching friends:", err);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await friendApi.fetchListRequestFriend();
      console.log("Friend Requests:", response);
      dispatch(setRequestFriends(response));
    } catch (err) {
      console.error("Error fetching friend requests:", err);
    }
  };

  const fetchSentRequests = async () => {
    try {
      const response = await friendApi.fetchMyRequestFriend();
      console.log("Sent Friend Requests:", response);
      dispatch(setMyRequestFriends(response));
    } catch (err) {
      console.error("Error fetching sent requests:", err);
    }
  };

  const { friends, requestFriends, myRequestFriends } = useSelector((s) => s.friend);
  // Determine relationship status
  const isFriend = friends.some((f) => f._id === userData?._id);
  const hasSentRequest = myRequestFriends.some((r) => r._id === userData?._id);
  const hasReceivedRequest = requestFriends.some((r) => r._id === userData?._id);

  // Conversation lookup
  const conversations = useSelector((s) => s.chat.conversations);
  const conversation = conversations.find((conv) =>
    conv.members.some((m) => m.userId === userId) &&
    conv.members.some((m) => m.userId === userData._id)
  );

  // Button handlers
  const handleAddFriend = async () => {
    try {
      await friendApi.sendRequestFriend(userData._id);
      dispatch(updateMyRequestFriend(userData._id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelRequest = async () => {
    try {
      await friendApi.deleteSentRequestFriend(userData._id);
      dispatch(updateMyRequestFriend(userData._id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptRequest = async () => {
    try {
      await friendApi.acceptRequestFriend(userData._id);
      dispatch(updateRequestFriends(userData._id));
      dispatch(updateFriend(userData._id));
      dispatch(updateFriendChat(userData._id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectRequest = async () => {
    try {
      await friendApi.deleteRequestFriend(userData._id);
      dispatch(updateRequestFriends(userData._id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnfriend = async () => {
    try {
      if (window.confirm("Are you sure you want to remove this friend?")) {
        await friendApi.deleteFriend(userData._id);
        dispatch(updateFriend(userData._id));
        dispatch(updateFriendChat(userData._id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex w-full h-screen bg-gradient-to-b from-blue-50/50 to-white">
      <div className="relative flex-1 p-3 bg-blue-100">
        <div
          className="w-full bg-center bg-cover h-72 rounded-2xl"
          style={{ backgroundImage: `url(${userData?.coverImage || BannerImage})` }}
        />
        <div className="relative z-10 max-w-2xl px-8 mx-auto -mt-48">
          <div className="bg-white rounded-3xl p-8 shadow-sm relative min-h-[400px]">
            <div className="absolute transform -translate-x-1/2 -top-12 left-1/2">
              {userData?.avatar ? (
                <img
                  src={userData?.avatar}
                  alt={userData?.name}
                  className="object-cover w-24 h-24 border-4 border-white rounded-full"
                />
              ) : (
                <div
                  src={userData?.avatar}
                  alt={userData?.name}
                  className="object-cover w-24 h-24 border-4 border-white rounded-full"
                  // style bg color is userData?.color
                  style={{
                    backgroundColor: userData?.avatarColor || "#ccc",
                  }}
                />
              )}
            </div>

            <div className="flex flex-col items-center pt-16">
              {/* Name and Bio */}
              <h1 className="mb-1 text-2xl font-semibold text-blue-600">
                {userData?.name}
              </h1>
              <p className="mb-6 text-gray-600">✨ King of the Coastline ✨</p>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate(`/chat/${conversation?._id}`)}
                  disabled={!conversation}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send message
                </Button>

                {hasReceivedRequest ? (
                  <>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={handleAcceptRequest}>
                      Accept
                    </Button>
                    <Button className="bg-red-600 hover:bg-red-700" onClick={handleRejectRequest}>
                      Reject
                    </Button>
                  </>
                ) : isFriend ? (
                  <Button className="bg-red-600 hover:bg-red-700" onClick={handleUnfriend}>
                    <UserRoundMinus className="w-4 h-4 mr-2" />
                    Unfriend
                  </Button>
                ) : hasSentRequest ? (
                  <Button className="bg-gray-400 hover:bg-gray-500" onClick={handleCancelRequest}>
                    Cancel Request
                  </Button>
                ) : (
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddFriend}>
                    <UserRoundPlus className="w-4 h-4 mr-2" />
                    Add friend
                  </Button>
                )}
              </div>

              {/* Message */}
              <p className="text-lg text-gray-700">
                Make friends with <span className="text-orange-500">{userData.name.split(' ').pop()}</span> to learn more.
              </p>

              {/* Cat Illustration */}
              <div className="absolute bottom-0 right-0">
                <img src={CatIllustration} alt="Cat illustration" className="w-48 h-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
