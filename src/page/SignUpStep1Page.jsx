import Logo from "@/assets/dorachat_logo.png";
import SignUpBanner from "@/assets/signup.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressSteps } from "../components/ui/SignUp/ProgressSteps";
import { SignUpStep1Form } from "../components/ui/SignUp/SignUpStep1Form";
import { AlertMessage } from '../components/ui/alert-message';
export default function SignUpStep1Page() {
    const [email, setEmail] = useState("");
    const [alert, setAlert] = useState({ type: "", message: "" });

    const navigate = useNavigate();

    function handleSignUpStep1(e) {
        e.preventDefault();

        if (!email) {
            setAlert({ type: "error", message: "Please enter your email address" });
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setAlert({ type: "error", message: "Please enter a valid email address" });
            return;
        }

        try {
            // API call would go here
            setAlert({ type: "success", message: "Verification code sent to your email!" });
            setTimeout(() => {
                navigate('/signup/otp');
            }, 2000);
        } catch {
            setAlert({ type: "error", message: "Something went wrong. Please try again." });
        }
    }

    return (
        <div className='max-w-screen-2xl h-full w-full flex justify-center items-center bg-[#D8EDFF] h-screen'>
            <div className="w-full h-full flex flex-col md:flex-row">
                {/* Left side - Form */}
                <div className="w-[150%] h-full p-4 md:p-8 lg:p-12 relative justify-center bg-white flex flex-col items-center">
                    <div className="max-w-md mx-auto space-y-10">
                        {/* Alert Message */}
                        {alert.message && (
                            <AlertMessage type={alert.type} message={alert.message} />
                        )}

                        {/* Login link */}
                        <div className="text-sm">
                            You had an account?
                            <a href="/login" className="text-blue-600 ml-1 hover:underline">
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
                        <div className="text-center space-y-4">
                            <p className="text-gray-600">
                                We&apos;re super excited to have you join our community.
                            </p>
                            <p className="text-gray-600">
                                Let&apos;s dive into some fun conversations together!
                            </p>
                        </div>

                        <ProgressSteps currentStep={1} />

                        <SignUpStep1Form
                            email={email}
                            setEmail={setEmail}
                            onSubmit={handleSignUpStep1}
                        />
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