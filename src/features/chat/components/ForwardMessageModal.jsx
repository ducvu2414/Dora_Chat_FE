/* eslint-disable react/prop-types */
import { Modal } from "@/components/ui/modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import UserSelectionModal from "./UserSelectionModal.jsx";
import { AlertMessage } from "@/components/ui/alert-message.jsx";
import conversationApi from "@/api/conversation";
import channelApi from "@/api/channel";
import friendApi from "@/api/friend";
import messageApi from "@/api/message";

export default function ForwardMessageModal({ message, onClose }) {
  const [isOpen, setIsOpen] = useState(true);
  const [friends, setFriends] = useState([]);
  const [groups, setGroup] = useState([]);
  const [channels, setChannels] = useState({});
  const [selectedTab, setSelectedTab] = useState("individuals");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const friendResponse = await friendApi.fetchFriends();
        setFriends(
          friendResponse.map((friend) => ({
            id: friend._id,
            name: friend.name,
            username: friend.username,
            avatar: friend.avatar,
            avatarColor: friend.avatarColor,
            type: "individual",
          }))
        );

        const groupResponse = await conversationApi.fetchConversations();
        setGroup(
          groupResponse
            .filter((conv) => conv.type === true)
            .map((group) => ({
              id: group._id,
              name: group.name,
              avatar: group.avatar,
              type: "group",
            }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        AlertMessage({
          message: error.response?.data?.message || "Failed to fetch data",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchChannelsForGroup = async (groupId) => {
    if (!channels[groupId]) {
      try {
        const channelResponse = await channelApi.getAllChannelByConversationId(
          groupId
        );
        setChannels((prev) => ({
          ...prev,
          [groupId]: channelResponse.map((channel) => ({
            id: channel._id,
            name: channel.name,
          })),
        }));
      } catch (error) {
        console.error("Error fetching channels:", error);
        AlertMessage({
          message: error.response?.data?.message || "Failed to fetch channels",
        });
      }
    }
  };

  const handleSubmit = async (selections) => {
    setIsSubmitting(true);
    try {
      for (const selection of selections) {
        if (selection.type === "individual" && selection.userId) {
          const conversation = await conversationApi.createConversation(
            selection.userId
          );
          const friend = friends.find((f) => f.id === selection.userId);
          if (!conversation || !friend) {
            throw new Error(
              `Failed to create conversation for user ${selection.userId}`
            );
          }
          console.log("Forwarding message to individual:", conversation);

          await messageApi.sendTextMessage({
            conversationId: conversation._id,
            content: message.content,
            type: message.type,
          });
        } else if (
          selection.type === "group" &&
          selection.groupId &&
          selection.channelId
        ) {
          await messageApi.sendMessage({
            conversationId: selection.groupId,
            channelId: selection.channelId,
            content: message.content,
            type: message.type,
          });
        }
      }
      setIsOpen(false);
      onClose();
    } catch (error) {
      console.error("Error forwarding message:", error);
      AlertMessage({
        message: error.response?.data?.message || "Failed to forward message",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
        onClose();
      }}
      title="Forward Message"
    >
      <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individuals">Individual Chats</TabsTrigger>
          <TabsTrigger value="groups">Group Chats</TabsTrigger>
        </TabsList>
        <TabsContent value="individuals">
          <UserSelectionModal
            buttonText={isSubmitting ? "Forwarding..." : "Forward"}
            onSubmit={handleSubmit}
            users={friends}
            message={message.content}
            type="forward_individual"
            disabled={isSubmitting}
            loading={loading}
          />
        </TabsContent>
        <TabsContent value="groups">
          <UserSelectionModal
            buttonText={isSubmitting ? "Forwarding..." : "Forward"}
            onSubmit={handleSubmit}
            users={groups}
            message={message.content}
            type="forward_group"
            channels={channels}
            onGroupSelect={fetchChannelsForGroup}
            disabled={isSubmitting}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
    </Modal>
  );
}
