import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { AlertMessage } from "@/components/ui/alert-message";
import friendApi from "@/api/friend";
import { Spinner } from "@/page/Spinner";
import conversationApi from "@/api/conversation";

// eslint-disable-next-line react/prop-types
export function AddGroupModal({ onClose, isOpen }) {
  const [groupName, setGroupName] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [friendsList, setFriendList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchFriendList() {
      try {
        setLoading(true);
        const response = await friendApi.fetchFriends();
        setFriendList(
          response.map((friend) => ({
            id: friend._id,
            name: friend.name,
            username: friend.username,
            avatar: friend.avatar,
            avatarColor: friend.avatarColor,
          }))
        );
      } catch (err) {
        console.error("Error fetching friends:", err);
        AlertMessage({
          type: "error",
          message: "Error fetching friends.",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchFriendList();
  }, []);

  const resetModalState = () => {
    setGroupName("");
    setSelectedFriends([]);
  };

  const handleFriendToggle = (friendId) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleCreateGroup = async () => {
    try {
      setLoading(true);
      await conversationApi.createGroupConversation(
        groupName,
        selectedFriends
      );
    } catch (err) {
      console.error("Error creating group:", err);
      AlertMessage({
        type: "error",
        message: "Error creating group.",
      });
    } finally {
      setLoading(false);
      resetModalState();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetModalState();
        onClose();
      }}
      title="Create chat group"
    >
      <div className="space-y-6">
        {/* Group Name Input */}
        <div>
          <label
            htmlFor="group-name"
            className="block text-sm font-medium text-gray-700 mb-1 text-left !font-bold"
          >
            Group Name:
          </label>
          <Input
            id="group-name"
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>

        {/* Friends List */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2 text-left !font-bold">
            Add friends to group:
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {loading ? (
              <>
                <div className="flex justify-center my-8">
                  <Spinner />
                </div>
              </>
            ) : (
              friendsList.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                  onClick={() => handleFriendToggle(friend.id)}
                >
                  <div className="flex items-center flex-1">
                    <img
                      src={friend.avatar || "/placeholder.svg"}
                      alt={friend.name}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <span className="text-sm font-medium">{friend.name}</span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedFriends.includes(friend.id)
                        ? "bg-blue-600 border-blue-600"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedFriends.includes(friend.id) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Create Group Button */}
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white focus:outline-none"
          onClick={handleCreateGroup}
          disabled={!groupName || selectedFriends.length < 2}
        >
          Create Group
        </Button>
      </div>
    </Modal>
  );
}
