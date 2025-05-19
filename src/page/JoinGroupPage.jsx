import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const JoinGroupPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user"))?._id;
  const [groupInfo, setGroupInfo] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        const res = await axios.get(`/api/conversations/invite/${token}`);
        setGroupInfo(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load group info");
      }
    };
    fetchGroupInfo();
  }, [token]);

  const handleJoin = async () => {
    if (!userId) {
      navigate("/login", { state: { from: `/join/${token}` } });
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`/api/invites/accept`, {
        token,
        userId: userId,
      });
      setStatus(res.data.status);
      if (res.data.status === "joined") {
        navigate(`/chat/${res.data.conversationId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join group");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!groupInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">Tham gia nhóm</h2>
        <p className="mb-2 text-lg">Tên nhóm: {groupInfo.name}</p>
        <p className="mb-4 text-gray-600">
          {groupInfo.isJoinFromLink
            ? "Nhấn tham gia để vào nhóm ngay!"
            : "Yêu cầu tham gia sẽ được gửi đến quản trị viên."}
        </p>
        {status === "pending_approval" ? (
          <p className="text-green-500">
            Yêu cầu tham gia đã được gửi. Vui lòng chờ duyệt.
          </p>
        ) : status === "joined" ? (
          <p className="text-green-500">Bạn đã tham gia nhóm thành công!</p>
        ) : (
          <button
            onClick={handleJoin}
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded ${
              isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {isLoading ? "Đang xử lý..." : "Tham gia"}
          </button>
        )}
      </div>
    </div>
  );
};

export default JoinGroupPage;
