import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginBanner } from "@/components/ui/Login/LoginBanner";
import { SignUpLink } from "@/components/ui/Login/SignUpLink";
import { LoginHeader } from "@/components/ui/Login/LoginHeader";
import { LoginForm } from "@/components/ui/Login/LoginForm";
import { GoogleLoginButton } from "@/components/ui/Login/GoogleLoginButton";
import { AlertMessage } from '@/components/ui/alert-message';
import { Spinner } from "@/page/Spinner";

export default function LoginPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = async ({ username, password }) => {
        if (!username || !password) {
            AlertMessage({ type: "error", message: "Please fill in all fields" });
            return;
        }

        setLoading(true);
        try {
            // Replace with actual API call
            await new Promise((resolve) => setTimeout(resolve, 2000));
            AlertMessage({ type: "success", message: "Login successful!" });
            navigate('/home');
        } catch (error) {
            console.error("Login failed:", error);
            AlertMessage({
                type: "error",
                message: "Login failed. Please check your credentials and try again."
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            // Replace with actual Google OAuth logic
            await new Promise((resolve) => setTimeout(resolve, 2000));
            AlertMessage({ type: "success", message: "Google login successful!" });
            navigate('/home');
        } catch (error) {
            console.error("Google login failed:", error);
            AlertMessage({
                type: "error",
                message: "Google login failed. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-screen-2xl w-full min-h-screen">
            <div className="h-full flex flex-col md:flex-row items-center justify-center">
                <LoginBanner />
                <div className="w-full md:w-[400px] p-6 flex flex-col justify-center">
                    <SignUpLink />
                    <LoginHeader />
                    {loading ? (
                        <div className="flex justify-center my-8">
                            <Spinner />
                        </div>
                    ) : (
                        <>
                            <LoginForm onSubmit={handleLogin} loading={loading} />
                            <div className="mt-4 relative flex items-center justify-center">
                                <div className="border-t border-gray-300 w-full"></div>
                                <div className="absolute bg-white px-4 text-sm text-gray-500">
                                    Or
                                </div>
                            </div>
                            <GoogleLoginButton
                                onClick={handleGoogleLogin}
                                loading={loading}
                            />
                        </>
                    )}
                </div>
            </div>
            <AlertMessage />
        </div>
    );
}