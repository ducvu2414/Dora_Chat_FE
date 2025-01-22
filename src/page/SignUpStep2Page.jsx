import { useState } from "react";
import Logo from "@/assets/dorachat_logo.png";
import SignUpBanner from "@/assets/signup.png";
import { ProgressSteps } from "../components/ui/SignUp/ProgressSteps";
import { SignUpOTPForm } from "../components/ui/SignUp/SignUpOTPForm";
import { AlertMessage } from '../components/ui/alert-message';
import { useNavigate } from "react-router-dom";
import { Spinner } from "./Spinner";


export default function SignUpStep2Page() {
    const [otpCode, setOtpCode] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const Max_Length = 6;

    async function handleSignUpStep2(e) {
        e.preventDefault();
        console.log("OTP Code:", otpCode);
        if (otpCode.length !== Max_Length) {
            AlertMessage({ type: "error", message: "Please enter a valid OTP code" });

            return;
        }

        setLoading(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            AlertMessage({ type: "success", message: "Account created successfully!" });
            navigate('/signup/info');
        } catch (error) {
            console.error("API call failed:", error);
            AlertMessage({ type: "error", message: "Something went wrong. Please try again." });
        } finally {
            setLoading(false);
        }

        console.log("Sign Up Step 2");
    }

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
                            <SignUpOTPForm
                                otpCode={otpCode}
                                setOtpCode={setOtpCode}
                                onSubmit={handleSignUpStep2}
                            />
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