import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import authApi from "@/api/auth";
import { LoginBanner } from "@/components/ui/Login/LoginBanner";
import { LoginForm } from "@/components/ui/Login/LoginForm";
import { LoginHeader } from "@/components/ui/Login/LoginHeader";
import { SignUpLink } from "@/components/ui/Login/SignUpLink";
import { AlertMessage } from "@/components/ui/alert-message";
import { Spinner } from "@/page/Spinner";
import { QRLoginBox } from "@/components/ui/Login/QRLoginBox";
import { setCredentials } from "@/features/auth/authSlice";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const handleLogin = async ({ username, password }) => {
    if (!username || !password) {
      AlertMessage({ type: "error", message: "Vui lòng điền đầy đủ thông tin" });
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.login({ username, password });

      if (!response || response.error) {
        AlertMessage({
          type: "error",
          message:
            response?.data?.message ||
            "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
        });
        return;
      }

      const { token, refreshToken, user } = response.data;

      // Dispatch to Redux
      dispatch(setCredentials({ user, token, refreshToken }));

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      AlertMessage({ type: "success", message: "Đăng nhập thành công!" });
      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error);
      AlertMessage({
        type: "error",
        message: "Đăng nhập thất bại. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen max-w-screen-2xl">
      <div className="flex flex-col items-center justify-center h-full md:flex-row">
        {/* Bên trái: banner */}
        <LoginBanner />

        {/* Bên phải: form đăng nhập */}
        <div className="w-full md:w-[400px] p-6 flex flex-col justify-center">
          <SignUpLink />
          <LoginHeader />

          {loading ? (
            <div className="flex justify-center my-8">
              <Spinner />
            </div>
          ) : (
            <>
              <LoginForm onSubmit={handleLogin} loading={loading} />

              {/* QR Login */}
              <QRLoginBox />
            </>
          )}
        </div>
      </div>

      <AlertMessage />
    </div>
  );
}
