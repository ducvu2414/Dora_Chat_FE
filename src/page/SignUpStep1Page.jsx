import Logo from "@/assets/dorachat_logo.png";
import SignUpBanner from "@/assets/signup.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressSteps } from "@/components/ui/SignUp/ProgressSteps";
import { SignUpStep1Form } from "@/components/ui/SignUp/SignUpStep1Form";
import { AlertMessage } from "@/components/ui/alert-message";
import { Spinner } from "@/page/Spinner";

import authApi from "@/api/auth";

export default function SignUpStep1Page() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const validateEmail = (email) => {
    console.log("Validating email:", email);
    if (!email || !email.trim()) {
      return { valid: false, message: "Please enter your email address" };
    }

    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailRegex.test(email.trim().toLowerCase())) {
      return { valid: false, message: "Please enter a valid email address" };
    }

    return { valid: true, email: email.trim() };
  };


  async function handleSignUpStep1(e) {
    e.preventDefault();
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      AlertMessage({
        type: "error",
        message: emailValidation.message,
      });
      setLoading(false);
      return;
    }

    const trimmedEmail = emailValidation.email;

    try {
      const response = await authApi.registerContact(trimmedEmail);
      if (!response || response.error) {
        AlertMessage({
          type: "error",
          message: "Something fetch went wrong. Please try again.",
        });
        setLoading(false);
        return;
      } else {
        AlertMessage({
          type: "success",
          message: "Verification code sent to your email!",
        });
        navigate("/signup/info", { state: { email: trimmedEmail } });
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
  }

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
              <div className="flex justify-center">
                <img
                  src={Logo}
                  alt="Dora Logo"
                  className="object-contain w-[350px] h-[65px]"
                />
              </div>
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

            <ProgressSteps currentStep={1} />

            {/* Show spinner if loading */}
            {loading ? (
              <Spinner />
            ) : (
              <SignUpStep1Form
                email={email}
                setEmail={setEmail}
                onSubmit={handleSignUpStep1}
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
