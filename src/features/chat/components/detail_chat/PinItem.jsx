/* eslint-disable react/prop-types */
import { useState, useRef, useCallback } from "react";
import { MoreVertical, Trash2, Paperclip } from "lucide-react";
import { Dropdown, DropdownItem } from "@ui/dropdown";

export default function PinItem({ pinMessages, onRemove }) {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPositions, setDropdownPositions] = useState({});
  const dropdownRefs = useRef({});

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const checkPosition = useCallback((id) => {
    const ref = dropdownRefs.current[id];
    if (!ref || typeof window === "undefined") return;

    const rect = ref.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = 150;

    setDropdownPositions((prev) => ({
      ...prev,
      [id]: spaceBelow < dropdownHeight ? "top" : "bottom",
    }));
  }, []);

  const setRef = useCallback((id, element) => {
    if (element) {
      dropdownRefs.current[id] = element;
    }
  }, []);

  function formatPinTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div>
      {pinMessages.map((pinMessage) => (
        <div
          key={pinMessage._id}
          ref={(el) => setRef(pinMessage._id, el)}
          onClick={() => console.log(pinMessage._id)}
          className="relative flex items-center justify-between gap-3 p-3 cursor-pointer hover:bg-[#F0F0F0] rounded-[10px] transition-colors duration-200"
        >
          {/* Main content */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <img
              src={pinMessage.pinnedBy.avatar}
              alt="user avatar"
              className="w-10 h-10 rounded-full flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <p className="text-sm font-semibold truncate">
                  {pinMessage.pinnedBy.name}
                </p>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {formatPinTime(pinMessage.pinnedAt)}
                </span>
              </div>

              <p className="text-sm text-gray-800 mt-1 truncate">
                {pinMessage.content}
              </p>

              {pinMessage.type === "FILE" && (
                <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                  <Paperclip className="w-3 h-3" />
                  <span>Attachment</span>
                </div>
              )}
            </div>
          </div>

          {/* More options button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              checkPosition(pinMessage._id);
              toggleDropdown(pinMessage._id);
            }}
            className="p-1 rounded-md hover:bg-gray-200 self-start"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>

          {/* Dropdown menu */}
          <Dropdown
            isOpen={openDropdownId === pinMessage._id}
            onClose={() => setOpenDropdownId(null)}
            align="left"
            verticalAlign={dropdownPositions[pinMessage._id] || "bottom"}
          >
            <DropdownItem
              icon={Trash2}
              onClick={() => {
                console.log(pinMessage);
                onRemove(pinMessage);
              }}
            >
              Delete pin
            </DropdownItem>
          </Dropdown>
        </div>
      ))}
    </div>
  );
}
