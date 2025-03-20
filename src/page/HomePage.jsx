import { Suspense } from "react";
import HomeImage from "@/assets/home.png";

// Main content component
const HomeContent = () => {
  return (
    <div className="flex flex-row items-center justify-center flex-1 h-full px-8 text-center">
      <div className="max-w-3xl">
        <img
          src={HomeImage}
          alt="Welcome to DoraChat"
          className="w-full h-auto"
          loading="lazy"
        />
        <h1 className="mt-6 text-2xl font-bold text-blue-600">
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
