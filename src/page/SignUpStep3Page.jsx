import { useState } from "react";
import Logo from "@/assets/dorachat_logo.png";
import SignUpBanner from "@/assets/signup.png";
import { ProgressSteps } from "@/components/ui/SignUp/ProgressSteps";
import { SignUpOTPForm } from "@/components/ui/SignUp/SignUpOTPForm";
import { AlertMessage } from "@/components/ui/alert-message";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "@/page/Spinner";

import authApi from "@/api/auth";

export default function SignUpStep3Page() {
  const [otpCode, setOtpCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [loading, setLoading] = useState(false);

  const Max_Length = 6;

  async function handleSignUpStep3(e) {
    e.preventDefault();
    if (otpCode.length !== Max_Length) {
      AlertMessage({ type: "error", message: "Please enter a valid OTP code" });
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.verifyOTP({
        contact: email,
        otp: otpCode,
      });
      if (!response || response.error) {
        AlertMessage({
          type: "error",
          message:
            response?.data?.message || "Verification failed. Please try again.",
        });
        return;
      }
      AlertMessage({ type: "success", message: "OTP verified successfully!" });
      navigate("/signup/complete");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : "Verification failed. Please try again.");
      AlertMessage({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }

  const handleResendOTP = async () => {
    try {
      const contact = email;
      const response = await authApi.resendOTP({ contact });

      if (!response || response.error) {
        AlertMessage({
          type: "error",
          message: response?.data?.message || "Failed to resend OTP",
        });
        return false;
      }

      AlertMessage({
        type: "success",
        message: "OTP code resent successfully!",
      });
      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to resend OTP. Please try again.";
      AlertMessage({ type: "error", message: errorMessage });
      return false;
    }
  };

  return (
    <div className="max-w-screen-2xl h-full w-full flex justify-center items-center bg-[#D8EDFF] h-screen">
      <div className="flex flex-col w-full h-full md:flex-row">
        {/* Left side - Form */}
        <div className="w-[150%] h-full p-4 md:p-8 lg:p-12 relative justify-center bg-white flex flex-col items-center">
          <div className="max-w-md mx-auto space-y-10">
            {/* Login link */}
            <div className="text-sm">
              You had an account?
              <a href="/login" className="ml-1 text-blue-600 hover:underline">
                Login
              </a>
            </div>

            {/* Logo */}
            <div className="flex justify-center">
              <img
                src={Logo}
                alt="Dora Logo"
                className="object-contain w-[350px] h-[65px]"
              />
            </div>

            {/* Welcome text */}
            <div className="space-y-4 text-center">
              <p className="text-gray-600">
                We&apos;re super excited to have you join our community.
              </p>
              <p className="text-gray-600">
                Let&apos;s dive into some fun conversations together!
              </p>
            </div>

            <ProgressSteps currentStep={3} />

            {/* Show spinner if loading */}
            {loading ? (
              <Spinner />
            ) : (
              <SignUpOTPForm
                otpCode={otpCode}
                setOtpCode={setOtpCode}
                onSubmit={handleSignUpStep3}
                onResendOTP={handleResendOTP}
              />
            )}
          </div>
        </div>

        {/* Right side - Pattern */}
        <div className="items-center justify-center hidden w-full max-h-full rounded-2xl md:flex">
          <img
            src={SignUpBanner}
            alt="Sign Up Banner"
            className="object-cover w-[100%] max-h-[100%] rounded-2xl"
          />
        </div>
      </div>
      <AlertMessage />
    </div>
  );
}
