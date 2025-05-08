import axios from "./axiosClient";

const voteApi = {
  createVote: (vote) => {
    return axios.post("/api/votes", vote);
  },

  lockVote: (voteId, memberId) => {
    return axios.put(`/api/votes/${voteId}`, { memberId });
  },

  addVoteOption: (voteId, memberId, option) => {
    return axios.post(`/api/votes/option/${voteId}`, {
      memberId,
      option: {
        name: option,
      },
    });
  },

  deleteVoteOption: (voteId, memberId, optionId) => {
    return axios.delete(`/api/votes/option/${voteId}/${optionId}`, {
      data: { memberId },
    });
  },

  selectVoteOption: (voteId, optionId, memberInfo) => {
    return axios.post(
      `/api/votes/option/select/${voteId}/${optionId}`,
      memberInfo
    );
  },

  deselectVoteOption: (voteId, optionId, memberId) => {
    console.log("deselectVoteOption", voteId, optionId, memberId);
    return axios.delete(`/api/votes/option/deselect/${voteId}/${optionId}`, {
      data: { memberId },
    });
  },
};

export default voteApi;
