import axios from "./axiosClient";

const conversationApi = {
  fetchConversations: () => {
    return axios.get("/api/conversations");
  },
  createConversation: (userIds) => {
    return axios.post(`/api/conversations/individuals/${userIds}`);
  },
  addMembersToConversation: (conversationId, members) => {
    return axios.post(`/api/conversations/${conversationId}/members`, {
      userIds: members,
    });
  },
  deleteConversationBeforetime: (conversationId) => {
    return axios.delete(`/api/conversations/${conversationId}`);
  },
  removeMemberFromConversation: (conversationId, memberId) => {
    return axios.delete(
      `/api/conversations/${conversationId}/members/${memberId}`
    );
  },
  getConversationById: (conversationId) => {
    return axios.get(`/api/conversations/${conversationId}`);
  },
  createGroupConversation: (name, members) => {
    return axios.post("/api/conversations/groups", {
      name,
      members,
    });
  },
  updateGroupName: (conversationId, name) => {
    return axios.patch(`/api/conversations/${conversationId}/name`, { name });
  },
  transferAdmin: (leaderId, newLeaderId) => {
    return axios.patch(`/api/conversations/transfer-admin/${leaderId}`, {
      newAdminId: newLeaderId,
    });
  },
  leaveConversation: (conversationId) => {
    return axios.delete(`/api/conversations/members/leave/${conversationId}`);
  },
  disbandGroup: (conversationId) => {
    return axios.delete(`/api/conversations/disband/${conversationId}`);
  },
  addManagersToConversation: (conversationId, members) => {
    return axios.post(`/api/conversations/${conversationId}/managers`, {
      memberIds: members,
    });
  },
  demoteManager: (conversationId, memberId) => {
    return axios.delete(`/api/conversations/${conversationId}/managers`, {
      data: {
        managerId: memberId,
      },
    });
  },
  //   markAsRead: (conversationId) => {
  //     return axios.put(`/api/messages/${conversationId}/mark-as-read`);
  //   },
  updateAvatarGroup: (conversationId, avatar) => {
    return axios.patch(`api/conversations/${conversationId}/avatar`, {
      avatar,
    });
  },
  createInviteLink: (conversationId) => {
    return axios.post(`/api/conversations/${conversationId}/invite/link`);
  },
  getInfoInviteLink: (token) => {
    return axios.get(`/api/conversations/invite/${token}`);
  },
  acceptInvite: (token) => {
    return axios.post(`/api/conversations/join/${token}`);
  },
  toggleJoinApproval: (conversationId, isStatus) => {
    return axios.patch(
      `/api/conversations/${conversationId}/acceptGroupRequest/${isStatus}`
    );
  },
  getJoinRequest: (conversationId) => {
    return axios.get(`/api/conversations/${conversationId}/groupRequest`);
  }, // Chấp nhận yêu cầu tham gia của một người
  acceptJoinRequest: (conversationId, userId) => {
    return axios.post(
      `/api/conversations/${conversationId}/groupRequest/accept/${userId}`
    );
  },

  // Từ chối yêu cầu tham gia của một người
  rejectJoinRequest: (conversationId, userId) => {
    return axios.delete(
      `/api/conversations/${conversationId}/groupRequest/reject/${userId}`
    );
  },

  // Chấp nhận tất cả yêu cầu tham gia
  acceptAllJoinRequests: (conversationId) => {
    return axios.post(
      `/api/conversations/${conversationId}/groupRequest/accept`
    );
  },

  // Từ chối tất cả yêu cầu tham gia
  rejectAllJoinRequests: (conversationId) => {
    return axios.delete(
      `/api/conversations/${conversationId}/groupRequest/reject`
    );
  },
};

export default conversationApi;
