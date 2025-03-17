import { Button } from "@/components/ui/button"
import { MessageCircle, UserMinus } from "lucide-react"
import BannerImage from "@/assets/banner-user-info.png"
import CatIllustration from "@/assets/friend-information.png"
const hobbies = [
  { icon: "🏸", label: "Bamintion" },
  { icon: "⚽", label: "Football" },
  { icon: "🎤", label: "Singing" },
  { icon: "📸", label: "Photograh" },
]

export default function FriendInformationPage() {
  return (
    <div className="flex h-screen bg-gradient-to-b from-blue-50/50 to-white w-full">

      {/* Main Content */}
      <div className="flex-1 relative bg-blue-100 p-3">
        {/* Banner Image */}
        <div
          className="h-72 w-full bg-cover bg-center rounded-2xl"
          style={{
            backgroundImage: `url(${BannerImage})`,
          }}
        />

        {/* Profile Content */}
        <div className="max-w-4xl mx-auto px-8 -mt-48 relative z-10">
          <div className="bg-white rounded-3xl p-8 shadow-sm relative mt-12">
            {/* Profile Image - Positioned to overlap */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
              <img
                src="https://s3-alpha-sig.figma.com/img/4f96/6c32/0b9a00911f35a7ae254f6846bb1f4021?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RZT9n-2xU0OV8osbPbAYdd9QxuYH93wC6VE9dRymL0hPPUZ2RrulkhHwVDP9WDfRJ7I2sgUnBX5gtvWi1gXCuM~DJ-9iwXYx9E3IFuWp-zhH14Bm6--o6Vj3ebU9u1GmG0h0Q445KGb9rFAwuGD3N-VDabqhIYv0xy-hmyRzZxfaX9fTzNtctDMCis-~0QNLwxuVBFTUx9TjaCznyHzRvqhq1NHtvhE~H488WFMLDxbFJpy52EZn7fK7ZCS4x98dGgsHTYzwuqReluqWUwLKcPQl0RR-ShqPub-vYnjN-NxMmsVHzoAzPD1Pc4Eu1TYzBAWTzGgchaiYyFXO-FEWuA__"
                alt="Monica William"
                className="w-24 h-24 rounded-full border-4 border-white object-cover"
              />
            </div>

            <div className="flex flex-col items-center pt-4">
              {/* Name and Bio */}
              <h1 className="text-2xl font-semibold text-blue-600 mb-1">Monica William</h1>
              <p className="text-gray-600 mb-6">✨ Adding a little sparkle to your day.</p>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send message
                </Button>
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-red-600 hover:border-transparent">
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
                      <h2 className="text-blue-600 font-medium flex items-center gap-4 mb-4 relative">
                        <div className="relative w-8 h-8">
                          <div className="absolute inset-0 rounded-full bg-blue-600"></div>
                          <div className="absolute inset-2 rounded-full bg-white"></div>
                        </div>
                        Her information
                      </h2>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 ml-12">
                          <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                            <span className="text-lg">🎂</span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Date of birth: <span className="text-sm font-bold">January 25, 2003</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3  ml-12">
                          <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                            <span className="text-lg">📅</span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Join at: <span className="text-sm font-bold">November 11, 2003</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3  ml-12">
                          <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                            <span className="text-lg">📍</span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Live at: <span className="text-sm font-bold">Ho Chi Minh City</span>
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
                      <h2 className="text-blue-600 font-medium flex items-center gap-4 mb-4 relative">
                        <div className="relative w-8 h-8">
                          <div className="absolute inset-0 rounded-full bg-blue-600"></div>
                          <div className="absolute inset-2 rounded-full bg-white"></div>
                        </div>
                        Her hobbies
                      </h2>
                      <div className="flex flex-wrap gap-2 ml-12">
                        {hobbies.map((hobby) => (
                          <span
                            key={hobby.label}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
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
  )
}

