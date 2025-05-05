/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { MessageCircle, UserRoundPlus } from "lucide-react";
import BannerImage from "@/assets/banner-user-info.png";
import CatIllustration from "@/assets/other-people-information.png";

function getLastName(fullName) {
  if (!fullName || typeof fullName !== "string") {
    return "";
  }

  const parts = fullName.trim().split(" ");
  const lastName = parts[parts.length - 1]; // Lấy phần tử cuối cùng

  return lastName || "";
}

export default function OtherPeopleInformation() {
  const { state } = useLocation();
  const userData = state?.userData;
  const isSentRequest = state?.isSentRequest;
  const isFriend = state?.isFriend;

  return (
    <div className="flex w-full h-screen bg-gradient-to-b from-blue-50/50 to-white">
      {/* Main Content */}
      <div className="relative flex-1 p-3 bg-blue-100">
        {/* Banner Image */}
        <div
          className="w-full bg-center bg-cover h-72 rounded-2xl"
          style={{
            backgroundImage: `url(${userData?.coverImage || BannerImage})`,
          }}
        />

        {/* Profile Content */}
        <div className="relative z-10 max-w-2xl px-8 mx-auto -mt-48">
          <div className="bg-white rounded-3xl p-8 shadow-sm relative min-h-[400px]">
            {/* Profile Image */}
            <div className="absolute transform -translate-x-1/2 -top-12 left-1/2">
              {userData?.avatar ? (
                <img
                  src={userData?.avatar}
                  alt={userData?.name}
                  className="object-cover w-24 h-24 border-4 border-white rounded-full"
                />
              ) : (
                <div
                  src={userData?.avatar}
                  alt={userData?.name}
                  className="object-cover w-24 h-24 border-4 border-white rounded-full"
                  // style bg color is userData?.color
                  style={{
                    backgroundColor: userData?.avatarColor || "#ccc",
                  }}
                />
              )}
            </div>

            <div className="flex flex-col items-center pt-16">
              {/* Name and Bio */}
              <h1 className="mb-1 text-2xl font-semibold text-blue-600">
                {userData?.name}
              </h1>
              <p className="mb-6 text-gray-600">✨ King of the Coastline ✨</p>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send message
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isSentRequest || isFriend}
                >
                  <UserRoundPlus className="w-4 h-4 mr-2" />
                  Add friend
                </Button>
              </div>

              {/* Message */}
              <p className="text-lg text-gray-700">
                Make friends with{" "}
                <span className="text-orange-500">
                  {getLastName(userData.name)}
                </span>{" "}
                to learn more.
              </p>

              {/* Cat Illustration */}
              <div className="absolute bottom-0 right-0">
                <img
                  src={CatIllustration}
                  alt="Cat illustration"
                  className="w-48 h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
