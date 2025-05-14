/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";

export function ClassifyDropdown({ selectedIds = [], onSelect, onManage }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const classifies = useSelector((state) => state.chat.classifies || []);

  const toggleSelect = (id) => {
    const newSelected = selectedIds.includes(id)
      ? selectedIds.filter((c) => c !== id)
      : [...selectedIds, id];
    onSelect(newSelected);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left z-[100]">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center px-3 py-2 text-sm rounded outline-none"
      >
        Classify <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-64 bg-white shadow-lg rounded p-3 space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">
              By classify tag
            </p>
            {Array.isArray(classifies) &&
              classifies.map((item) => (
                <label
                  key={item._id}
                  className="flex items-center space-x-2 cursor-pointer py-1"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item._id)}
                    onChange={() => toggleSelect(item._id)}
                    className="w-4 h-4 rounded border border-gray-400 bg-white appearance-none
                      checked:bg-blue-600 checked:border-blue-600 relative cursor-pointer
                      after:content-['✔'] after:absolute after:top-[1px] after:left-[3px]
                      after:text-white after:text-xs after:font-bold after:opacity-0
                      checked:after:opacity-100"
                  />
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color?.code || "#ccc" }}
                  ></span>
                  <span>{item.name}</span>
                </label>
              ))}
          </div>

          <div className="pt-2 border-t">
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => {
                onManage();
                setOpen(false);
              }}
            >
              Manage
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
