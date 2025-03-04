/* eslint-disable react/prop-types */
import Avatar from "@assets/chat/avatar.png";

export default function MemberItem({ members }) {
  return (
    <div>
      {members.map((member, index) => (
        <div
          key={index}
          className="flex items-center gap-2 p-2 cursor-pointer hover:bg-[#F0F0F0] rounded-[10px]"
        >
          <img src={Avatar} alt="icon" className="w-12 h-12 rounded-full" />
          <div>
            <p className="text-sm font-medium">{member.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
