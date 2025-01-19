import { Link } from "react-router-dom";
import Logo from "@/assets/dorachat_logo.png";

export const LoginHeader = () => {
    return (
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
    );
};