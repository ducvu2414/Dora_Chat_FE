import { LoginBanner } from "@/components/ui/Login/LoginBanner";
import { SignUpLink } from "@/components/ui/Login/SignUpLink";
import { LoginHeader } from "@/components/ui/Login/LoginHeader";
import { LoginForm } from "@/components/ui/Login/LoginForm";
import GoogleLoginButton from "../components/ui/Login/GoogleLoginButton";
import { AlertMessage } from '@/components/ui/alert-message';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/page/Spinner";


export default function LoginPage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    async function handleLogin({ username, password }) {
        // e.preventDefault();
        console.log("Username:", username);
        console.log("Password:", password);
        navigate('/home');

        // setLoading(true);

        // try {
        //     await new Promise((resolve) => setTimeout(resolve, 2000));
        //     AlertMessage({ type: "success", message: "Login successfully!" });
        //     navigate('/home');
        // } catch (error) {
        //     console.error("API call failed:", error);
        //     AlertMessage({ type: "error", message: "Something went wrong. Please try again." });
        // } finally {
        //     setLoading(false);
        // }

    };

    async function handleGoogleLogin(e) {
        e.preventDefault();
        console.log("Google login");
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            AlertMessage({ type: "success", message: "Login successfully!" });
            navigate('/home');
        }
        catch (error) {
            console.error("API call failed:", error);
            AlertMessage({ type: "error", message: "Something went wrong. Please try again." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='max-w-screen-2xl w-full h-[50%]'>
            <div className="max-h-screen flex flex-col md:flex-row overflow-hidden flex justify-center items-center">
                <LoginBanner />
                <div className="w-full md:w-[400px] p-6 flex flex-col justify-center">
                    <SignUpLink />
                    <LoginHeader />
                    {/* Show spinner if loading */}
                    {loading ? (
                        <Spinner />
                    ) : (
                        <>
                            <LoginForm onSubmit={handleLogin} />
                            <GoogleLoginButton onClick={handleGoogleLogin} />
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}