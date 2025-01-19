import Banner from "@/assets/banner.png";

export const LoginBanner = () => {
    return (
        <div className="flex-[0.8] max-w-[80%] bg-gray-50 p-4 md:p-4 lg:p-4 relative flex justify-center items-center mr-4">
            <img
                src={Banner}
                alt="Dora Chat Banner"
                className="w-[100%] h-[100%] object-contain rounded-2xl"
                loading="eager"
            />
        </div>
    );
};