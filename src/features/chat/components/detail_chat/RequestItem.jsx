/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { FaCheck, FaTimes } from "react-icons/fa";

export default function RequestItem({ members, onAccept, onReject }) {
  return (
    <div>
      {members.map((member) => (
        <div
          key={member._id}
          className="relative flex items-center justify-between gap-2 p-2 cursor-pointer hover:bg-[#F0F0F0] rounded-[10px]"
        >
          <div className="flex items-center gap-2">
            <img
              src={member.avatar}
              alt="icon"
              className="w-12 h-12 rounded-full"
            />
            <p className="text-sm font-medium">{member.name}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onAccept(member)}
              className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
            >
              <FaCheck className="text-white" />
            </button>
            <button
              onClick={() => onReject(member)}
              className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
            >
              <FaTimes className="text-white" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
