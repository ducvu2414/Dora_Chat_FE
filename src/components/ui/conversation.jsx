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
//       <img src={avatar || "/placeholder.svg"} alt={name} className="object-cover rounded-full w-14 h-14" />
//       <div className="flex-1 min-w-0 pl-1">
//         <h3 className="text-sm font-medium text-left">{name}</h3>
//         <p className="text-sm text-left text-gray-500 truncate">{message}</p>
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

import { useState, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import ContactCardDropdown from "@/components/ui/Contact/ContactCardDropdown";
import GroupCardDropdown from "@/components/ui/Contact/GroupCardDropdown";

export function Conversation({
  onClick,
  idUser,
  isActive,
  activeTab,
  avatar,
  members,
  name,
  lastMessageId,
  time,
  id, // Add id parameter to support proper routing
  unread,
}) {
  const [isConversationHovered, setIsConversationHovered] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();

  const showDropdown = isConversationHovered || isDropdownHovered;

  const handleConversationEnter = () => {
    startTransition(() => {
      setIsConversationHovered(true);
    });
  };

  const handleConversationLeave = () => {
    setTimeout(() => {
      if (!isDropdownHovered) {
        startTransition(() => {
          setIsConversationHovered(false);
        });
      }
    }, 100);
  };

  const handleDropdownEnter = () => {
    startTransition(() => {
      setIsDropdownHovered(true);
    });
  };

  const handleDropdownLeave = () => {
    startTransition(() => {
      setIsDropdownHovered(false);
      if (!isConversationHovered) {
        setIsConversationHovered(false);
      }
    });
  };

  const handleViewInfo = () => {
    startTransition(() => {
      navigate("/friend-information");
    });
  };

  const handleClick = (e) => {
    if (isDropdownHovered) {
      return;
    }

    if (onClick) {
      startTransition(() => {
        onClick(e);
      });
    } else if (id) {
      // If no onClick provided but we have an ID, navigate to chat
      startTransition(() => {
        navigate(`/chat/${id}`);
      });
    }
  };
  const partner =
    name ||
    members?.filter((member) => {
      return member.userId !== idUser;
    });
  const avatarMessage = avatar || partner?.[0].avatar;
  return (
    <div className="relative" style={{ zIndex: showDropdown ? 500 : 0 }}>
      <div
        className={`h-15 flex items-center gap-3 p-3 rounded-2xl cursor-pointer relative ${
          isActive ? "bg-blue-100" : "hover:bg-gray-100"
        } ${isPending ? "opacity-70" : ""}`}
        onClick={handleClick}
        onMouseEnter={handleConversationEnter}
        onMouseLeave={handleConversationLeave}
      >
        <img
          src={avatarMessage || "/placeholder.svg"}
          alt={name}
          className="object-cover rounded-full w-14 h-14"
        />
        <div className="flex-1 min-w-0 pl-3">
          <div className="relative flex items-center justify-between">
            <h3 className="text-sm font-medium text-left truncate">
              {name ? name : partner[0].name}
            </h3>
            {unread > 0 && (
              <span className="absolute top-0 -left-10 ml-2 min-w-[20px] h-[20px] px-1 flex items-center justify-center text-xs font-semibold text-white bg-red-500 rounded-full shadow">
                {unread > 99 ? "99+" : unread}
              </span>
            )}
          </div>
          <p className="text-sm text-left text-gray-500 truncate">
            {lastMessageId?.content}
          </p>
        </div>

        {!showDropdown && <span className="text-sm text-gray-400">{time}</span>}

        {showDropdown && (
          <div
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            {activeTab === "messages" || activeTab === "requests" ? (
              <ContactCardDropdown
                onViewInfo={handleViewInfo}
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
