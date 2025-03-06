import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "@/assets/dorachat_logo.png";
import SignUpBanner from "@/assets/signup.png";
import { ProgressSteps } from "@/components/ui/SignUp/ProgressSteps";
import { AlertMessage } from '@/components/ui/alert-message';
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
        if (dateTempt.toDateString() === 'Invalid Date') return false;

        const fullyear = dateTempt.getFullYear();
        dateTempt.setFullYear(fullyear + 10);

        if (dateTempt > new Date()) return false;

        return true;
    };

    const handleSignUpStep2 = async (formData) => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            delete formData.retypepassword;

            const dateParts = formData.dateOfBirth.split('-');
            const dateObj = {
                year: parseInt(dateParts[0]),
                month: parseInt(dateParts[1]),
                day: parseInt(dateParts[2])
            };

            if (!validateDateOfBirth(dateObj)) {
                AlertMessage({
                    type: "error",
                    message: "Invalid date of birth. You must be at least 10 years old."
                });
                setLoading(false);
                return;
            }

            // Format date to dd/MM/yyyy
            const dateOfBirth = new Date(formData.dateOfBirth);
            const formattedDate = `${dateOfBirth.getFullYear()}-${String(dateOfBirth.getMonth() + 1).padStart(2, '0')}-${String(dateOfBirth.getDate()).padStart(2, '0')}`;

            const submitData = {
                ...formData,
                dateOfBirth: formattedDate,
                contact: email
            }

            console.log(submitData);
            const response = await authApi.submitInformation(submitData);

            if (!response || response.error) {
                AlertMessage({ type: "error", message: response.data.message });
                return;
            } else {
                AlertMessage({ type: "success", message: "Information saved successfully!" });
                navigate('/signup/otp', {
                    state: {
                        email,
                    }
                });
            }
        } catch (error) {
            console.log("Response data:", error.response.data);

            console.error(
                "API call failed:",
                error.response?.data?.message || error.message || "Unknown error"
            );
            AlertMessage({ type: "error", message: error.response.data });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='max-w-screen-2xl h-full w-full flex justify-center items-center bg-[#D8EDFF] h-screen'>
            <div className="w-full h-full flex flex-col md:flex-row">
                {/* Left side - Form */}
                <div className="w-[150%] h-full p-4 md:p-8 lg:p-12 relative justify-center bg-white flex flex-col items-center">
                    <div className="max-w-md mx-auto space-y-10">

                        {/* Login link */}
                        <div className="text-sm">
                            You had an account?
                            <a href="/login" className="text-blue-600 ml-1 hover:underline">
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
                        <div className="text-center space-y-4">
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
                <div className="w-full max-h-full rounded-2xl hidden md:flex justify-center items-center">
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