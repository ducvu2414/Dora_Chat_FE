import AddUser from "@assets/chat/add_user.svg";
import ArrowRight from "@assets/chat/arrow_right.svg";
import Avatar from "@assets/chat/avatar.png";
import Bell from "@assets/chat/bell.svg";
import File from "@assets/chat/file_detail.svg";
import Link from "@assets/chat/link_detail.svg";
import MarkChat from "@assets/chat/mark_chat.svg";
import Member from "@assets/chat/member.svg";
import Picutre from "@assets/chat/picture_detail.svg";
import Setting from "@assets/chat/setting_group.svg";
import { Check, Pencil } from "lucide-react";
import { useState } from "react";
import PictureList from "./detail_chat/PictureList";
import FileList from "./detail_chat/FileList";
export default function MainDetail() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("John Doe");
  const [isMuted, setIsMuted] = useState(false);
  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleSaveClick = () => {
    setIsEditing(false);
  };
  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-[#086DC0]">Details</p>
        <div className="flex items-center">
          <div className="flex items-center justify-center bg-white rounded-full cursor-pointer w-9 h-9 hover:opacity-75">
            <img src={AddUser} />
          </div>
          <div className="flex items-center justify-center ml-2 bg-white rounded-full cursor-pointer w-9 h-9 hover:opacity-75">
            <img src={MarkChat} />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center mt-4 overflow-y-auto h-[calc(100%-3rem)]">
        <img src={Avatar} className="w-16 h-16 rounded-full" alt="Avatar" />
        <div className="flex items-center gap-2 mt-1">
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-2 py-1 bg-transparent outline-none border-b border-[#086DC0] text-[#959595F3] w-32"
            />
          ) : (
            <p className="text-xl font-semibold text-[#086DC0]">{name}</p>
          )}
          {isEditing ? (
            <Check
              className="w-4 h-4 text-green-500 cursor-pointer hover:text-green-700"
              onClick={handleSaveClick}
            />
          ) : (
            <Pencil
              className="w-4 h-4 text-[#086DC0] cursor-pointer hover:text-blue-500"
              onClick={handleEditClick}
            />
          )}
        </div>
        <div className="flex items-center w-full mt-5 border-b border-[#E7E7E7] pb-5">
          <div className="flex items-center justify-center w-[26px] bg-white rounded-full h-[26px]">
            <img src={Bell} />
          </div>
          <p className="text-[#086DC0] ml-2">Mute messages</p>
          <div
            className={`relative w-11 h-5 rounded-full cursor-pointer transition-all self-end ml-auto  ${
              isMuted ? "bg-gray-400" : "bg-[#086DC0]"
            }`}
            onClick={() => setIsMuted(!isMuted)}
          >
            <div
              className={`absolute top-0.5 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                isMuted ? "translate-x-5" : "translate-x-0"
              }`}
            ></div>
          </div>
        </div>
        <div className="flex items-center w-full mt-3">
          <div className="flex items-center justify-center w-[26px] bg-white rounded-full h-[26px]">
            <img src={Member} />
          </div>
          <p className="text-[#086DC0] ml-2">Members (3)</p>
          <div className="w-[30px] h-[30px] rounded-[9px] cursor-pointer ml-auto mr-1 bg-white flex items-center justify-center hover:opacity-75">
            <img src={ArrowRight} />
          </div>
        </div>
        <div className="w-full mt-3">
          <div className="flex items-center ">
            <div className="flex items-center justify-center w-[26px] bg-white rounded-full h-[26px]">
              <img src={Picutre} />
            </div>
            <p className="text-[#086DC0] ml-2">Photo/videos (125)</p>
            <div className="w-[30px] h-[30px] rounded-[9px] cursor-pointer ml-auto mr-1 bg-white flex items-center justify-center hover:opacity-75">
              <img src={ArrowRight} />
            </div>
          </div>
          <PictureList />
        </div>
        <div className="w-full mt-3">
          <div className="flex items-center w-full mt-3">
            <div className="flex items-center justify-center w-[26px] bg-white rounded-full h-[26px]">
              <img src={File} />
            </div>
            <p className="text-[#086DC0] ml-2">Files (3)</p>
            <div className="w-[30px] h-[30px] rounded-[9px] cursor-pointer ml-auto mr-1 bg-white flex items-center justify-center hover:opacity-75">
              <img src={ArrowRight} />
            </div>
          </div>
          <FileList />
        </div>
        <div className="flex items-center w-full mt-3">
          <div className="flex items-center justify-center w-[26px] bg-white rounded-full h-[26px]">
            <img src={Link} />
          </div>
          <p className="text-[#086DC0] ml-2">Link</p>
          <div className="w-[30px] h-[30px] rounded-[9px] cursor-pointer ml-auto mr-1 bg-white flex items-center justify-center hover:opacity-75">
            <img src={ArrowRight} />
          </div>
        </div>
        <div className="flex items-center w-full mt-3">
          <div className="flex items-center justify-center w-[26px] bg-white rounded-full h-[26px]">
            <img src={Setting} />
          </div>
          <p className="text-[#086DC0] ml-2">Quyền quản trị</p>
          <div className="w-[30px] h-[30px] rounded-[9px] cursor-pointer ml-auto mr-1 bg-white flex items-center justify-center hover:opacity-75">
            <img src={ArrowRight} />
          </div>
        </div>
      </div>
    </>
  );
}
