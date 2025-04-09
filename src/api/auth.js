import axios from "./axiosClient";

const authApi = {
  registerContact: (contact) => {
    const url = "/api/auth/contact";
    return axios.post(url, { contact });
  },
  submitInformation: (submitInformation) => {
    const url = "/api/auth/register";
    return axios.post(url, submitInformation);
  },
  verifyOTP: (params) => {
    const url = "api/auth/verify-otp";
    return axios.post(url, params);
  },
  resendOTP: (params) => {
    const url = "api/auth/resend-otp";
    return axios.post(url, params);
  },
  login: (params) => {
    const url = "api/auth/login";
    return axios.post(url, params);
  },
  refreshToken: (params) => {
    const url = "api/auth/refresh-token";
    return axios.post(url, params);
  },
  logout: (params) => {
    const url = "api/auth/logout";
    return axios.post(url, params);
  },
  verifyEmailResetPassword: (email) => {
    const url = "api/auth/verify-email-forgot-password";
    return axios.post(url, { email });
  },
  resetPassword: (params) => {
    const url = "api/auth/forgot-password";
    return axios.post(url, params);
  },

  createQRSession: () => {
    return axios.get("/api/auth/qr", {
      headers: {
        'User-Agent': navigator.userAgent,
      },
    });
  },
  checkQRStatus: (sessionId) => {
    return axios.get(`/api/auth/qr/status/${sessionId}`);
  },
};

export default authApi;
