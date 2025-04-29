/* eslint-disable react/prop-types */
import conversationApi from "@/api/conversation";
import { Modal } from "@/components/ui/modal";
import friendApi from "@/api/friend";
import messageApi from "@/api/message";
import { useEffect, useState } from "react";
import UserSelectionModal from "./UserSelectionModal";
import { useDispatch } from "react-redux";
import { addConversation } from "../chatSlice";
export default function ForwardMessageModal({ message, onClose }) {
  const [isOpen, setIsOpen] = useState(true);
  const [friends, setFriends] = useState([]);
  const dispatch = useDispatch();
  console.log("Message in ForwardMessageModal:", message);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await friendApi.fetchFriends();
        console.log(response);
        setFriends(
          response.map((friend) => ({
            id: friend._id,
            name: friend.name,
            username: friend.username,
            avatar: friend.avatar,
            avatarColor: friend.avatarColor,
          }))
        );
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    fetchFriends();
  }, []);

  const handleSubmit = async (selectedUserIds) => {
    try {
      console.log("Selected user IDs:", selectedUserIds);
      for (const userId of selectedUserIds) {
        let conversation = await conversationApi.createConversation(userId);
        const friend = friends.find((f) => f.id === userId);
        dispatch(
          addConversation({
            ...conversation,
            name: friend ? friend.name : "Unknown",
            avatar: friend ? friend.avatar : null,
          })
        );
        // Gửi tin nhắn chuyển tiếp
        console.log("type", message);
        await messageApi.sendTextMessage({
          conversationId: conversation._id,
          content: message.content,
          type: message.type,
        });
      }
      setIsOpen(false);
      onClose();
    } catch (error) {
      console.error("Error forwarding message:", error);
      alert("Unable to forward message");
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Forward messages"
    >
      <UserSelectionModal
        buttonText="Forward"
        onSubmit={handleSubmit}
        users={friends}
        message={message.content}
      />
    </Modal>
  );
}
