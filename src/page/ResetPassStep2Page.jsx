import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "@/assets/dorachat_logo.png";
import SignUpBanner from "@/assets/signup.png";
import { ProgressSteps } from "@/components/ui/ResetPass/ProgressSteps";
import { AlertMessage } from "@/components/ui/alert-message";
import { Spinner } from "@/page/Spinner";
import { ResetPassStep2Form } from "@/components/ui/ResetPass/ResetPassStep2Form";

import authApi from "@/api/auth";

export default function ResetPassStep2Page() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [loading, setLoading] = useState(false);

  const handleResetStep2 = async (formData) => {
    setLoading(true);
    try {
      delete formData.retypepassword;

      const submitData = {
        otp: formData.otp,
        newPassword: formData.password,
        email: email,
      };

      console.log(submitData);
      const response = await authApi.resetPassword(submitData);

      if (!response || response.error) {
        AlertMessage({ type: "error", message: response.data.message });
        return;
      } else {
        AlertMessage({
          type: "success",
          message: "Information saved successfully!",
        });
        navigate("/login");
      }
    } catch (error) {
      console.log("Response data:", error.response);

      const errorMessage =
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : "Please try again.");

      AlertMessage({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
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

            <ProgressSteps currentStep={2} />
            {/* Show spinner if loading */}
            {loading ? (
              <Spinner />
            ) : (
              <ResetPassStep2Form onSubmit={handleResetStep2} />
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
