import { useState } from "react";
import { SideBar } from "@/components/ui/side-bar";
import { TabUserInfo } from "@/components/ui/UserInformation/tab-user-info";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BannerImage from "@/assets/banner-user-info.png";

const messages = [
  {
    avatar:
      "https://s3-alpha-sig.figma.com/img/b716/471e/a92dba5e34fe4ed85bd7c5f535acdaae?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LjxeFExG2mfQsIC1PhfgwD5sI1KwkgcdwdyUS5AyHkUVuwcJf1wR0ZiKF7RZrM0i8GSlA7aHsoF51XhpRQLxR4qVXSw6UnYprvVtc7RNpJffWnq1ukN~P7L77ZIPtjU6181DFElG8PGlTyFsLtC0TD24WIb-y7s7EIcnJrVTSDRyotmNCUq-j0qSMuU1rOM301xCYXHB3Ul70GKtqsgBKK8x79HKBZgu-laGa4Oy7rfMzDnlbjS2pO6EwNUu~wFvwhBiGnMSUcfFZeD4txGpwBhJCUDT8epFoEW82g1cYS81ClzjFuMme3-BsB9QFjlEHrquHOeBoH-A9zON9uXx4g__",
    name: "Iris Paul",
    message: "How are you?",
    time: "Now",
  },
  {
    avatar:
      "https://s3-alpha-sig.figma.com/img/77c6/8849/96c44a460b55a989d90970fc2b0d81ac?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=iNBXCAYM3XkbLwPPyDFsTOF1VUQ0bDb9tl-CwAtztbj1ZjtN2hARIoDC2VTA~txeqLZZ7WjmCJ-3Ecc6WY1lMMz2762duRsHiNhuSpSAcgpx5YCi070aaug2lmT2xEEizj1zIJYJZrh~fs2fc8AjHjM~Dtg2d4AzCOtMakm02pw~6VIajB6AlFxd4M9l-esyKuKy65lQKwG0w~mgAvsScnIry7uMWeC923sSRbV4RMUY7mfHkG3kr6rcFeOq2jmEhL4dAwyHri0ALLzVRe3brQ5o7M3f2SVquTzqRZtwTSedEjUg55O5M-Ka7p68--Q~DsX6yKZWbk00uWVqFaWjxA__",
    name: "Jone Nguyen",
    message: "How are you?",
    time: "2 mins",
  },
  {
    avatar:
      "https://s3-alpha-sig.figma.com/img/b3c2/3d22/9e7189a7eb428bd40284e032a6a646cc?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=qeF61cmLHi1NPEez5ZCWxrLsDss5xAGHt44FH3cPc7oQ7s86nIJayB064zDnzpKYCACqeOGGjVO5VjCOWtWm3fbpjw~hGaYG~ebUaTfu597TWCIiEvJ99gdk5F2Ig~zirHOUZFvCEAorIZhiX0JRJ-rOUnJqOOWX7fzzorNBpHis2wHEWU6zfdBdbeBQ0cQrH4OB6K02bMK4cHfCkM2t3foddVeShTHUv9U2Zt3~A1jSbkF4VzAs0QXoCnrUF4RP0WIYaetUZfLZyFWL9uOq-McF12Xj~Vj4Hrkpy6dxfeZnxwLwD52tN8dz7gIdRflVlN6P26cxdAD50byl2XUr2A__",
    name: "Aurora Bonita",
    message: "How are you?",
    time: "20 mins",
  },
  {
    avatar:
      "https://s3-alpha-sig.figma.com/img/4b44/1d65/e43e4a32db699d94c4bada7aa2ccff06?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LC4Lf-~lXiy7cXb7W7bD7gMkfkKG-MuT1w9BHPIT8MHna451KqaiuFaI4a23dJQ5CFyzf~P8yG7ti1rf02Gr9rEJ9J1SKuRUvRkrngZfD-YCPsydqKLarHXUglcV1-it82Q-Tn1-lKMOBTOnWIfBwUlsv44X8XdtuXLdkbUAG5wDOsmGyRde4i0CC6ZEw7TnIIPmM75HI9tE7GTRy4jjWwhf23ixSZF39XVOL-yoUSCzZyU--khY6RXRrznHqXD6lt3REZY8WXjrjzG01RmlftfhMhJQ3UkkWYanFEnX-S~d1tbMMpNc3A20DYYddm5ENQuaA-NMR~y~mFKd7Xak6g__",
    name: "Tom Athony",
    message: "How are you?",
    time: "4 hours",
  },
  {
    avatar:
      "https://s3-alpha-sig.figma.com/img/0dca/d322/bd3b28a9327f195eb0ce730500f0d0da?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=bQj558EhPLvR54rq0b2PL0gPgTXPT19sHatuctR86Gn3FfMyB3lzgRTgxMdL77chQqFQPJ3sx4cWwEXLU5aYsS7S8BZUhbdtL5oaxwYPaZ2CRJH7TVyWElUBQenup5CcNzIlLxgsg6MMnDsF0xWYt3kYGayvLEYTTLolGfsVTooWyxuCiuY-yqwIty5yV88U7cdCUrkYTSptvCP7H3Z-RpanK5nFfbepVkyVs~fZzICaYORaMItemepGNBfanrzYXn5Y6-XdcYyi-OVi17uFT559yksnRvi4dQ0gsFjNphLXbS0Jz4IsBEFqxhEdgnzOjkWtpc0nMaZr92ke9dju~Q__",
    name: "Liam Hemsworth",
    message: "How are you?",
    time: "6 hours",
  },
  {
    avatar:
      "https://s3-alpha-sig.figma.com/img/05a9/c731/be92cab5736e28f18b4b2ca1d65fd213?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Etqp8TCP2Bt6L7~3qfgv1ckwPVILUO88ZAO3IJkqAcqyZRRIi9YFFxxoNr-~SFaVN7vNI1XrKBB8iH0v-0S5mHoC2QngbIQzNPM-3UkMYGmU1ZYt9xGINd7tldlqJVniAYXv-0PlynrhWrSKgTJe~J~Wiwo-wy5YDp-V63iI7u00cOSeZTxGdZwx1SNN7a8MFK6OUL0v~OBB-e498DbrtsDXL8BOinhAToKDp71dRgj-eWIG4QCWeV~P3GRx2aYiCDtYvU3DtlCtPYL2ceY35KmSOQXJ77BWSMVYUplcu8OgNsWbOsaCWS95Ln8LuOq6FqC7X94exi8ZtupWhJmHVg__",
    name: "Daria Julli",
    message: "How are you?",
    time: "21 hours",
  },
  {
    avatar:
      "https://s3-alpha-sig.figma.com/img/4f96/6c32/0b9a00911f35a7ae254f6846bb1f4021?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RZT9n-2xU0OV8osbPbAYdd9QxuYH93wC6VE9dRymL0hPPUZ2RrulkhHwVDP9WDfRJ7I2sgUnBX5gtvWi1gXCuM~DJ-9iwXYx9E3IFuWp-zhH14Bm6--o6Vj3ebU9u1GmG0h0Q445KGb9rFAwuGD3N-VDabqhIYv0xy-hmyRzZxfaX9fTzNtctDMCis-~0QNLwxuVBFTUx9TjaCznyHzRvqhq1NHtvhE~H488WFMLDxbFJpy52EZn7fK7ZCS4x98dGgsHTYzwuqReluqWUwLKcPQl0RR-ShqPub-vYnjN-NxMmsVHzoAzPD1Pc4Eu1TYzBAWTzGgchaiYyFXO-FEWuA__",
    name: "Monica William",
    message: "How are you?",
    time: "Yesterday",
  },
];

