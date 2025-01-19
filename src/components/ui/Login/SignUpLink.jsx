import { Link } from "react-router-dom";


export const SignUpLink = () => {
    return (
        <div className="flex justify-end mb-4">
            <p className="text-sm text-gray-600">
                You don&apos;t have an account?
                <Link to="/signup" className="text-orange-500 font-medium ml-1 hover:underline">
                    Sign up
                </Link>
            </p>
        </div>
    );
};
