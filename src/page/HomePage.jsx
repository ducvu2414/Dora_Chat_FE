import { Conversation } from "@/components/ui/conversation";
import { SearchBar } from "@/components/ui/search-bar";
import { TabGroup } from "@/components/ui/HomePage/tab-group";
import HomeImage from "@/assets/home.png";
import { useState } from "react";

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

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('messages');
  const [activeConversation, setActiveConversation] = useState(null);

  const conversations = activeTab === 'messages' ? messages : groups;

  return (
    <div className="flex h-screen bg-gradient-to-b from-blue-50/50 to-white w-full">
      {/* Sidebar */}
      <div className="w-[380px] bg-white border-r flex flex-col">
        <div className="px-4 pt-4 pb-2">
          <SearchBar />
        </div>

        <TabGroup 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
        />

        <div className="flex-1 overflow-y-auto px-2 scrollbar-hide">
          {conversations.map((conv, i) => (
            <Conversation
              key={i}
              {...conv}
              isActive={activeConversation === i}
              onClick={() => setActiveConversation(i)}
            />
          ))}
        </div>

        {/* Admin Profile */}
        <div className="p-4 border-t flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <img
              src="https://s3-alpha-sig.figma.com/img/20a1/d517/ac424205661ad4fee696bc7f0dcf9d8e?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=gPeFCT0vSIeEq2Wi0-ccjoo5u3twEh9czXw3s8Nang76eUdafBXDlevX0ttJD2IIzInqzZBqP0RWYkP6aKFdWUKyq2R0o~7rW3~qcw2ux9RqWciREg1YtcWKdCFopWPSLcHfYpFT7fhsrW5MUlcD5ps5gSA949a-MgO~f69cmAFf9UqRnQbT91v8perO6yr2ouE2UKH20kdnQf3Jv-Iep7Y4c61Tl13D-UrSFsZKqDtHkKCMAt14Toszn80ys0~xA6Vl0dRzAm4LTzlK0I6DNPE3olaBQ7yNEbv~ZNIc9OaOGUhYxyjjkBSU72CleVm8VQtq8w7We8WAFnmrIQgpqA__"
              alt="Admin"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-sm text-regal-blue font-bold">User admin</p>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Active
              </p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-200 rounded-md bg-white">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 3.5C8.41421 3.5 8.75 3.16421 8.75 2.75C8.75 2.33579 8.41421 2 8 2C7.58579 2 7.25 2.33579 7.25 2.75C7.25 3.16421 7.58579 3.5 8 3.5Z"
                fill="#6B7280"
              />
              <path
                d="M8 8.75C8.41421 8.75 8.75 8.41421 8.75 8C8.75 7.58579 8.41421 7.25 8 7.25C7.58579 7.25 7.25 7.58579 7.25 8C7.25 8.41421 7.58579 8.75 8 8.75Z"
                fill="#6B7280"
              />
              <path
                d="M8 14C8.41421 14 8.75 13.6642 8.75 13.25C8.75 12.8358 8.41421 12.5 8 12.5C7.58579 12.5 7.25 12.8358 7.25 13.25C7.25 13.6642 7.58579 14 8 14Z"
                fill="#6B7280"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-row items-center justify-center text-center px-8">
        <div className="mb-80">
          <h1 className="text-[2.5rem] font-light mb-4 tracking-tight whitespace-nowrap font-josefin">
            Good morning,{" "}
            <span className="text-blue-600 whitespace-nowrap font-josefin">
              User Admin
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 font-josefin">
            Let&apos;s start chatting with everyone!
          </p>
        </div>
        <div>
          <img
            src={HomeImage || "/placeholder.svg"}
            alt="Chat illustration"
            className="w-full max-w-2xl"
          />
        </div>
      </div>
    </div>
  );
}

