import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const LoginForm = ({ onSubmit }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ username, password });
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
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
    );
};