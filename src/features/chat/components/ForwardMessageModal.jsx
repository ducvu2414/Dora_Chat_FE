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
    const results = [];
    const errors = [];

    try {
      // Xử lý từng selection song song để tăng hiệu suất
      const promises = selections.map(async (selection) => {
        try {
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

            results.push({
              type: "individual",
              name: friend.name,
              success: true,
            });
          } else if (
            selection.type === "group" &&
            selection.groupId &&
            selection.channelId
          ) {
            const group = groups.find((g) => g.id === selection.groupId);
            const channel = channels[selection.groupId]?.find(
              (c) => c.id === selection.channelId
            );

            await messageApi.sendTextMessage({
              conversationId: selection.groupId,
              channelId: selection.channelId,
              content: message.content,
              type: message.type,
            });

            results.push({
              type: "group",
              name: `${group?.name || "Unknown Group"} > ${
                channel?.name || "Unknown Channel"
              }`,
              success: true,
            });
          }
        } catch (error) {
          console.error(
            `Error forwarding to selection ${selection.id}:`,
            error
          );
          const targetName =
            selection.type === "individual"
              ? friends.find((f) => f.id === selection.userId)?.name ||
                "Unknown User"
              : groups.find((g) => g.id === selection.groupId)?.name ||
                "Unknown Group";

          errors.push({
            name: targetName,
            error: error.response?.data?.message || error.message,
          });
        }
      });

      await Promise.all(promises);

      // Hiển thị kết quả
      if (results.length > 0 && errors.length === 0) {
        AlertMessage({
          message: `Successfully forwarded message to ${results.length} ${
            results.length === 1 ? "recipient" : "recipients"
          }`,
          type: "success",
        });
      } else if (results.length > 0 && errors.length > 0) {
        AlertMessage({
          message: `Partially successful: ${results.length} succeeded, ${errors.length} failed. Check console for details.`,
          type: "warning",
        });
      } else {
        throw new Error("All forwarding attempts failed");
      }

      setIsOpen(false);
      onClose();
    } catch (error) {
      console.error("Error forwarding messages:", error);
      AlertMessage({
        message:
          errors.length > 0
            ? `Failed to forward to: ${errors.map((e) => e.name).join(", ")}`
            : error.response?.data?.message || "Failed to forward message",
        type: "error",
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
