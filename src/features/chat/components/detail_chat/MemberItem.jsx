/* eslint-disable react/prop-types */
import Avatar from "@assets/chat/avatar.png";
import { useState } from "react";
import { MoreVertical, UserPlus, MessageSquare, Trash2 } from "lucide-react";
import { Dropdown, DropdownItem } from "@ui/dropdown";
export default function MemberItem({
  members,
  onAddFriend,
  onMessage,
  onRemove,
}) {
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  return (
    <div>
      {members.map((member) => (
        <div
          key={member.id}
          className="relative flex items-center justify-between gap-2 p-2 cursor-pointer hover:bg-[#F0F0F0] rounded-[10px]"
        >
          <div className="flex items-center gap-2">
            <img src={Avatar} alt="icon" className="w-12 h-12 rounded-full" />
            <p className="text-sm font-medium">{member.name}</p>
          </div>

          {/* Nút mở menu */}
          <button
            onClick={() => toggleDropdown(member.id)}
            className="p-1 bg-transparent border-none rounded-md hover:bg-gray-200"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Dropdown menu */}
          <Dropdown
            isOpen={openDropdownId === member.id}
            onClose={() => setOpenDropdownId(null)}
          >
            <DropdownItem icon={UserPlus} onClick={() => onAddFriend(member)}>
              Kết bạn
            </DropdownItem>
            <DropdownItem
              icon={MessageSquare}
              onClick={() => onMessage(member)}
            >
              Nhắn tin
            </DropdownItem>
            <DropdownItem icon={Trash2} onClick={() => onRemove(member)}>
              Xóa khỏi nhóm
            </DropdownItem>
          </Dropdown>
        </div>
      ))}
    </div>
  );
}
