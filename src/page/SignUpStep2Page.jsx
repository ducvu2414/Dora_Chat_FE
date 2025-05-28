import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "@/assets/dorachat_logo.png";
import SignUpBanner from "@/assets/signup.png";
import { ProgressSteps } from "@/components/ui/SignUp/ProgressSteps";
import { AlertMessage } from "@/components/ui/alert-message";
import { SignUpStep2Form } from "@/components/ui/SignUp/SignUpStep2Form";
import { Spinner } from "@/page/Spinner";

import authApi from "@/api/auth";

export default function SignUpStep2Page() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [loading, setLoading] = useState(false);

  const validateDateOfBirth = (date) => {
    if (!date) return false;

    const { day, month, year } = date;

    if (!day || !month || !year) return false;

    if (year < 1900) return false;

    const dateTempt = new Date(`${year}-${month}-${day}`);
    if (dateTempt.toDateString() === "Invalid Date") return false;

    const fullyear = dateTempt.getFullYear();
    dateTempt.setFullYear(fullyear + 10);

    if (dateTempt > new Date()) return false;

    return true;
  };

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
    if (!password || !password.trim()) {
      return { valid: false, message: "Please enter your password" };
    }

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

  const validateName = (name) => {
    if (!name || !name.trim() || name.length > 50) {
      return { valid: false, message: "Please enter a valid name (max 50 characters)." };
    }

    const nameRegex = /^[a-zA-ZÀ-ỹ\s'-]+$/;
    if (!nameRegex.test(name.trim())) {
      return { valid: false, message: "Name contains invalid characters." };
    }

    return { valid: true };
  };

  const validateRetypePassword = (password, retypePassword) => {
    if (password !== retypePassword) {
      return { valid: false, message: "Passwords do not match." };
    }
    return { valid: true };
  };

  const validateFormData = (formData) => {
    const { firstName, lastName, password, retypePassword, gender, dateOfBirth } = formData;

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) return emailValidation;

    const firstNameValidation = validateName(firstName);
    if (!firstNameValidation.valid) return firstNameValidation;

    const lastNameValidation = validateName(lastName);
    if (!lastNameValidation.valid) return lastNameValidation;

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) return passwordValidation;

    const retypeValidation = validateRetypePassword(password, retypePassword);
    if (!retypeValidation.valid) return retypeValidation;

    if (!gender) {
      return { valid: false, message: "Please select your gender." };
    }

    const dateParts = dateOfBirth.split("-");
    const dateObj = {
      year: parseInt(dateParts[0]),
      month: parseInt(dateParts[1]),
      day: parseInt(dateParts[2]),
    };

    if (!validateDateOfBirth(dateObj)) {
      return { valid: false, message: "Invalid date of birth. You must be at least 10 years old." };
    }

    return { valid: true, formattedDate: `${dateParts[0]}-${dateParts[1].padStart(2, "0")}-${dateParts[2].padStart(2, "0")}` };
  };


  const handleSignUpStep2 = async (formData) => {
    setLoading(true);

    const validation = validateFormData(formData);
    if (!validation.valid) {
      AlertMessage({ type: "error", message: validation.message });
      setLoading(false);
      return;
    }

    try {
      // delete formData.retypePassword;

      // const dateParts = formData.dateOfBirth.split("-");
      // const dateObj = {
      //   year: parseInt(dateParts[0]),
      //   month: parseInt(dateParts[1]),
      //   day: parseInt(dateParts[2]),
      // };

      // if (!validateDateOfBirth(dateObj)) {
      //   AlertMessage({
      //     type: "error",
      //     message: "Invalid date of birth. You must be at least 10 years old.",
      //   });
      //   setLoading(false);
      //   return;
      // }

      // Format date to dd/MM/yyyy
      // const dateOfBirth = new Date(formData.dateOfBirth);
      // const formattedDate = `${dateOfBirth.getFullYear()}-${String(
      //   dateOfBirth.getMonth() + 1
      // ).padStart(2, "0")}-${String(dateOfBirth.getDate()).padStart(2, "0")}`;

      const { retypePassword, ...submitData } = formData;
      submitData.dateOfBirth = validation.formattedDate;
      submitData.contact = email;

      const response = await authApi.submitInformation(submitData);

      if (!response || response.error) {
        AlertMessage({ type: "error", message: response.data.message });
        return;
      } else {
        AlertMessage({
          type: "success",
          message: "Information saved successfully!",
        });
        navigate("/signup/otp", {
          state: {
            email,
          },
        });
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
              <SignUpStep2Form onSubmit={handleSignUpStep2} />
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
