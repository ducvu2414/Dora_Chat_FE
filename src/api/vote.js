import axios from "./axiosClient";

const voteApi = {
  createVote: (vote) => {
    return axios.post("/api/votes", vote);
  },

  selectVoteOption: (voteId, optionId, memberInfo) => {
    return axios.post(`/api/votes/option/select/${voteId}/${optionId}`, memberInfo);
  },
};

export default voteApi;
