/* eslint-disable react/prop-types */
import ArrowRight from "@assets/chat/arrow_right.svg";
import MemberItem from "./MemberItem";

const members = [
  { id: "1", name: "THành lồng" },
  { id: "2", name: "Huyền lồng" },
  { id: "3", name: "Tâm Lon" },
  { id: "4", name: "Quang Lồng" },
];

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
        <p className="text-lg font-bold text-[#086DC0] ml-2">Media storage</p>
      </div>
      <div className="mt-4 overflow-auto h-[calc(100vh-185px)]">
        <MemberItem members={members} />
      </div>
    </div>
  );
}
