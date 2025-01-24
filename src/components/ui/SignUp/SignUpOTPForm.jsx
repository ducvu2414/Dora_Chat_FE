import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield } from 'lucide-react';

// eslint-disable-next-line react/prop-types
export function SignUpOTPForm({ otpCode, setOtpCode, onSubmit }) {
    const [countdown, setCountdown] = useState(0);
    const [resendCount, setResendCount] = useState(0);
    const MAX_RESEND = 3;

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const handleResendOTP = () => {
        if (resendCount >= MAX_RESEND) {
            return;
        }

        setCountdown(60);
        setResendCount(prev => prev + 1);

        console.log("Resending OTP...");
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    Enter the OTP code
                </h2>
                <p className="text-gray-600">
                    Enter the OTP code sent to your Email or phone number
                </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
                <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                        type="text"
                        placeholder="Your OTP code"
                        value={otpCode}
                        maxLength={6}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 text-blue-500"
                        onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" >
                    Next
                </Button>

                <div className="text-center space-y-2">
                    <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={countdown > 0 || resendCount >= MAX_RESEND}
                        className={`border-none bg-white text-blue-600 hover:text-sm  ${(countdown > 0 || resendCount >= MAX_RESEND)
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                            }`}
                    >
                        {resendCount >= MAX_RESEND
                            ? "Maximum resend attempts reached"
                            : "Resend verification code"}
                    </button>

                    {countdown > 0 && resendCount < MAX_RESEND && (
                        <p className="text-sm text-gray-500">
                            Resend available in {countdown}s
                        </p>
                    )}

                    {/* {resendCount > 0 && resendCount < MAX_RESEND && (
                        <p className="text-sm text-gray-500">
                            {MAX_RESEND - resendCount} attempts remaining
                        </p>
                    )} */}
                </div>
            </form>
        </div>
    );
}