const groups = [
  {
    avatar: "/placeholder.svg?height=40&width=40",
    name: "Design Team",
    message: "New project discussion",
    time: "5 mins",
  },
  {
    avatar: "/placeholder.svg?height=40&width=40",
    name: "Development Team",
    message: "Sprint planning",
    time: "1 hour",
  },
  {
    avatar: "/placeholder.svg?height=40&width=40",
    name: "Marketing Team",
    message: "Campaign updates",
    time: "3 hours",
  },
];

export default function UserInformation() {
  const [activeTab, setActiveTab] = useState("account");
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle password change logic here
    console.log("Password change submitted:", formData);
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-blue-50/50 to-white w-full">
      <SideBar messages={messages} groups={groups} />

      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Banner Image */}
        <div
          className="h-72 w-full bg-cover bg-center rounded-3xl"
          style={{
            backgroundImage: `url(${BannerImage})`,
          }}
        />

        {/* Profile Content */}
        <div className="flex flex-row gap-x-5 max-w-4xl mx-auto -mt-24 px-8">
          {/* Profile Header */}
          <div className="bg-white rounded-3xl p-6 shadow-sm mb-6 text-center">
            <div className="flex flex-col items-center">
              <img
                src="https://s3-alpha-sig.figma.com/img/20a1/d517/ac424205661ad4fee696bc7f0dcf9d8e?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=olirJ1hrxtyMOGmOGALINoUwczQrQaT0XTv6ufFztNWDjNdNkSuSkcWvyX~kyUqA57eDYG8RGPSk1WtSfvp0HeBhRZtGXR4lnEkcHGTC00KGgii593HRKIY8wQyxKiEA8Nbmt2iXPs3SY2dbS6raxgXSt9unmLHQ-NfBU1lfAB33bwPK3ZCf9qgFPTadV2pFuTuQTJeFjT8cfI1z7ukomxVEaEf8qpm7YVeubQzzkRbHbPyANpy7c84DhpBXutZkAbaDnaKjQi7pMFa-aFb2uUnhGdw9bRyYmC~ks4kq3zJwYcq7c9rIV3Ht~I1nogT-j~rllghW3c~XiGdti9b3eA__"
                alt="User Admin"
                className="w-24 h-24 rounded-full border-4 border-white mb-4"
              />
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                User Admin
              </h1>
              <p className="text-gray-600 mb-6">⭐ Have a nice day! 🌊</p>

              {/* QR Code */}
              <div className="flex flex-col items-center">
                <img
                  src="https://s3-alpha-sig.figma.com/img/0374/d850/67166b3ba72139d99902439d7af64208?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=UIaYZRZnAdTY~WhI14vJBY28uTTLL0v9bcjdLOudyiNhoLb4qEwkYZBEgKedeG3rEelGrZ7zfc54zTIrrZbE6TG48EMkAi919ACib-XlwbvGV3I3Wh2bLCQN37VwYYt1Mh5dGKe-cMVRDTbjU2CgZEZIAcVL7GD1Ym1~kFKPzI3ZH7Qfqog~P5HUstQFXQUR1ZquguA-t6TDnQ~nceuMtJcK8wTVUVqRDk9HH6PhOJnpxiOzDPjyN9lqRXoCRvZoJ~7i3E49iuYmgIhIHwyZl7ISGF1k-KYV7ka01TLDPSkeS~K5DyVtmpeCMgUKg8604yPlSynaUUPtv9upGqmkLA__"
                  alt="QR Code"
                  className="w-32 h-32 mb-2"
                />
                <p className="text-sm text-orange-500 font-bold">
                  QR code helps people follow you quickly
                </p>
                <button className="mt-2 p-2 rounded-full bg-orange-100 hover:bg-orange-200 border-none transition-colors">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="text-orange-400"
                  >
                    <path d="M12 4v12m0 0l-4-4m4 4l4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path
                      d="M4 16.8v.8a2.4 2.4 0 0 0 2.4 2.4h11.2a2.4 2.4 0 0 0 2.4-2.4v-.8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs & Content */}
          <div className="bg-white rounded-3xl shadow-sm">
            <div className="border-b">
              <TabUserInfo activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            <div className="p-6">
              {activeTab === "account" ? (
                <div className="max-w-md mx-auto">
                  <h2 className="text-xl font-semibold text-regal-blue mb-6 flex items-center justify-center gap-2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="text-blue-600"
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        ry="2"
                        strokeWidth="2"
                      />
                      <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth="2" />
                    </svg>
                    Change password
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1 text-left">
                        Current password
                      </label>
                      <Input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        placeholder="Enter current password"
                        className="w-full rounded-full bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1 text-left">
                        New password
                      </label>
                      <Input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder="Enter new password"
                        className="w-full rounded-full bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1 text-left">
                        Confirm password
                      </label>
                      <Input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Enter confirm password"
                        className="w-full rounded-full bg-gray-100"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Password must be at least 8 characters long, containing
                        uppercase and lowercase letters and numbers
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Save
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Information tab content goes here
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
