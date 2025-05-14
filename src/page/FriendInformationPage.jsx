import { Button } from "@/components/ui/button";
import { MessageCircle, UserRoundMinus, UserRoundPlus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import BannerImage from "@/assets/banner-user-info.png";
import CatIllustration from "@/assets/friend-information.png";
import friendApi from "../api/friend";
import { updateFriendChat } from "../features/friend/friendSlice";
import {
  setFriends,
  setRequestFriends,
  setMyRequestFriends,
  updateFriend,
  updateRequestFriends,
  updateMyRequestFriend,
} from "@/features/friend/friendSlice";

const hobbies = [
  { icon: "🏸", label: "Bamintion" },
  { icon: "⚽", label: "Football" },
  { icon: "🎤", label: "Singing" },
  { icon: "📸", label: "Photograh" },
];

export default function FriendInformationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = state?.userData;
  const userLogin = JSON.parse(localStorage.getItem("user"));
  const userId = userLogin._id;

  const { friends, requestFriends, myRequestFriends } = useSelector(
    (s) => s.friend
  );

  // Determine relationship status
  const isFriend = friends.some((f) => f._id === userData?._id);
  const hasSentRequest = myRequestFriends.some((r) => r._id === userData?._id);
  const hasReceivedRequest = requestFriends.some(
    (r) => r._id === userData?._id
  );

  // Conversation lookup
  const conversations = useSelector((s) => s.chat.conversations);
  const conversation = conversations.find(
    (conv) =>
      conv.members.some((m) => m.userId === userId) &&
      conv.members.some((m) => m.userId === userData._id)
  );

  // Fetch all lists on mount
  useEffect(() => {
    fetchFriends();
    fetchFriendRequests();
    fetchSentRequests();

    return () => {};
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

  const handleCancelRequest = async () => {
    try {
      await friendApi.deleteSentRequestFriend(userData._id);
      dispatch(updateMyRequestFriend(userData._id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddFriend = async () => {
    try {
      await friendApi.sendRequestFriend(userData._id);
      dispatch(updateMyRequestFriend(userData._id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex w-full h-screen bg-gradient-to-b from-blue-50/50 to-white">
      {/* Main Content */}
      <div className="relative flex-1 p-3 bg-blue-100">
        {/* Banner Image */}
        <div
          className="w-full bg-center bg-cover h-72 rounded-2xl"
          style={{
            backgroundImage: `url(${userData?.coverImage || BannerImage})`,
          }}
        />

        {/* Profile Content */}
        <div className="relative z-10 max-w-4xl px-8 mx-auto -mt-48">
          <div className="relative p-8 mt-12 bg-white shadow-sm rounded-3xl">
            {/* Profile Image - Positioned to overlap */}
            <div className="absolute transform -translate-x-1/2 -top-12 left-1/2">
              <img
                src={userData?.avatar || BannerImage}
                alt="Monica William"
                className="object-cover w-24 h-24 border-4 border-white rounded-full"
              />
            </div>

            <div className="flex flex-col items-center pt-4">
              {/* Name and Bio */}
              <h1 className="mb-1 text-2xl font-semibold text-blue-600">
                {userData?.name || "Unknown User"}
              </h1>
              <p className="mb-6 text-gray-600">
                ✨ Adding a little sparkle to your day.
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-4">
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate(`/chat/${conversation?._id}`)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send message
                </Button>
                {hasReceivedRequest ? (
                  <>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleAcceptRequest}
                    >
                      Accept
                    </Button>
                    <Button
                      className="bg-red-600 hover:bg-red-700"
                      onClick={handleRejectRequest}
                    >
                      Reject
                    </Button>
                  </>
                ) : isFriend ? (
                  <Button
                    className="bg-red-600 hover:bg-red-700"
                    onClick={handleUnfriend}
                  >
                    <UserRoundMinus className="w-4 h-4 mr-2" />
                    Unfriend
                  </Button>
                ) : hasSentRequest ? (
                  <Button
                    className="bg-gray-400 hover:bg-gray-500"
                    onClick={handleCancelRequest}
                  >
                    Cancel Request
                  </Button>
                ) : (
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleAddFriend}
                  >
                    <UserRoundPlus className="w-4 h-4 mr-2" />
                    Add friend
                  </Button>
                )}
              </div>

              {/* Information Section */}
              <div className="w-full max-w-md">
                <div className="space-y-8">
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-300"></div>
                    <div>
                      <h2 className="relative flex items-center gap-4 mb-4 font-medium text-blue-600">
                        <div className="relative w-8 h-8">
                          <div className="absolute inset-0 bg-blue-600 rounded-full"></div>
                          <div className="absolute bg-white rounded-full inset-2"></div>
                        </div>
                        Her information
                      </h2>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 ml-12">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50">
                            <span className="text-lg">🎂</span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Date of birth:{" "}
                              <span className="text-sm font-bold">
                                January 25, 2003
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-12">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50">
                            <span className="text-lg">📅</span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Join at:{" "}
                              <span className="text-sm font-bold">
                                November 11, 2003
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-12">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50">
                            <span className="text-lg">📍</span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Live at:{" "}
                              <span className="text-sm font-bold">
                                Ho Chi Minh City
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hobbies Section */}
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-300"></div>
                    <div>
                      <h2 className="relative flex items-center gap-4 mb-4 font-medium text-blue-600">
                        <div className="relative w-8 h-8">
                          <div className="absolute inset-0 bg-blue-600 rounded-full"></div>
                          <div className="absolute bg-white rounded-full inset-2"></div>
                        </div>
                        Her hobbies
                      </h2>
                      <div className="flex flex-wrap gap-2 ml-12">
                        {hobbies.map((hobby) => (
                          <span
                            key={hobby.label}
                            className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 rounded-full bg-blue-50"
                          >
                            {hobby.icon} {hobby.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cat Illustration - Positioned at bottom right */}
            <div className="absolute bottom-0 right-0">
              <img
                src={CatIllustration}
                alt="Cat illustration"
                className="w-48 h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
