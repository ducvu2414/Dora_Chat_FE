import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import LogoLogin from "@/assets/login1.png";
import Logo from "@/assets/dorachat_logo.png";
import Banner from "@/assets/banner.png";
export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function handleLogin(e) {
        e.preventDefault();
        console.log("Username:", username);
        console.log("Password:", password);
    }

    return (
        <div className='max-w-screen-2xl w-full h-[50%] '>
            <div className="max-h-screen flex flex-col md:flex-row overflow-hidden flex justify-center items-center">
                {/* Left Section */}
                <div className="flex-[0.8] max-w-[80%] bg-gray-50 p-4 md:p-4 lg:p-4 relative flex justify-center items-center mr-4">
                    <img
                        src={Banner}
                        alt="Dora Chat Banner"
                        className="w-[100%] h-[100%] object-contain rounded-2xl"
                        loading="eager"
                    />
                </div>

                {/* Right Section */}
                <div className="w-full md:w-[400px] p-6 flex flex-col justify-center">
                    <div className="flex justify-end mb-4">
                        <p className="text-sm text-gray-600">
                            You don&apos;t have an account?
                            <Link to="/signup" className="text-orange-500 font-medium ml-1 hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-center">
                            <img
                                src={Logo}
                                alt="Dora Logo"
                                className="object-contain w-[250px] sm:w-[300px] md:w-[350px] h-auto"
                            />
                        </div>
                        <p className="text-sm font-black text-gray-500 mt-1 text-right">
                            <strong>Hiện đại.z</strong>
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleLogin}>
                        <div className="space-y-2">
                            <Input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="h-12 px-4 rounded-xl placeholder-blue-100 w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-12 px-4 rounded-xl w-full"
                            />
                            <div className="flex justify-end">
                                <Link to="/forgot-password" className="text-sm text-gray-600 hover:underline">
                                    Forgot password
                                </Link>
                            </div>
                        </div>
                        <div className="flex justify-center mt-4">
                            <Button
                                type="submit"
                                className="w-12 sm:w-16 h-12 sm:h-16 bg-[#D3EBFF] rounded-full hover:bg-[#bde0ff] flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105"
                                size="lg"
                                onSubmit={handleLogin}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6 fill-current text-blue-700"
                                >
                                    <path d="M13.4 12l-4.7-4.7 1.4-1.4 6.1 6.1-6.1 6.1-1.4-1.4z" />
                                </svg>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
