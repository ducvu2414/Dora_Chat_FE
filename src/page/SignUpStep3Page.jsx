import { useState } from "react";
import Logo from "@/assets/dorachat_logo.png";
import SignUpBanner from "@/assets/signup.png";
import { ProgressSteps } from "../components/ui/SignUp/ProgressSteps";
import { AlertMessage } from '../components/ui/AlertMessage';
import { useNavigate } from "react-router-dom";
import { SignUpStep3Form } from "../components/ui/SignUp/SignUpStep3Form";
import { Spinner } from "./Spinner";

export default function SignUpStep3Page() {
    const navigate = useNavigate();
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(false);

    const handleSignUpStep3 = async (formData) => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            console.log("Form Data:", formData);
            setAlert({ type: "success", message: "Information saved successfully!" });
            setTimeout(() => {
                navigate('/signup/complete');
            }, 2000);
        } catch (error) {
            console.error("API call failed:", error);
            setAlert({ type: "error", message: "Something went wrong. Please try again." });
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
                        {/* Alert Message */}
                        <AlertMessage type={alert.type} message={alert.message} />


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

                        <ProgressSteps currentStep={3} />

                        {/* Show spinner if loading */}
                        {loading ? (
                            <Spinner />
                        ) : (
                            <SignUpStep3Form onSubmit={handleSignUpStep3} />
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
        </div>
    );
}