/* eslint-disable react/prop-types */
import Avatar from "@assets/chat/avatar.png";
import userApi from "@/api/user";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import friendApi from "@/api/friend";
import { useDispatch, useSelector } from "react-redux";
import { updateMyRequestFriend } from "@/features/friend/friendSlice";
export default function InfoContent({ info, memberLogin }) {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const conversations = useSelector((s) => s.chat.conversations);
  const dispatch = useDispatch();
  const conversation = conversations.find(
    (conv) =>
      conv.members.some((m) => m.userId === memberLogin.userId) &&
      conv.members.some((m) => m.userId === userInfo?._id) &&
      conv.members.length === 2
  );
  const { friends } = useSelector((s) => s.friend);

  // Determine relationship status
  const isFriend = friends.some((f) => f._id === userInfo?._id);
  const handleAddFriend = async () => {
    try {
      await friendApi.sendRequestFriend(userInfo?._id);
      dispatch(updateMyRequestFriend(userInfo?._id));
    } catch (err) {
      console.error(err);
    }
  };
  const handleFetchUserInfo = async () => {
    if (info) {
      try {
        setLoading(true);
        setError(null);
        const response = await userApi.getByMemberId(info);
        console.log("User Info Response:", response);
        setUserInfo(response.data || response);
      } catch (error) {
        console.error("Error fetching user info:", error);
        setError("Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    handleFetchUserInfo();
  }, [info]);

  // Format date of birth
  const formatDateOfBirth = (dateOfBirth) => {
    if (!dateOfBirth) return "no update";
    const { day, month, year } = dateOfBirth;
    if (!day || !month || !year) return "no update";
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  };

  // Format gender
  const formatGender = (gender) => {
    if (gender === true) return "Female";
    if (gender === false) return "Male";
    return "no update";
  };

  // Format phone number
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "no update";
    // Format phone number with spaces (e.g., 0388 412 884)
    return phoneNumber.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  };
  const handleViewInfo = async () => {
    const partData = {
      _id: userInfo._id,
      name: userInfo.name,
      avatar: userInfo.avatar,
      coverImage: userInfo.coverImage,
    };
    const friendRes = await friendApi.isFriend(
      JSON.parse(localStorage.getItem("user"))?._id,
      partData._id
    );
    const isFriend = friendRes === true ? true : friendRes.data;

    if (isFriend) {
      navigate("/friend-information", {
        state: {
          userData: partData,
        },
      });
    } else {
      navigate("/other-people-information", {
        state: {
          userData: partData,
        },
      });
    }
  };
  if (loading) {
    return (
      <div className="w-full p-4 text-center">
        <div className="animate-pulse">
          <div className="w-full h-40 bg-gray-200 rounded"></div>
          <div className="flex flex-col items-center -mt-14">
            <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
            <div className="mt-4 space-y-2">
              <div className="w-32 h-4 bg-gray-200 rounded"></div>
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 text-center">
        <div className="text-sm text-red-500">{error}</div>
        <button
          onClick={handleFetchUserInfo}
          className="px-4 py-2 mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="w-full text-center">
      <div className="w-full h-40 overflow-hidden bg-center bg-cover">
        <img
          src={
            userInfo?.coverImage ||
            "https://plus.unsplash.com/premium_photo-1661962309696-c429126b237e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt="Background"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="flex flex-col items-center -mt-14">
        <div className="relative">
          <img
            src={userInfo?.avatar || Avatar}
            alt="Avatar"
            className="object-cover w-24 h-24 border-4 border-white rounded-full shadow-lg"
            onError={(e) => {
              e.target.src = Avatar;
            }}
          />
        </div>

        <div className="mt-3 text-center">
          <h2 className="text-lg font-semibold text-gray-800">
            {userInfo?.name || "Người dùng"}
          </h2>
        </div>

        <div className="flex items-center gap-3 mt-4">
          {isFriend ? (
            <> </>
          ) : (
            <button
              onClick={handleAddFriend}
              className="px-4 py-2 text-sm font-medium text-[#086DC0] bg-[#F0F8FF] border border-gray-300 rounded-lg hover:bg-[#E0F0FF] hover:border-[#086DC0] transition-colors"
            >
              Add Friend
            </button>
          )}
          <button
            onClick={() => navigate(`/chat/${conversation?._id}`)}
            className="px-4 py-2 text-sm font-medium text-[#086DC0] bg-[#F0F8FF] border border-gray-300 rounded-lg hover:bg-[#E0F0FF] hover:border-[#086DC0] transition-colors"
          >
            Send Message
          </button>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleViewInfo}
          className="w-full px-4 py-2 text-sm font-medium text-[#086DC0] bg-[#F0F8FF] border-0 hover:bg-[#E0F0FF] transition-colors"
        >
          Xem trang cá nhân
        </button>
      </div>

      <div className="mt-4 bg-[#F0F8FF] p-4 rounded-lg">
        <h3 className="mb-3 font-semibold text-left text-gray-800">
          Thông tin cá nhân
        </h3>
        <div className="space-y-3 text-sm text-left">
          <div className="flex">
            <span className="flex-shrink-0 w-24 font-medium text-gray-600">
              Tên:
            </span>
            <span className="flex-1 text-gray-800">
              {userInfo?.name || "no update"}
            </span>
          </div>

          <div className="flex">
            <span className="flex-shrink-0 w-24 font-medium text-gray-600">
              Ngày sinh:
            </span>
            <span className="flex-1 text-gray-800">
              {formatDateOfBirth(userInfo?.dateOfBirth)}
            </span>
          </div>

          <div className="flex">
            <span className="flex-shrink-0 w-24 font-medium text-gray-600">
              Giới tính:
            </span>
            <span className="flex-1 text-gray-800">
              {formatGender(userInfo?.gender)}
            </span>
          </div>

          <div className="flex">
            <span className="flex-shrink-0 w-24 font-medium text-gray-600">
              Điện thoại:
            </span>
            <span className="flex-1 text-gray-800">
              {formatPhoneNumber(userInfo?.phoneNumber)}
            </span>
          </div>

          <div className="flex">
            <span className="flex-shrink-0 w-24 font-medium text-gray-600">
              Email:
            </span>
            <span className="flex-1 text-gray-800 break-all">
              {userInfo?.email || "no update"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
