/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { MoreVertical, UserPlus, MessageSquare, Trash2 } from "lucide-react";
import { Dropdown, DropdownItem } from "@ui/dropdown";
import InfoContent from "@components/ui/Info/InfoContent";
import { Modal } from "@/components/ui/modal";

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
  const [showInfo, setShowInfo] = useState(false);
  const [info, setInfo] = useState(null);

  const handleShowInfo = (id) => {
    setShowInfo(!showInfo);
    setInfo(id);
  };

  const usePositionCheck = () => {
    const [position, setPosition] = useState("bottom");
    const ref = useRef(null);

    const checkPosition = () => {
      if (!ref.current || typeof window === "undefined") return;

      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 150; // Ước lượng chiều cao dropdown 130px

      setPosition(spaceBelow < dropdownHeight ? "top" : "bottom");
    };

    return [ref, position, checkPosition];
  };

  return (
    <div>
      {showInfo && (
        <Modal
          onClose={handleShowInfo}
          isOpen={showInfo}
          title={"Thông tin tài khoản"}
        >
          <InfoContent info={info} />
        </Modal>
      )}
      {members.map((member) => {
        const [dropdownRef, dropdownPosition, checkPosition] =
          usePositionCheck();

        return (
          <div
            key={member._id}
            ref={dropdownRef}
            onClick={() => handleShowInfo(member._id)}
            className="relative flex items-center  justify-between gap-2 p-2 cursor-pointer hover:bg-[#F0F0F0] rounded-[10px]"
          >
            <div className="flex items-center gap-2">
              <img src={member.avatar} alt="icon" className="w-12 h-12 rounded-full" />
              <p className="text-sm font-medium">{member.name}</p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                checkPosition();
                toggleDropdown(member._id);
              }}
              className="p-1 bg-transparent border-none rounded-md hover:bg-gray-200"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Dropdown menu */}
            <Dropdown
              isOpen={openDropdownId === member._id}
              onClose={() => setOpenDropdownId(null)}
              align="left"
              verticalAlign={dropdownPosition}
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
        );
      })}
    </div>
  );
}
