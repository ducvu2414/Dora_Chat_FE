/* eslint-disable react/prop-types */
import { Modal } from "@/components/ui/modal";
import { motion } from "framer-motion";
import { Check, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { Spinner } from "@/page/Spinner";
import AddUser from "@assets/chat/add_user.svg";
import ArrowRight from "@assets/chat/arrow_right.svg";
import Avatar from "@assets/chat/avatar.png";
import Bell from "@assets/chat/bell.svg";
import CheckDecentraliza from "@assets/chat/check_icon.svg";
import Decentraliza from "@assets/chat/decentraliza.svg";
import Dissolve from "@assets/chat/dissolve_icon.svg";
import File from "@assets/chat/file_detail.svg";
import Leave from "@assets/chat/leave_icon.svg";
import Link from "@assets/chat/link_detail.svg";
import MarkChat from "@assets/chat/mark_chat.svg";
import Member from "@assets/chat/member.svg";
import Picture from "@assets/chat/picture_detail.svg";
import Setting from "@assets/chat/setting_group.svg";
import Trash from "@assets/chat/trash_icon.svg";
import FileList from "./detail_chat/FileList";
import LinkList from "./detail_chat/LinkList";
import PictureList from "./detail_chat/PictureList";
import UserSelectionModal from "./UserSelectionModal";
import friendApi from "@/api/friend";
import memberApi from "@/api/member";
import conversationApi from "@/api/conversation";
import {ChooseModal} from "@/components/ui/choose-modal";

export default function MainDetail({ handleSetActiveTab, conversation }) {
  const [isOpenAddUser, setIsOpenAddUser] = useState(false);
  const [isOpenUser, setIsOpenUser] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isOpenSetting, setIsOpenSetting] = useState(false);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantityMember, setQuantityMember] = useState(0);
  const [members, setMembers] = useState([]);
  const [memberLoginNow, setMemberLoginNow] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (conversation.type) setName(conversation.name);
    else
      setName(
        conversation.members?.find(
          (member) => member.userId !== conversation._id
        )?.name || ""
      );
  }, [
    conversation.name,
    conversation.members,
    conversation._id,
    conversation.type,
  ]);

  useEffect(() => {
    setIsMuted(conversation.mute);
  }, [conversation.mute]);

  const handleSubmit = async (selectedUserIds) => {
    try {
      const responseAddMembers = await conversationApi.addMembersToConversation(
        conversation._id,
        selectedUserIds
      );
      console.log("Selected user IDs:", responseAddMembers);
    } catch (error) {
      console.error("Error forwarding message:", error);
      alert("You do not have permission to add members to this group");
    }
  };

  const handleDecentralize = async (selectedUserId) => {
    try {
      setIsOpenUser(false);
      const responseTransferAdmin = await conversationApi.transferAdmin(
        conversation._id,
        selectedUserId[0]
      );
      console.log("Selected user IDs:", responseTransferAdmin);
    } catch (error) {
      console.error("Error forwarding message:", error);
      alert("You do not have permission to decentralize in this group");
    }
  };

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const response = await friendApi.fetchFriends();

        const friendsData = [];
        response.forEach(async (friend) => {
          console.log(conversation._id, friend._id);
          if (!(await memberApi.isMember(conversation._id, friend._id)).data) {
            friendsData.push({
              id: friend._id,
              name: friend.name,
              avatar: friend.avatar,
            });
          }
        });
        const membersInGroup = await memberApi.getMembers(conversation._id);
        const memberLoginNow = await memberApi.getByConversationIdAndUserId(
          conversation._id,
          JSON.parse(localStorage.getItem("user"))._id
        );
        setMemberLoginNow(memberLoginNow.data);
        const membersInGroupFilter = membersInGroup.data.filter(
          (member) => member._id !== memberLoginNow.data._id
        );
        setMembers(
          membersInGroupFilter.map((member) => ({
            id: member._id,
            name: member.name,
            avatar: member.avatar,
            active: member.active,
          }))
        );
        // quantity member
        setQuantityMember(
          membersInGroup.data.reduce((acc, member) => {
            if (member.active) {
              acc += 1;
            }
            return acc;
          }, 0)
        );
        setFriends(friendsData);
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, [conversation._id]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      setIsEditing(false);
      const responseName = await conversationApi.updateGroupName(
        conversation._id,
        name
      );
      setName(responseName.name);
    } catch {
      alert("You do not have permission to change the group name");
      setName(conversation.name);
    }
  };
  const handleDeleteChat = async () => {
    try {
      await conversationApi.deleteConversationBeforetime(conversation._id);
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };
  const handleLeaveChat = async () => {
    try {
      await conversationApi.leaveConversation(conversation._id);
    } catch (error) {
      console.error("Error leaving chat:", error);
    }
  };

  return (
    <>
      {/* kha */}
      <Modal
        isOpen={isOpenAddUser}
        onClose={() => setIsOpenAddUser(false)}
        title="Add member"
      >
        {loading ? (
          <div className="flex justify-center my-8">
            <Spinner />
          </div>
        ) : (
          <UserSelectionModal onSubmit={handleSubmit} users={friends} />
        )}
      </Modal>
      <Modal
        isOpen={isOpenAddUser}
        onClose={() => setIsOpenAddUser(false)}
        title="Add member"
      >
        {loading ? (
          <div className="flex justify-center my-8">
            <Spinner />
          </div>
        ) : (
          <UserSelectionModal onSubmit={handleSubmit} users={friends} />
        )}
      </Modal>
      <Modal
        isOpen={isOpenUser}
        onClose={() => setIsOpenUser(false)}
        title="Choose a new team leader before leaving"
      >
        {loading ? (
          <div className="flex justify-center my-8">
            <Spinner />
          </div>
        ) : (
          (console.log("members", members),
          (
            <UserSelectionModal
              buttonText={"Confirm"}
              onSubmit={handleDecentralize}
              users={members}
            />
          ))
        )}
      </Modal>
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-[#086DC0]">Details</p>
        <div className="flex items-center">
          {conversation.type ? (
            <>
              <div
                onClick={() => setIsOpenAddUser(true)}
                className="flex items-center justify-center bg-white rounded-full cursor-pointer w-9 h-9 hover:opacity-75"
              >
                <img src={AddUser} />
              </div>
            </>
          ) : (
            <></>
          )}

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
        <div
          className="flex items-center w-full mt-5 border-b border-[#E7E7E7] pb-5 cursor-pointer"
          onClick={() => setIsMuted(!isMuted)}
        >
          <div className="flex items-center justify-center w-[26px] bg-white rounded-full h-[26px]">
            <img src={Bell} />
          </div>
          <p className="text-[#086DC0] ml-2">Mute messages</p>
          <div
            className={`relative right-2 w-11 h-6 rounded-full cursor-pointer transition-all self-end ml-auto  ${
              isMuted ? "bg-gray-400" : "bg-[#086DC0]"
            }`}
            onClick={() => setIsMuted(!isMuted)}
          >
            <div
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                isMuted ? "translate-x-5" : "translate-x-0"
              }`}
            ></div>
          </div>
        </div>
        {conversation.type ? (
          <div
            className="flex items-center w-full mt-3 cursor-pointer"
            onClick={() => handleSetActiveTab({ tab: "members" })}
          >
            <div className="flex items-center justify-center w-[26px] bg-white rounded-full h-[26px]">
              <img src={Member} />
            </div>
            <p className="text-[#086DC0] ml-2">Member ({quantityMember})</p>
            <div className="w-[30px] h-[30px] rounded-[9px] cursor-pointer ml-auto mr-1 bg-white flex items-center justify-center hover:opacity-75">
              <img src={ArrowRight} />
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="w-full mt-3">
          <div
            className="flex items-center cursor-pointer"
            onClick={() =>
              handleSetActiveTab({
                tab: "media",
                media: "photos/videos",
              })
            }
          >
            <div className="flex items-center justify-center w-[26px] bg-white rounded-full h-[26px]">
              <img src={Picture} />
            </div>
            <p className="text-[#086DC0] ml-2">Photo/videos (125)</p>
            <div className="w-[30px] h-[30px] rounded-[9px] cursor-pointer ml-auto mr-1 bg-white flex items-center justify-center hover:opacity-75">
              <img src={ArrowRight} />
            </div>
          </div>
          <PictureList limit={6} />
        </div>
        <div className="w-full mt-3">
          <div
            className="flex items-center cursor-pointer"
            onClick={() =>
              handleSetActiveTab({
                tab: "media",
                media: "files",
              })
            }
          >
            <div className="flex items-center justify-center w-[26px] bg-white rounded-full h-[26px]">
              <img src={File} />
            </div>
            <p className="text-[#086DC0] ml-2">Files (3)</p>
            <div className="w-[30px] h-[30px] rounded-[9px] cursor-pointer ml-auto mr-1 bg-white flex items-center justify-center hover:opacity-75">
              <img src={ArrowRight} />
            </div>
          </div>
          <FileList limit={3} />
        </div>
        <div className="w-full mt-3">
          <div
            className="flex items-center cursor-pointer"
            onClick={() =>
              handleSetActiveTab({
                tab: "media",
                media: "links",
              })
            }
          >
            <div className="flex items-center justify-center w-[26px] bg-white rounded-full h-[26px]">
              <img src={Link} />
            </div>
            <p className="text-[#086DC0] ml-2">Link</p>
            <div className="w-[30px] h-[30px] rounded-[9px] cursor-pointer ml-auto mr-1 bg-white flex items-center justify-center hover:opacity-75">
              <img src={ArrowRight} />
            </div>
          </div>
          <LinkList limit={3} />
        </div>
        <div className="w-full mt-3">
          {/* Header */}
          {conversation.type &&
          conversation.leaderId === memberLoginNow?._id ? (
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setIsOpenSetting(!isOpenSetting)}
            >
              <div className="flex items-center justify-center w-[26px] h-[26px] bg-white rounded-full">
                <img src={Setting} />
              </div>
              <p className="text-[#086DC0] ml-2">Administration</p>
              <div className="w-[30px] h-[30px] rounded-[9px] cursor-pointer ml-auto mr-1 bg-white flex items-center justify-center hover:opacity-75">
                <motion.img
                  src={ArrowRight}
                  animate={{ rotate: isOpenSetting ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>
          ) : (
            <></>
          )}

          {/* Danh sách xổ xuống */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: isOpenSetting ? "auto" : 0,
              opacity: isOpenSetting ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="px-4 mt-2 overflow-hidden"
          >
            <div className="flex items-center p-1 mt-1 cursor-pointer hover:opacity-75">
              <img
                src={CheckDecentraliza}
                className="w-[18px] h-[18px] rounded-full bg-white p-[3px]"
                alt="Icon"
              />
              <p className="text-[#F49300] font-bold text-sm ml-1">
                {"Approve members (2)"}
              </p>
            </div>
            <div
              className="flex items-center p-1 mt-1 cursor-pointer hover:opacity-75"
              onClick={() => setIsOpenUser(true)}
            >
              <img
                src={Decentraliza}
                className="w-[18px] h-[18px] rounded-full bg-white p-[3px]"
                alt="Icon"
              />
              <p className="text-[#F49300] font-bold text-sm ml-1">
                {"Decentralize"}
              </p>
            </div>
            <ChooseModal
              isOpen={isConfirmModalOpen}
              onClose={() => setIsConfirmModalOpen(false)}
              onConfirm={() => {
                // Handle confirmation action
                console.log("User confirmed the action");
              }}
              title="Delete Conversation"
              message="Are you sure you want to delete this conversation? This action cannot be undone."
              confirmText="Delete"
              cancelText="Keep"
              confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
            />
            <div className="flex items-center p-1 mt-1 cursor-pointer hover:opacity-75" onClick={() => setIsConfirmModalOpen(true)}>
              <img
                src={Dissolve}
                className="w-[18px] h-[18px] rounded-full bg-white p-[3px]"
                alt="Icon"
              />
              <p className="text-[#F49300] font-bold text-sm ml-1">
                {"Disband"}
              </p>
            </div>
          </motion.div>
        </div>
        <div className="w-full mt-[18px] flex items-center justify-center gap-4">
          {conversation.type ? (
            <>
              <button className="flex items-center px-5 py-2 bg-white cursor-pointer hover:opacity-75 rounded-2xl">
                <img src={Trash} alt="trash" />
                <span className="text-[#086DC0]  text-xs ml-2">Delete</span>
              </button>
              <button className="flex items-center px-5 py-2 bg-white cursor-pointer hover:opacity-75 rounded-2xl">
                <img src={Leave} alt="leave" />
                <span className="text-[#086DC0]  text-xs ml-2">Leave</span>
              </button>
            </>
          ) : (
            <>
              <button
                className="flex items-center px-5 py-2 bg-white cursor-pointer hover:opacity-75 rounded-2xl"
                onClick={handleDeleteChat}
              >
                <img src={Trash} alt="trash" />
                <span className="text-[#086DC0]  text-xs ml-2">Delete</span>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
