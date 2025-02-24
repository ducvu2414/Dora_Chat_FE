/* eslint-disable react/prop-types */
// data: { avatar, name, message, time, onClick, isActive, activeTab }
// import { useState } from "react"
// import { MoreHorizontal } from "lucide-react"
// import ContactCardDropdown from "@/components/ui/Contact/ContactCardDropdown"
// import GroupCardDropdown from "@/components/ui/Contact/GroupCardDropdown"

// export function Conversation({ onClick, isActive, activeTab, avatar, name, message, time }) {
//   const [isHovered, setIsHovered] = useState(false)
//   const [showDropdown, setShowDropdown] = useState(false)
//   return (
//     <div
//       onClick={onClick}
//       className={`h-15 flex items-center gap-3 p-3 rounded-lg cursor-pointer ${isActive ? "bg-blue-100" : "hover:bg-gray-100"
//         }`}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <img src={avatar || "/placeholder.svg"} alt={name} className="w-14 h-14 rounded-full object-cover" />
//       <div className="flex-1 min-w-0 pl-1">
//         <h3 className="font-medium text-sm text-left">{name}</h3>
//         <p className="text-sm text-gray-500 truncate text-left">{message}</p>
//       </div>
//       {isHovered ? (
//         activeTab === "messages" || activeTab === "requests" ? (
//           <ContactCardDropdown
//             onViewInfo={() => console.log("View info")}
//             onCategoryChange={(category) => console.log("Category changed:", category)}
//             onSetNickname={() => console.log("Set nickname")}
//             onDelete={() => console.log("Delete contact")}
//           />
//         ) : (
//           <GroupCardDropdown
//             onCategoryChange={(category) => console.log("Category changed:", category)}
//             onLeaveGroup={() => console.log("Leave group")}
//           />
//         )
//       ) : (
//         <span className="text-xs text-gray-400">{time}</span>
//       )}
//     </div>
//   )
// }

import { useState } from "react";
import ContactCardDropdown from "@/components/ui/Contact/ContactCardDropdown";
import GroupCardDropdown from "@/components/ui/Contact/GroupCardDropdown";

export function Conversation({
  onClick,
  isActive,
  activeTab,
  avatar,
  name,
  message,
  time,
}) {
  const [isConversationHovered, setIsConversationHovered] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const showDropdown = isConversationHovered || isDropdownHovered;

  const handleConversationEnter = () => {
    setIsConversationHovered(true);
  };

  const handleConversationLeave = () => {
    setTimeout(() => {
      if (!isDropdownHovered) {
        setIsConversationHovered(false);
      }
    }, 100);
  };

  const handleDropdownEnter = () => {
    setIsDropdownHovered(true);
  };

  const handleDropdownLeave = () => {
    setIsDropdownHovered(false);
    if (!isConversationHovered) {
      setIsConversationHovered(false);
    }
  };

  return (
    <div className="relative" style={{ zIndex: showDropdown ? 500 : 0 }}>
      <div
        className={`h-15 flex items-center gap-3 p-3 rounded-2xl cursor-pointer relative ${
          isActive ? "bg-blue-100" : "hover:bg-gray-100"
        }`}
        onClick={onClick}
        onMouseEnter={handleConversationEnter}
        onMouseLeave={handleConversationLeave}
      >
        <img
          src={avatar || "/placeholder.svg"}
          alt={name}
          className="w-14 h-14 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0 pl-3">
          <h3 className="font-medium text-sm text-left">{name}</h3>
          <p className="text-sm text-gray-500 truncate text-left">{message}</p>
        </div>

        {!showDropdown && <span className="text-sm text-gray-400">{time}</span>}

        {showDropdown && (
          <div
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            {activeTab === "messages" || activeTab === "requests" ? (
              <ContactCardDropdown
                onViewInfo={() =>
                  (window.location.href = "/friend-information")
                }
                onCategoryChange={(category) =>
                  console.log("Category changed:", category)
                }
                onSetNickname={() => console.log("Set nickname")}
                onDelete={() => console.log("Delete contact")}
              />
            ) : (
              <GroupCardDropdown
                onViewInfo={() => console.log("View info")}
                onCategoryChange={(category) =>
                  console.log("Category changed:", category)
                }
                onLeaveGroup={() => console.log("Leave group")}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
