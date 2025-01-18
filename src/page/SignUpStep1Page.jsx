import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { User, Mail, Info, CheckCircle } from 'lucide-react'
import Logo from "@/assets/dorachat_logo.png";
import SignUpBanner from "@/assets/signup.png";
import { useState } from "react";

export default function SignUpStep1Page() {
    const [email, setEmail] = useState("");
    function handleSignUpStep1(e) {
        e.preventDefault();
        console.log("Email:", email);
        console.log("Sign Up Step 1");
    }

    return (
        <div className='max-w-screen-2xl h-full w-full flex justify-center items-center bg-[#D8EDFF] h-screen'>
            <div className="w-full h-full flex flex-col md:flex-row ">
                {/* Left side - Form */}
                <div className="w-[150%] h-full p-4 md:p-8 lg:p-12 relative justify-center bg-white flex flex-col items-center ">
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

                        {/* Progress steps */}
                        <div className="flex justify-between items-center">
                            <Step number={1} label="Your contact" icon={<User className="w-4 h-4" />} active />
                            <Line />
                            <Step number={2} label="OTP code" icon={<Mail className="w-4 h-4" />} />
                            <Line />
                            <Step number={3} label="Your information" icon={<Info className="w-4 h-4" />} />
                            <Line />
                            <Step number={4} label="Done" icon={<CheckCircle className="w-4 h-4" />} />
                        </div>

                        {/* Form */}
                        <div className="space-y-6">
                            <form onSubmit={handleSignUpStep1} className="space-y-4">
                                <Input
                                    type="text"
                                    placeholder="Enter your mail or phone"
                                    value={email}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-50"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                    Next
                                </Button>
                            </form>
                        </div>
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
    )
}

function Step({
    number,
    label,
    icon,
    active = false
}) {
    return (
        <div className="flex flex-col items-center space-y-2">
            <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                    }`}
            >
                {icon}
            </div>
            <div className="text-xs text-gray-500">{label}</div>
        </div>
    );
}

function Line() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 fill-current text-blue-700"
        >
            <line x1="2" y1="12" x2="502" y2="12" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
}