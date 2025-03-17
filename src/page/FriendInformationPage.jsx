import { Button } from "@/components/ui/button";
import { MessageCircle, UserMinus } from "lucide-react";
import BannerImage from "@/assets/banner-user-info.png";
import CatIllustration from "@/assets/friend-information.png";
const hobbies = [
  { icon: "🏸", label: "Bamintion" },
  { icon: "⚽", label: "Football" },
  { icon: "🎤", label: "Singing" },
  { icon: "📸", label: "Photograh" },
];

export default function FriendInformationPage() {
  return (
    <div className="flex w-full h-screen bg-gradient-to-b from-blue-50/50 to-white">
      {/* Main Content */}
      <div className="relative flex-1 p-3 bg-blue-100">
        {/* Banner Image */}
        <div
          className="w-full bg-center bg-cover h-72 rounded-2xl"
          style={{
            backgroundImage: `url(${BannerImage})`,
          }}
        />

        {/* Profile Content */}
        <div className="relative z-10 max-w-4xl px-8 mx-auto -mt-48">
          <div className="relative p-8 mt-12 bg-white shadow-sm rounded-3xl">
            {/* Profile Image - Positioned to overlap */}
            <div className="absolute transform -translate-x-1/2 -top-12 left-1/2">
              <img
                src="https://s3-alpha-sig.figma.com/img/4f96/6c32/0b9a00911f35a7ae254f6846bb1f4021?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RZT9n-2xU0OV8osbPbAYdd9QxuYH93wC6VE9dRymL0hPPUZ2RrulkhHwVDP9WDfRJ7I2sgUnBX5gtvWi1gXCuM~DJ-9iwXYx9E3IFuWp-zhH14Bm6--o6Vj3ebU9u1GmG0h0Q445KGb9rFAwuGD3N-VDabqhIYv0xy-hmyRzZxfaX9fTzNtctDMCis-~0QNLwxuVBFTUx9TjaCznyHzRvqhq1NHtvhE~H488WFMLDxbFJpy52EZn7fK7ZCS4x98dGgsHTYzwuqReluqWUwLKcPQl0RR-ShqPub-vYnjN-NxMmsVHzoAzPD1Pc4Eu1TYzBAWTzGgchaiYyFXO-FEWuA__"
                alt="Monica William"
                className="object-cover w-24 h-24 border-4 border-white rounded-full"
              />
            </div>

            <div className="flex flex-col items-center pt-4">
              {/* Name and Bio */}
              <h1 className="mb-1 text-2xl font-semibold text-blue-600">
                Monica William
              </h1>
              <p className="mb-6 text-gray-600">
                ✨ Adding a little sparkle to your day.
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send message
                </Button>
                <Button
                  variant="outline"
                  className="text-blue-600 border-blue-600 hover:bg-red-600 hover:border-transparent"
                >
                  <UserMinus className="w-4 h-4 mr-2" />
                  Unfriend
                </Button>
              </div>

              {/* Information Section */}
              <div className="w-full max-w-md">
                <div className="space-y-8">
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-300"></div>
                    <div>
                      <h2 className="relative flex items-center gap-4 mb-4 font-medium text-blue-600">
                        <div className="relative w-8 h-8">
                          <div className="absolute inset-0 bg-blue-600 rounded-full"></div>
                          <div className="absolute bg-white rounded-full inset-2"></div>
                        </div>
                        Her information
                      </h2>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 ml-12">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50">
                            <span className="text-lg">🎂</span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Date of birth:{" "}
                              <span className="text-sm font-bold">
                                January 25, 2003
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-12">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50">
                            <span className="text-lg">📅</span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Join at:{" "}
                              <span className="text-sm font-bold">
                                November 11, 2003
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-12">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50">
                            <span className="text-lg">📍</span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Live at:{" "}
                              <span className="text-sm font-bold">
                                Ho Chi Minh City
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hobbies Section */}
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-300"></div>
                    <div>
                      <h2 className="relative flex items-center gap-4 mb-4 font-medium text-blue-600">
                        <div className="relative w-8 h-8">
                          <div className="absolute inset-0 bg-blue-600 rounded-full"></div>
                          <div className="absolute bg-white rounded-full inset-2"></div>
                        </div>
                        Her hobbies
                      </h2>
                      <div className="flex flex-wrap gap-2 ml-12">
                        {hobbies.map((hobby) => (
                          <span
                            key={hobby.label}
                            className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 rounded-full bg-blue-50"
                          >
                            {hobby.icon} {hobby.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cat Illustration - Positioned at bottom right */}
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
  );
}
