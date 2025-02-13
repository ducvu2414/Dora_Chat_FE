/* eslint-disable react/prop-types */
import { useState } from "react"
import { SearchBar } from "@/components/ui/search-bar"
import { TabConversation } from "@/components/ui/tab-conversation"
import { Conversation } from "@/components/ui/conversation"
import { UserMenuDropdown } from "@/components/ui/user-menu-dropdown"

export function SideBar({ messages, groups, requests }) {
  const [activeTab, setActiveTab] = useState("messages")
  const [activeConversation, setActiveConversation] = useState(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const getConversations = () => {
    switch (activeTab) {
      case "messages":
        return messages
      case "group":
        return groups
      case "requests":
        return requests
      default:
        return []
    }
  }

  const conversations = getConversations()

  return (
    <div className="w-[380px] bg-white border-r flex flex-col">
      <div className="px-4 pt-4 pb-2">
        <SearchBar />
      </div>

      <TabConversation activeTab={activeTab} onTabChange={setActiveTab} requestCount={requests.length} />

      <div className="flex-1 overflow-y-auto px-2 scrollbar-hide">
        {conversations.map((conv, i) => (
          <Conversation
            key={i}
            {...conv}
            isActive={activeConversation === i}
            onClick={() => setActiveConversation(i)}
            activeTab={activeTab}
          />
        ))}
      </div>

      {/* Admin Profile */}
      <div className="p-4 border-t flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <img
            src="https://s3-alpha-sig.figma.com/img/20a1/d517/ac424205661ad4fee696bc7f0dcf9d8e?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=gPeFCT0vSIeEq2Wi0-ccjoo5u3twEh9czXw3s8Nang76eUdafBXDlevX0ttJD2IIzInqzZBqP0RWYkP6aKFdWUKyq2R0o~7rW3~qcw2ux9RqWciREg1YtcWKdCFopWPSLcHfYpFT7fhsrW5MUlcD5ps5gSA949a-MgO~f69cmAFf9UqRnQbT91v8perO6yr2ouE2UKH20kdnQf3Jv-Iep7Y4c61Tl13D-UrSFsZKqDtHkKCMAt14Toszn80ys0~xA6Vl0dRzAm4LTzlK0I6DNPE3olaBQ7yNEbv~ZNIc9OaOGUhYxyjjkBSU72CleVm8VQtq8w7We8WAFnmrIQgpqA__"
            alt="Admin"
            className="w-12 h-12 rounded-full object-cover cursor-pointer"
          />
          <div>
            <p className="text-sm text-regal-blue font-bold cursor-pointer">User admin</p>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              Active
            </p>
          </div>
        </div>
        <div className="relative">
          <button
            className="p-2 hover:bg-gray-200 rounded-md bg-white focus:outline-none"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <UserMenuDropdown isOpen={isUserMenuOpen} onClose={() => setIsUserMenuOpen(false)} />
        </div>
      </div>
    </div>
  )
}

// import { useState } from "react"
// import { SearchBar } from "@/components/ui/search-bar"
// import { TabConversation } from "@/components/ui/tab-conversation"
// import { Conversation } from "@/components/ui/conversation"
// import { UserMenuDropdown } from "@/components/ui/user-menu-dropdown"

// export function SideBar({ messages, groups, requests }) {
//   const [activeTab, setActiveTab] = useState("messages")
//   const [activeConversation, setActiveConversation] = useState(null)
//   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

//   const getConversations = () => {
//     switch (activeTab) {
//       case "messages":
//         return messages
//       case "group":
//         return groups
//       case "requests":
//         return requests
//       default:
//         return []
//     }
//   }

//   const conversations = getConversations()

//   return (
//     <div className="w-[380px] bg-white border-r flex flex-col relative">
//       <div className="px-4 pt-4 pb-2">
//         <SearchBar />
//       </div>

//       <TabConversation activeTab={activeTab} onTabChange={setActiveTab} requestCount={requests.length} />

//       <div className="flex-1 overflow-y-auto px-2 scrollbar-hide relative z-10">
//         {conversations.map((conv, i) => (
//           <Conversation
//             key={i}
//             {...conv}
//             isActive={activeConversation === i}
//             onClick={() => setActiveConversation(i)}
//             activeTab={activeTab}
//           />
//         ))}
//       </div>

//       <div className="p-4 border-t flex items-center justify-between bg-white relative">
//         <div className="flex items-center gap-3">
//           <img
//             src="https://s3-alpha-sig.figma.com/img/20a1/d517/ac424205661ad4fee696bc7f0dcf9d8e?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=gPeFCT0vSIeEq2Wi0-ccjoo5u3twEh9czXw3s8Nang76eUdafBXDlevX0ttJD2IIzInqzZBqP0RWYkP6aKFdWUKyq2R0o~7rW3~qcw2ux9RqWciREg1YtcWKdCFopWPSLcHfYpFT7fhsrW5MUlcD5ps5gSA949a-MgO~f69cmAFf9UqRnQbT91v8perO6yr2ouE2UKH20kdnQf3Jv-Iep7Y4c61Tl13D-UrSFsZKqDtHkKCMAt14Toszn80ys0~xA6Vl0dRzAm4LTzlK0I6DNPE3olaBQ7yNEbv~ZNIc9OaOGUhYxyjjkBSU72CleVm8VQtq8w7We8WAFnmrIQgpqA__"
//             alt="Admin"
//             className="w-12 h-12 rounded-full object-cover cursor-pointer"
//           />
//           <div>
//             <p className="text-sm text-regal-blue font-bold cursor-pointer">User admin</p>
//             <p className="text-xs text-green-500 flex items-center gap-1">
//               <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
//               Active
//             </p>
//           </div>
//         </div>
//         <div className="relative">
//           <button
//             className="p-2 hover:bg-gray-200 rounded-md bg-white focus:outline-none"
//             onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
//           >
//             <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path
//                 d="M8 3.5C8.41421 3.5 8.75 3.16421 8.75 2.75C8.75 2.33579 8.41421 2 8 2C7.58579 2 7.25 2.33579 7.25 2.75C7.25 3.16421 7.58579 3.5 8 3.5Z"
//                 fill="#6B7280"
//               />
//               <path
//                 d="M8 8.75C8.41421 8.75 8.75 8.41421 8.75 8C8.75 7.58579 8.41421 7.25 8 7.25C7.58579 7.25 7.25 7.58579 7.25 8C7.25 8.41421 7.58579 8.75 8 8.75Z"
//                 fill="#6B7280"
//               />
//               <path
//                 d="M8 14C8.41421 14 8.75 13.6642 8.75 13.25C8.75 12.8358 8.41421 12.5 8 12.5C7.58579 12.5 7.25 12.8358 7.25 13.25C7.25 13.6642 7.58579 14 8 14Z"
//                 fill="#6B7280"
//               />
//             </svg>
//           </button>
//           <UserMenuDropdown isOpen={isUserMenuOpen} onClose={() => setIsUserMenuOpen(false)} />
//         </div>
//       </div>
//     </div>
//   )
// }