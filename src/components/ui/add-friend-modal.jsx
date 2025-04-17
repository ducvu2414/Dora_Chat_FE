import { useState } from "react";
import { Search, UserPlus, MessageCircle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import userApi from "@/api/user";
import friendApi from "@/api/friend";
import VnFlag from "@assets/vn_flag.png";
import { AlertMessage } from "@/components/ui/alert-message"; // ✅ Toast thông báo

// eslint-disable-next-line react/prop-types
export function AddFriendModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [hasSentRequest, setHasSentRequest] = useState(false);

  const resetModalState = () => {
    setPhoneNumber("");
    setSearchResult(null);
    setHasSentRequest(false);
  };

  const handleSearch = async () => {
    try {
      const user = await userApi.getUserByPhoneNumber(phoneNumber);
      setSearchResult(user);
      setHasSentRequest(false);
    } catch (error) {
      console.error("Error searching for user:", error);
      AlertMessage({ type: "error", message: "Không tìm thấy người dùng" }); // ✅ Thông báo lỗi
    }
  };

  const handleSendFriendRequest = async () => {
    try {
      await friendApi.sendRequestFriend(searchResult._id);
      setHasSentRequest(true);
      AlertMessage({ type: "success", message: "Send friend request successfully" });
    } catch (error) {
      console.error("Error sending friend request:", error);
      AlertMessage({ type: "error", message: error.response.data.message });
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          resetModalState();
          onClose();
        }}
        title="Add friend"
      >
        <div className="space-y-6">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute flex items-center gap-1 -translate-y-1/2 left-3 top-1/2">
                <img
                  src={VnFlag}
                  alt="Vietnam flag"
                  className="object-cover w-6 h-4 rounded"
                />
                <span className="text-sm font-medium text-regal-blue">(+84)</span>
              </div>
              <Input
                type="text"
                placeholder="Phone number"
                className="pl-24"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 focus:outline-none"
              onClick={handleSearch}
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-center text-gray-500">
              {searchResult ? "Result" : "Recent"}
            </h3>

            {searchResult ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={searchResult.avatar}
                    alt={searchResult.name}
                    className="object-cover w-12 h-12 rounded-full cursor-pointer"
                    onClick={() => {
                      resetModalState();
                      onClose();
                      navigate("/other-people-information/" + searchResult._id);
                    }}
                  />
                  <div className="text-left">
                    <h4
                      className="text-sm font-medium cursor-pointer"
                      onClick={() => navigate("/other-people-information")}
                    >
                      {searchResult.name}
                    </h4>
                    <p className="text-sm text-gray-500">{searchResult.username}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {/* Ẩn nút nếu đã là bạn */}
                  {!searchResult.isFriend && (
                    <Button
                      size="icon"
                      className="bg-blue-600 rounded-full hover:bg-blue-700 disabled:opacity-50"
                      disabled={hasSentRequest}
                      onClick={handleSendFriendRequest}
                    >
                      {hasSentRequest ? (
                        <span className="text-xs font-semibold px-2">Sent</span>
                      ) : (
                        <UserPlus className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                  <Button
                    size="icon"
                    className="bg-blue-600 rounded-full hover:bg-blue-700"
                    onClick={() => {
                      // Optional: Navigate to chat
                      // navigate("/chat/" + searchResult._id);
                    }}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex items-center justify-center w-20 h-20 mb-4 bg-gray-100 rounded-full">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path
                      d="M20 10C17.7909 10 16 11.7909 16 14C16 16.2091 17.7909 18 20 18C22.2091 18 24 16.2091 24 14C24 11.7909 22.2091 10 20 10Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M14 22C12.8954 22 12 22.8954 12 24V27C12 28.1046 12.8954 29 14 29H26C27.1046 29 28 28.1046 28 27V24C28 22.8954 27.1046 22 26 22H14Z"
                      fill="#E5E7EB"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">No recent searches</p>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Toast Container */}
      <AlertMessage type="info" message={null} /> {/* cần để toast hoạt động */}
    </>
  );
}
