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

  const validateOTP = (otp) => {
    const otpRegex = /^[0-9]{6}$/;
    if (!otpRegex.test(otp)) {
      return { valid: false, message: "Invalid OTP. Please enter a 6-digit number." };
    }
    return { valid: true };
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

  const validateResetFields = (otp, newPassword, retypePassword, email) => {
    if (!otp || !newPassword || !email || !retypePassword) {
      return { valid: false, message: "Please fill in all required fields." };
    }

    if (newPassword !== retypePassword) {
      return { valid: false, message: "Passwords do not match." };
    }

    return { valid: true };
  };

  const handleResetStep2 = async (formData) => {
    setLoading(true);

    const otp = formData.otp?.trim();
    const newPassword = formData.password?.trim();
    const retypePassword = formData.retypePassword?.trim();
    const trimmedEmail = email?.trim();

    const fieldValidation = validateResetFields(otp, newPassword, retypePassword, trimmedEmail);
    if (!fieldValidation.valid) {
      AlertMessage({ type: "error", message: fieldValidation.message });
      setLoading(false);
      return;
    }

    // Validate OTP
    const otpValidation = validateOTP(otp);
    if (!otpValidation.valid) {
      AlertMessage({ type: "error", message: otpValidation.message });
      setLoading(false);
      return;
    }

    // Validate Password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      AlertMessage({ type: "error", message: passwordValidation.message });
      setLoading(false);
      return;
    }

    // Validate Email
    const emailValidation = validateEmail(trimmedEmail);
    if (!emailValidation.valid) {
      AlertMessage({ type: "error", message: emailValidation.message });
      setLoading(false);
      return;
    }

    try {
      delete formData.retypePassword;

      const submitData = {
        otp,
        newPassword,
        email: trimmedEmail,
      };

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
