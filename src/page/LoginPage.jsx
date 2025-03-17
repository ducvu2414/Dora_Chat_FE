import authApi from "@/api/auth";
import { LoginBanner } from "@/components/ui/Login/LoginBanner";
import { LoginForm } from "@/components/ui/Login/LoginForm";
import { LoginHeader } from "@/components/ui/Login/LoginHeader";
import { SignUpLink } from "@/components/ui/Login/SignUpLink";
import { AlertMessage } from "@/components/ui/alert-message";
import { setCredentials } from "@/features/auth/authSlice";
import { Spinner } from "@/page/Spinner";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleLogin = async ({ username, password }) => {
    if (!username || !password) {
      AlertMessage({ type: "error", message: "Please fill in all fields" });
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
            "Login failed. Please check your credentials and try again.",
        });
        return;
      } else {
        const { token, refreshToken, user } = response.data;
        console.log("Login response:", response.data);
        // Dispatch user data to Redux store
        dispatch(setCredentials({ user, token, refreshToken }));

        // Store tokens and user data in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        AlertMessage({ type: "success", message: "Login successful!" });
        navigate("/home");
      }
    } catch (error) {
      console.error("Login failed:", error);
      AlertMessage({
        type: "error",
        message: "Login failed. Please check your credentials and try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  // const handleGoogleLogin = async () => {
  //     setLoading(true);
  //     try {
  //         // Replace with actual Google OAuth logic
  //         await new Promise((resolve) => setTimeout(resolve, 2000));
  //         AlertMessage({ type: "success", message: "Google login successful!" });
  //         navigate('/home');
  //     } catch (error) {
  //         console.error("Google login failed:", error);
  //         AlertMessage({
  //             type: "error",
  //             message: "Google login failed. Please try again."
  //         });
  //     } finally {
  //         setLoading(false);
  //     }
  // };
  return (
    <div className="w-full min-h-screen max-w-screen-2xl">
      <div className="flex flex-col items-center justify-center h-full md:flex-row">
        <LoginBanner />
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
              {/* <div className="relative flex items-center justify-center mt-4">
                                <div className="w-full border-t border-gray-300"></div>
                                <div className="absolute px-4 text-sm text-gray-500 bg-white">
                                    Or
                                </div>
                            </div>
                            <GoogleLoginButton
                                onClick={handleGoogleLogin}
                                loading={loading}
                            /> */}
            </>
          )}
        </div>
      </div>
      <AlertMessage />
    </div>
  );
}
