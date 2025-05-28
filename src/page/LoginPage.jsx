import { useState } from "react";
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


  const validateEmail = (email) => {
    if (!email || !email.trim()) {
      return { valid: false, message: "Please enter your email address in step 1" };
    }

    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailRegex.test(email.trim().toLowerCase())) {
      return { valid: false, message: "Please enter a valid email address" };
    }

    return { valid: true, email: email.trim() };
  };


  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return {
        valid: false,
        message:
          "Password must have at least 8 characters, including uppercase, lowercase, number and special character.",
      };
    }

    if (password.length > 50) {
      return { valid: false, message: "Password cannot exceed 50 characters." };
    }

    return { valid: true };
  };

  const handleLogin = async ({ username, password }) => {
    if (!username || !password) {
      AlertMessage({ type: "error", message: "Please fill in all information" });
      return;
    }

    // Kiểm tra email
    const emailValidation = validateEmail(username);
    if (!emailValidation.valid) {
      AlertMessage({ type: "error", message: emailValidation.message });
      return;
    }

    // Kiểm tra password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      AlertMessage({ type: "error", message: passwordValidation.message });
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
            "Login failed. Please check your information again.",
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

      AlertMessage({ type: "success", message: "Log in successfully!" });
      navigate("/home");
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        const message = data?.message || "Login failed. Please check your information again.";

        if (status === 400 && message.includes("chưa được kích hoạt")) {
          navigate("/signup/otp", { state: { email: username } });
          AlertMessage({
            type: "warning",
            message: "Your account is not activated. Please enter the OTP code sent to your email.",
          });
        } else {
          AlertMessage({ type: "error", message });
        }
      } else {
        AlertMessage({
          type: "error",
          message: "Login failed. Please try again.",
        });
      }
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
