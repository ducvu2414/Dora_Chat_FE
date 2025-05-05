import { useEffect, useState } from "react";
import { Search, UserPlus, MessageCircle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import userApi from "@/api/user";
import friendApi from "@/api/friend";
import VnFlag from "@assets/vn_flag.png";
import Email from "@assets/email.png";
import { AlertMessage } from "@/components/ui/alert-message";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// eslint-disable-next-line react/prop-types
export function AddFriendModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const [searchType, setSearchType] = useState("phone");
  const userLogin = JSON.parse(localStorage.getItem("user"));
  const [hasSentRequest, setHasSentRequest] = useState(false);
  const [resMyFriendRequest, setResMyFriendRequest] = useState([]);
  const resetModalState = () => {
    setSearchValue("");
    setSearchResult(null);
    setSearchType("phone");
    setHasSentRequest(false);
  };

  useEffect(() => {
    const fetchMyFriendRequest = async () => {
      try {
        const response = await friendApi.fetchMyRequestFriend();
        setResMyFriendRequest(response);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };
    fetchMyFriendRequest();
  }, []);

  const handleSearch = async () => {
    try {
      const phoneRegex = /^(0[0-9]{9})$/;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (searchType === "phone") {
        if (phoneRegex.test(searchValue)) {
          const user = await userApi.getUserByPhoneNumber(searchValue);
          const isFriend = await friendApi.isFriend(userLogin._id, user._id);
          setIsFriend(isFriend === true ? true : isFriend.data);
          setSearchResult(user);
        } else {
          AlertMessage({
            type: "error",
            message: "Invalid phone number",
          });
        }
      } else {
        if (emailRegex.test(searchValue)) {
          const user = await userApi.getUserByEmail(searchValue);
          const isFriend = await friendApi.isFriend(userLogin._id, user._id);
          setIsFriend(isFriend === true ? true : isFriend.data);
          setSearchResult(user);
        } else {
          AlertMessage({
            type: "error",
            message: "Invalid email address",
          });
        }
      }
    } catch (error) {
      setSearchResult(null);
      AlertMessage({ type: "error", message: "User not found" });
      console.error("Error searching for user:", error);
    }
  };

  const handleSendFriendRequest = async () => {
    try {
      
      if (
        resMyFriendRequest.some((friend) => friend._id === searchResult._id)
      ) {
        AlertMessage({
          type: "error",
          message: "You have sent a friend request to this user",
        });
        return;
      }
      await friendApi.sendRequestFriend(searchResult._id);
      setHasSentRequest(true);
      AlertMessage({
        type: "success",
        message: "Send friend request successfully",
      });
    } catch (error) {
      console.error("Error sending friend request:", error);
      AlertMessage({ type: "error", message: error.response.data.message });
    }
  };

  return (
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
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="w-23 border-0 p-0 h-auto bg-transparent">
                  <SelectValue>
                    {searchType === "phone" ? (
                      <div className="flex items-center gap-1">
                        <img
                          src={VnFlag}
                          alt="Vietnam flag"
                          className="object-cover w-6 h-4 rounded"
                        />
                        <span className="text-sm font-medium text-regal-blue">
                          (+84)
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <img
                          src={Email}
                          alt="Email icon"
                          className="object-cover w-6 h-4 rounded"
                        />
                        <span className="text-sm font-medium text-regal-blue">
                          Email
                        </span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">
                    <div className="flex items-center gap-1">
                      <img
                        src={VnFlag}
                        alt="Vietnam flag"
                        className="object-cover w-6 h-4 rounded"
                      />
                      <span>(+84)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="email">
                    <div className="flex items-center gap-1">
                      <img
                        src={Email}
                        alt="Email icon"
                        className="object-cover w-6 h-4 rounded"
                      />
                      <span>Email</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              type="text"
              placeholder={
                searchType === "phone" ? "Phone number" : "Email address"
              }
              className="pl-24"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
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
          {searchResult && userLogin._id !== searchResult._id ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={searchResult.avatar}
                  alt={searchResult.name}
                  className="object-cover w-12 h-12 rounded-full cursor-pointer"
                  onClick={() => navigate("/other-people-information")}
                />
                <div className="text-left">
                  <h4
                    className="text-sm font-medium cursor-pointer"
                    onClick={() => navigate("/other-people-information")}
                  >
                    {searchResult.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {searchResult.username}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {!isFriend && (
                  <Button
                    size="icon"
                    className="bg-blue-600 rounded-full hover:bg-blue-700 disabled:opacity-50"
                    disabled={hasSentRequest || resMyFriendRequest.some((friend) => friend._id === searchResult._id)}
                    onClick={handleSendFriendRequest}
                  >
                    <UserPlus className="w-4 h-4" />
                  </Button>
                )}

                <Button
                  size="icon"
                  className="bg-blue-600 rounded-full hover:bg-blue-700"
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
  );
}
