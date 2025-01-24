import { LoginBanner } from "@/components/ui/Login/LoginBanner";
import { SignUpLink } from "@/components/ui/Login/SignUpLink";
import { LoginHeader } from "@/components/ui/Login/LoginHeader";
import { LoginForm } from "@/components/ui/Login/LoginForm";

export default function LoginPage() {
    const handleLogin = ({ username, password }) => {
        console.log("Username:", username);
        console.log("Password:", password);
        window.location.href = "/home";
    };

    return (
        <div className='max-w-screen-2xl w-full h-[50%]'>
            <div className="max-h-screen flex flex-col md:flex-row overflow-hidden flex justify-center items-center">
                <LoginBanner />
                <div className="w-full md:w-[400px] p-6 flex flex-col justify-center">
                    <SignUpLink />
                    <LoginHeader />
                    <LoginForm onSubmit={handleLogin} />
                </div>
            </div>
        </div>
    );
}