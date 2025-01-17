import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import LogoLogin from "@/assets/login1.png"
import Logo from "@/assets/dorachat_logo.png"
import Banner from "@/assets/banner.png"

export default function LoginPage() {
    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden">
            {/* Left Section */}
            <div className="flex-1 bg-gray-50 p-4 md:p-8 lg:p-12 relative">
                <img
                    src={Banner}
                    alt="Dora Chat Banner"
                    className="w-full h-full object-cover rounded-2xl"
                    loading="eager"
                />
            </div>

            {/* Right Section */}
            <div className="w-full md:w-[400px] p-6 flex flex-col justify-center">
                <div className="flex justify-end mb-4 ">
                    <p className="text-sm text-gray-600">
                        You don't have an account?
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
                            className="object-contain w-[350px] h-[65px]"
                        />
                    </div>
                    <p className="text-sm font-black text-gray-500 mt-1 text-right"><strong>Hiện đại.z</strong></p>
                </div>

                <form className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            type="text"
                            placeholder="Username"
                            className="h-12 px-4 rounded-xl placeholder-blue-100"
                        />

                    </div>
                    <div className="space-y-2">
                        <Input
                            type="password"
                            placeholder="Password"
                            className="h-12 px-4 rounded-xl"
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
                            className="w-16 h-16 bg-[#D3EBFF] rounded-full bg-[#D3EBFF] hover:bg-[#bde0ff] flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105"
                            size="lg"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="w-6 h-6 fill-current text-blue-700 hover:bg-white hover:text-white transition-all duration-200"
                            >
                                <path d="M13.4 12l-4.7-4.7 1.4-1.4 6.1 6.1-6.1 6.1-1.4-1.4z" />
                            </svg>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}