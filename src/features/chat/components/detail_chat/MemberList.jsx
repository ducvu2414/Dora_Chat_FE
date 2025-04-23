/* eslint-disable react/prop-types */

import ArrowRight from "@assets/chat/arrow_right.svg";
import MemberItem from "./MemberItem";
import { useState, useEffect } from "react";
import { Spinner } from "@/page/Spinner";
import memberApi from "@/api/member";
import conversationApi from "@/api/conversation";

export default function MemberList({
  onBack,
  conversationId,
  managers,
  leader,
}) {
  const [membersState, setMembers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await memberApi.getMembers(conversationId);
        setMembers(response.data);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [conversationId]);

  const handleAddFriend = (member) => {
    alert(`Gửi lời mời kết bạn đến ${member.name}`);
  };

  const handleMessage = (member) => {
    alert(`Chuyển đến tin nhắn của ${member.name}`);
  };

  const handleRemove = async (member) => {
    try {
      const responseRemoveMember =
        await conversationApi.removeMemberFromConversation(
          conversationId,
          member._id
        );
      console.log(responseRemoveMember);
    } catch (error) {
      console.error("Error removing member:", error);
      alert("You cannot remove this member from the group chat");
    }
  };

  return loading || !membersState ? (
    <div className="flex justify-center my-8">
      <Spinner />
    </div>
  ) : (
    <div>
      <div className="flex items-center mb-4">
        <div
          onClick={onBack}
          className="flex items-center justify-center w-8 h-8 bg-white rounded-md cursor-pointer hover:opacity-75"
        >
          <img src={ArrowRight} className="rotate-180" />
        </div>
        <p className="text-lg font-bold text-[#086DC0] ml-2">
          Members ({membersState.length})
        </p>
      </div>
      <div className="mt-4 overflow-auto h-[calc(100vh-7rem)]">
        <MemberItem
          members={membersState}
          onAddFriend={handleAddFriend}
          onMessage={handleMessage}
          onRemove={handleRemove}
          managers={managers}
          leader={leader}
        />
      </div>
    </div>
  );
}
