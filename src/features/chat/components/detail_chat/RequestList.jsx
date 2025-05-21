/* eslint-disable react/prop-types */
import conversationApi from "@/api/conversation";
import { AlertMessage } from "@/components/ui/alert-message";
import { Spinner } from "@/page/Spinner";
import ArrowRight from "@assets/chat/arrow_right.svg";
import { useEffect, useState } from "react";
import RequestItem from "./RequestItem";

export default function RequestList({ onBack, conversationId }) {
  const [membersState, setMembers] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách yêu cầu tham gia
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await conversationApi.getJoinRequest(conversationId);
      setMembers(response);
    } catch (error) {
      console.error("Error fetching members:", error);
      AlertMessage({
        type: "error",
        message:
          error.response?.data?.message || "Không thể tải danh sách yêu cầu",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [conversationId]);

  // Chấp nhận yêu cầu tham gia của một người
  const handleAccept = async (member) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await conversationApi.acceptJoinRequest(
        conversationId,
        member._id
      );
      AlertMessage({
        type: "success",
        message: `Đã chấp nhận yêu cầu tham gia của ${member.name}`,
      });
      // Cập nhật danh sách yêu cầu
      // setMembers(membersState.filter((m) => m._id !== member._id));
    } catch (error) {
      console.error("Error accepting join request:", error);
      AlertMessage({
        type: "error",
        message: error.response?.data?.message || "Không thể chấp nhận yêu cầu",
      });
    }
  };

  // Từ chối yêu cầu tham gia của một người
  const handleReject = async (member) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await conversationApi.rejectJoinRequest(
        conversationId,
        member._id
      );
      AlertMessage({
        type: "success",
        message: `Đã từ chối yêu cầu tham gia của ${member.name}`,
      });
      // Cập nhật danh sách yêu cầu
      // setMembers(membersState.filter((m) => m._id !== member._id));
    } catch (error) {
      console.error("Error rejecting join request:", error);
      AlertMessage({
        type: "error",
        message: error.response?.data?.message || "Không thể từ chối yêu cầu",
      });
    }
  };

  // Chấp nhận tất cả yêu cầu
  const handleAcceptAll = async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await conversationApi.acceptAllJoinRequests(
        conversationId
      );
      AlertMessage({
        type: "success",
        message: "Đã chấp nhận tất cả yêu cầu tham gia",
      });
      // Xóa toàn bộ danh sách yêu cầu
      // setMembers([]);
    } catch (error) {
      console.error("Error accepting all join requests:", error);
      AlertMessage({
        type: "error",
        message:
          error.response?.data?.message || "Không thể chấp nhận tất cả yêu cầu",
      });
    }
  };

  // Từ chối tất cả yêu cầu
  const handleRejectAll = async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await conversationApi.rejectAllJoinRequests(
        conversationId
      );
      AlertMessage({
        type: "success",
        message: "Đã từ chối tất cả yêu cầu tham gia",
      });
      // Xóa toàn bộ danh sách yêu cầu
      // setMembers([]);
    } catch (error) {
      console.error("Error rejecting all join requests:", error);
      AlertMessage({
        type: "error",
        message:
          error.response?.data?.message || "Không thể từ chối tất cả yêu cầu",
      });
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
          <img src={ArrowRight} className="rotate-180" alt="Back" />
        </div>
        <p className="text-lg font-bold text-[#086DC0] ml-2">
          Yêu cầu tham gia ({membersState.length})
        </p>
      </div>
      {membersState.length > 0 && (
        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={handleAcceptAll}
            className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Chấp nhận tất cả
          </button>
          <button
            onClick={handleRejectAll}
            className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
          >
            Từ chối tất cả
          </button>
        </div>
      )}
      <div className="mt-4 overflow-auto h-[calc(100vh-7rem)]">
        <RequestItem
          members={membersState}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      </div>
    </div>
  );
}
