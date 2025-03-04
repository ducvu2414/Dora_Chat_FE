/* eslint-disable react/prop-types */
import ArrowRight from "@assets/chat/arrow_right.svg";
import MemberItem from "./MemberItem";

const members = [
  { id: "1", name: "THành lồng" },
  { id: "2", name: "Huyền lồng" },
  { id: "3", name: "Tâm Lon" },
  { id: "4", name: "Quang Lồng" },
  { id: "5", name: "Tâm Lon" },
  { id: "6", name: "Quang Lồng" },
  { id: "7", name: "Tâm Lon" },
  { id: "8", name: "Quang Lồng" },
  { id: "9", name: "Tâm Lon" },
  { id: "10", name: "Quang Lồng" },
  { id: "11", name: "Tâm Lon" },
  { id: "12", name: "Quang Lồng" },
  { id: "231", name: "Tâm Lon" },
  { id: "421", name: "Quang Lồng" },
  { id: "33132", name: "Tâm Lon" },
  { id: "4214", name: "Quang Lồng" },
  { id: "3214", name: "Tâm Lon" },
  { id: "4341", name: "Quang Lồng" },
  { id: "31341", name: "Tâm Lon" },
  { id: "413411", name: "Quang Lồng" },
];
const handleAddFriend = (member) => {
  alert(`Gửi lời mời kết bạn đến ${member.name}`);
};

const handleMessage = (member) => {
  alert(`Chuyển đến tin nhắn của ${member.name}`);
};

const handleRemove = (member) => {
  alert(`Đã xóa ${member.name} khỏi nhóm`);
};

export default function MemberList({ onBack }) {
  return (
    <div>
      <div className="flex items-center mb-4">
        <div
          onClick={onBack}
          className="flex items-center justify-center w-8 h-8 bg-white rounded-md cursor-pointer hover:opacity-75"
        >
          <img src={ArrowRight} className="rotate-180" />
        </div>
        <p className="text-lg font-bold text-[#086DC0] ml-2">Members (6)</p>
      </div>
      <div className="mt-4 overflow-auto h-[calc(100vh-7rem)]">
        <MemberItem
          members={members}
          onAddFriend={handleAddFriend}
          onMessage={handleMessage}
          onRemove={handleRemove}
        />
      </div>
    </div>
  );
}
