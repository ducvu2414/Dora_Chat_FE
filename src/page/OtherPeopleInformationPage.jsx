import { SideBar } from "@/components/ui/side-bar"
import { Button } from "@/components/ui/button"
import { MessageCircle, UserRoundPlus } from "lucide-react"
import BannerImage from "@/assets/banner-user-info.png"
import CatIllustrationImage from "@/assets/other-people-information.png"

const messages = [
  {
    avatar:
      "https://s3-alpha-sig.figma.com/img/b716/471e/a92dba5e34fe4ed85bd7c5f535acdaae?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LjxeFExG2mfQsIC1PhfgwD5sI1KwkgcdwdyUS5AyHkUVuwcJf1wR0ZiKF7RZrM0i8GSlA7aHsoF51XhpRQLxR4qVXSw6UnYprvVtc7RNpJffWnq1ukN~P7L77ZIPtjU6181DFElG8PGlTyFsLtC0TD24WIb-y7s7EIcnJrVTSDRyotmNCUq-j0qSMuU1rOM301xCYXHB3Ul70GKtqsgBKK8x79HKBZgu-laGa4Oy7rfMzDnlbjS2pO6EwNUu~wFvwhBiGnMSUcfFZeD4txGpwBhJCUDT8epFoEW82g1cYS81ClzjFuMme3-BsB9QFjlEHrquHOeBoH-A9zON9uXx4g__",
    name: "Iris Paul",
    message: "How are you?",
    time: "Now",
  },
  // ... other messages (keeping the same data as before)
]

const groups = [
  {
    avatar: "/placeholder.svg?height=40&width=40",
    name: "Design Team",
    message: "New project discussion",
    time: "5 mins",
  },
  // ... other groups (keeping the same data as before)
]

export default function OtherPeopleInformation() {
  return (
    <div className="flex h-screen bg-gradient-to-b from-blue-50/50 to-white w-full">
      <SideBar messages={messages} groups={groups} />

      {/* Main Content */}
      <div className="flex-1 relative bg-blue-100 p-6">
        {/* Banner Image */}
        <div
          className="h-72 w-full bg-cover bg-center rounded-2xl"
          style={{
            backgroundImage: `url(${BannerImage})`,
          }}
        />

        {/* Profile Content */}
        <div className="max-w-2xl mx-auto px-8 -mt-48 relative z-10">
          <div className="bg-white rounded-3xl p-8 shadow-sm relative min-h-[400px]">
            {/* Profile Image */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
              <img
                src="https://s3-alpha-sig.figma.com/img/4f96/6c32/0b9a00911f35a7ae254f6846bb1f4021?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RZT9n-2xU0OV8osbPbAYdd9QxuYH93wC6VE9dRymL0hPPUZ2RrulkhHwVDP9WDfRJ7I2sgUnBX5gtvWi1gXCuM~DJ-9iwXYx9E3IFuWp-zhH14Bm6--o6Vj3ebU9u1GmG0h0Q445KGb9rFAwuGD3N-VDabqhIYv0xy-hmyRzZxfaX9fTzNtctDMCis-~0QNLwxuVBFTUx9TjaCznyHzRvqhq1NHtvhE~H488WFMLDxbFJpy52EZn7fK7ZCS4x98dGgsHTYzwuqReluqWUwLKcPQl0RR-ShqPub-vYnjN-NxMmsVHzoAzPD1Pc4Eu1TYzBAWTzGgchaiYyFXO-FEWuA__"
                alt="Patricia Capo"
                className="w-24 h-24 rounded-full border-4 border-white object-cover"
              />
            </div>

            <div className="flex flex-col items-center pt-16">
              {/* Name and Bio */}
              <h1 className="text-2xl font-semibold text-blue-600 mb-1">Patricia Capo</h1>
              <p className="text-gray-600 mb-6">✨ King of the Coastline ✨</p>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send message
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <UserRoundPlus className="w-4 h-4 mr-2" />
                  Add friend
                </Button>
              </div>

              {/* Message */}
              <p className="text-lg text-gray-700">
                Make friends with <span className="text-orange-500">Patricia</span> to learn more about her.
              </p>

              {/* Cat Illustration */}
              <div className="absolute bottom-0 right-0">
                <img
                  src={CatIllustrationImage}
                  alt="Cat illustration"
                  className="w-48 h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

