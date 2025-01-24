// data: { avatar, name, message, time, onClick, isActive, activeTab }
import { useState } from "react"
import { MoreHorizontal } from "lucide-react"
import ContactCardDropdown from "@/components/ui/Contact/ContactCardDropdown"
import GroupCardDropdown from "@/components/ui/Contact/GroupCardDropdown"

// eslint-disable-next-line react/prop-types
export function Conversation({ onClick, isActive, activeTab, avatar, name, message, time }) {
  const [isHovered, setIsHovered] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  return (
    <div
      onClick={onClick}
      className={`h-15 flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
        isActive ? "bg-blue-100" : "hover:bg-gray-100"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={avatar || "/placeholder.svg"} alt={name} className="w-14 h-14 rounded-full object-cover" />
      <div className="flex-1 min-w-0 pl-1">
        <h3 className="font-medium text-sm text-left">{name}</h3>
        <p className="text-sm text-gray-500 truncate text-left">{message}</p>
      </div>
      {isHovered ? (
        <button
          className="text-gray-400 hover:text-gray-600 focus:outline-none bg-white rounded-full p-2"
          onClick={(e) => {
            e.stopPropagation()
            setShowDropdown(!showDropdown)
          }}
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      ) : (
        <span className="text-xs text-gray-400">{time}</span>
      )}
      {showDropdown && (
        <div className="flex-shrink-0">
          {activeTab === "messages" ? (
            <ContactCardDropdown
              onViewInfo={() => console.log("View info")}
              onCategoryChange={(category) => console.log("Category changed:", category)}
              onSetNickname={() => console.log("Set nickname")}
              onDelete={() => console.log("Delete contact")}
            />
          ) : (
            <GroupCardDropdown
              onCategoryChange={(category) => console.log("Category changed:", category)}
              onLeaveGroup={() => console.log("Leave group")}
            />
          )}
        </div>
      )}
    </div>
  )
}

