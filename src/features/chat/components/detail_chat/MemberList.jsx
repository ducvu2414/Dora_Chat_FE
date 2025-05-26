/* eslint-disable react/prop-types */

import ArrowRight from "@assets/chat/arrow_right.svg";
import MemberItem from "./MemberItem";
import conversationApi from "@/api/conversation";
import { AlertMessage } from "@/components/ui/alert-message";

export default function MemberList({
  onBack,
  conversationId,
  managers,
  leader,
  members,
}) {
  const membersActive = members.filter((member) => member.active !== false);

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
      AlertMessage({
        type: "error",
        message: error.response?.data?.message || "Cannot remove member",
      });
    }
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <div
          onClick={onBack}
          className="flex items-center justify-center w-8 h-8 bg-white rounded-md cursor-pointer hover:opacity-75"
        >
          <img src={ArrowRight} className="rotate-180" />
        </div>
        <p className="text-lg font-bold text-[#086DC0] ml-2">
          Members ({membersActive.length})
        </p>
      </div>
      <div className="mt-4 overflow-auto h-[calc(100vh-7rem)]">
        <MemberItem
          members={membersActive}
          onRemove={handleRemove}
          managers={managers}
          leader={leader}
        />
      </div>
    </div>
  );
}
