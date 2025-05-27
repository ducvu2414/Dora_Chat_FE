/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import { Dropdown, DropdownItem } from "@ui/dropdown";
import InfoContent from "@components/ui/Info/InfoContent";
import { Modal } from "@/components/ui/modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import memberApi from "@/api/member";

function usePositionCheck() {
  const [position, setPosition] = useState("bottom");
  const ref = useRef(null);

  const checkPosition = () => {
    if (!ref.current || typeof window === "undefined") return;
    const rect = ref.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = 150;
    setPosition(spaceBelow < dropdownHeight ? "top" : "bottom");
  };

  return [ref, position, checkPosition];
}

function MemberRow({
  member,
  onRemove,
  leader,
  managers,
  toggleDropdown,
  openDropdownId,
}) {
  const [dropdownRef, dropdownPosition, checkPosition] = usePositionCheck();

  return (
    <div
      ref={dropdownRef}
      onClick={() => toggleDropdown("info", member._id)}
      className="relative flex items-center justify-between gap-2 p-2 cursor-pointer hover:bg-[#F0F0F0] rounded-[10px]"
    >
      {member._id === leader && (
        <FontAwesomeIcon
          icon={faCrown}
          size="xs"
          style={{ color: "#FFD43B" }}
          className="absolute left-2 top-2 bg-white rounded-full p-[1px]"
        />
      )}
      {member._id !== leader && managers.includes(member._id) && (
        <FontAwesomeIcon
          icon={faCrown}
          size="xs"
          style={{ color: "#ebe9e6" }}
          className="absolute left-2 top-2 bg-white rounded-full p-[1px]"
        />
      )}
      <div className="flex items-center gap-2">
        <img
          src={member.avatar}
          alt="icon"
          className="w-12 h-12 rounded-full"
        />
        <p className="text-sm font-medium">{member.name}</p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          checkPosition();
          toggleDropdown("menu", member._id);
        }}
        className="p-1 bg-transparent border-none rounded-md hover:bg-gray-200"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      <Dropdown
        isOpen={openDropdownId === member._id}
        onClose={() => toggleDropdown("close")}
        align="left"
        verticalAlign={dropdownPosition}
      >
        <DropdownItem
          icon={Trash2}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(member);
            toggleDropdown("close");
          }}
        >
          Remove from group
        </DropdownItem>
      </Dropdown>
    </div>
  );
}

export default function MemberItem({ members, onRemove, managers, leader }) {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [info, setInfo] = useState(null);
  const [resolvedMembers, setResolvedMembers] = useState([]);

  useEffect(() => {
    const fetchMembersIfNeeded = async () => {
      // Nếu mảng là object (có ._id) → dùng luôn
      if (members.length > 0 && typeof members[0] === "object") {
        setResolvedMembers(members);
        return;
      }

      // Ngược lại: là mảng string ID → gọi API từng người
      if (members.length > 0 && typeof members[0] === "string") {
        try {
          const fetches = await Promise.all(
            members.map((id) => memberApi.getByMemberId(id))
          );

          const mappedMembers = fetches.map((res) => res.data || res); // phòng trường hợp API bọc trong .data
          setResolvedMembers(mappedMembers);
        } catch (error) {
          console.error("Error fetching member details:", error);
        }
      }
    };

    fetchMembersIfNeeded();
  }, [members]);

  const toggleDropdown = (type, id = null) => {
    if (type === "menu") {
      setOpenDropdownId(openDropdownId === id ? null : id);
    } else if (type === "info") {
      setShowInfo(!showInfo);
      setInfo(id);
    } else {
      setOpenDropdownId(null);
    }
  };

  return (
    <div>
      {showInfo && (
        <Modal onClose={toggleDropdown} isOpen={showInfo} title={"Information"}>
          <InfoContent info={info} />
        </Modal>
      )}
      {resolvedMembers.map((member) => {
        if (!member._id) return null;
        return (
          <MemberRow
            key={member._id}
            member={member}
            onRemove={onRemove}
            leader={leader}
            managers={managers}
            toggleDropdown={toggleDropdown}
            openDropdownId={openDropdownId}
          />
        );
      })}
    </div>
  );
}
