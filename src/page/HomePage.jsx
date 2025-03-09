import { Suspense } from "react";
import HomeImage from "@/assets/home.png";

// Main content component
const HomeContent = () => {
  return (
    <div className="flex-1 flex flex-row items-center justify-center text-center px-8 h-full">
      <div className="max-w-3xl">
        <img
          src={HomeImage}
          alt="Welcome to DoraChat"
          className="w-full h-auto"
          loading="lazy"
        />
        <h1 className="text-2xl font-bold mt-6 text-blue-600">
          Welcome to DoraChat
        </h1>
        <p className="mt-2 text-gray-600">
          Connect with friends and the world around you on DoraChat.
        </p>
      </div>
    </div>
  );
};

export default function HomePage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
