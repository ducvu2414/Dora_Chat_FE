/* eslint-disable react/prop-types */
import { Modal } from "@/components/ui/modal";
import { motion } from "framer-motion";
import { Check, Pencil } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Spinner } from "@/page/Spinner";
import AddUser from "@assets/chat/add_user.svg";
import ArrowRight from "@assets/chat/arrow_right.svg";
import Bell from "@assets/chat/bell.svg";
import CheckDecentraliza from "@assets/chat/check_icon.svg";
import Decentraliza from "@assets/chat/decentraliza.svg";
import ApprovalIcon from "@assets/chat/approval_icon.svg";
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
import cloudinaryApi from "@/api/cloudinary";
import conversationApi from "@/api/conversation";
import { ChooseModal } from "@/components/ui/choose-modal";
import { Button } from "@/components/ui/button";
import { AlertMessage } from "@/components/ui/alert-message";
export default function MainDetail({
  handleSetActiveTab,
  conversation,
  imagesVideos,
  files,
  links,
  pinMessages,
}) {
  const [isOpenAddUser, setIsOpenAddUser] = useState(false);
  const [isOpenUser, setIsOpenUser] = useState(false);
  const [isOpenManager, setIsOpenManager] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenOk, setIsOpenOk] = useState(false);
  const [isConfirmLeave, setIsConfirmLeave] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isOpenSetting, setIsOpenSetting] = useState(false);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [memberLoginNow, setMemberLoginNow] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [memberFilter, setMemberFilter] = useState([]);
  const [isHoverAvatar, setIsHoverAvatar] = useState(false);

  const fileInputRef = useRef(null);
  const [inviteLink, setInviteLink] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const requestCount = conversation.joinRequests.length;
  const partner =
    conversation.name ||
    conversation.members?.filter((member) => {
      return member.userId !== JSON.parse(localStorage.getItem("user"))._id;
    });

  // Set name of conversation
  useEffect(() => {
    if (conversation.type) setName(conversation.name);
    else {
      setName(
        conversation.members?.find(
          (member) =>
            member.userId !== JSON.parse(localStorage.getItem("user"))._id
        )?.name || ""
      );
    }
    setIsEditing(false);
  }, [
    conversation.name,
    conversation.members,
    conversation._id,
    conversation.type,
  ]);

  // Set muted status
  useEffect(() => {
    setIsMuted(conversation.mute);
  }, [conversation.mute]);
  // Hàm toggle phê duyệt thành viên
  const handleToggleJoinApproval = async () => {
    if (!conversation?._id) {
      return;
    }

    const newStatus = !conversation.isJoinFromLink; // Toggle trạng thái

    setIsLoading(true);

    try {
      const response = await conversationApi.toggleJoinApproval(
        conversation._id,
        newStatus
      );

      console.log("response", response);
    } catch (error) {
      console.error("Error toggling join approval:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = async (selectedUserIds) => {
    try {
      const responseAddMembers = await conversationApi.addMembersToConversation(
        conversation._id,
        selectedUserIds
      );
      console.log("Selected user IDs:", responseAddMembers);
      setIsOpenAddUser(false);
    } catch (error) {
      console.error("Error forwarding message:", error);
      AlertMessage({
        type: "error",
        message: "You do not have permission to add members to this group",
      });
    }
  };
  const handleCreateInviteLink = async () => {
    try {
      const res = await conversationApi.createInviteLink(conversation._id);
      setInviteLink(res.inviteLink);
      setCopySuccess(false);
    } catch (error) {
      console.error("Error creating invite link:", error);
      AlertMessage({
        type: "error",
        message: error.response?.data?.message || "Không thể tạo link mời",
      });
    }
  };

  const handleCopyLink = async () => {
    if (inviteLink) {
      try {
        await navigator.clipboard.writeText(inviteLink);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000); // Reset thông báo sau 2s
      } catch (error) {
        console.error("Error copying link:", error);
        AlertMessage({
          type: "error",
          message: error.response?.data?.message || "Không thể sao chép link",
        });
      }
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
      AlertMessage({
        type: "error",
        message: "You do not have permission to decentralize in this group",
      });
    }
  };

  const handleAddManager = async (selectedUserIds) => {
    try {
      setIsOpenManager(false);
      const responseAddManager =
        await conversationApi.addManagersToConversation(
          conversation._id,
          selectedUserIds
        );
      console.log("Selected user IDs:", responseAddManager);
    } catch (error) {
      console.error("Error forwarding message:", error);
      AlertMessage({
        type: "error",
        message: "You do not add manager for this member in group",
      });
    }
  };

  const handleDisband = async () => {
    try {
      setIsOpenUser(false);
      const responseDisband = await conversationApi.disbandGroup(
        conversation._id
      );
      console.log("Selected user IDs:", responseDisband);
    } catch (error) {
      console.error("Error forwarding message:", error);
      AlertMessage({
        type: "error",
        message: "You do not have permission to decentralize in this group",
      });
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
        const memberLoginNow = await memberApi.getByConversationIdAndUserId(
          conversation._id,
          JSON.parse(localStorage.getItem("user"))._id
        );
        const formattedMembers = conversation.members.map((member) => ({
          id: member._id,
          name: member.name,
          avatar: member.avatar,
          active: member.active,
        }));

        setMemberLoginNow(memberLoginNow.data);
        setMemberFilter(
          formattedMembers.filter(
            (member) =>
              member.id !== memberLoginNow.data._id && member.active !== false
          )
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
      if (conversation.type) {
        const responseName = await conversationApi.updateGroupName(
          conversation._id,
          name
        );
        setName(responseName.name);
      } else {
        const responseName = await memberApi.updateName(
          conversation._id,
          conversation.members?.find(
            (member) =>
              member.userId !== JSON.parse(localStorage.getItem("user"))._id
          )?._id,
          name
        );
        setName(responseName.data.name);
      }
    } catch {
      AlertMessage({
        type: "error",
        message: "You do not have permission to change the group name",
      });
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
      if (conversation.type) {
        const isLastMember = conversation.members.length === 1;
        const isLeader = conversation.leaderId === memberLoginNow._id;
        if (isLastMember || !isLeader) {
          setIsConfirmLeave(true);
        } else {
          setIsOpenOk(true);
        }
      }
    } catch (error) {
      console.error("Error leaving chat:", error);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    console.log("e.target.files", e.target.files);
    const file = e.target.files[0];
    if (!file) return;

    // Kiểm tra loại file (chỉ cho phép ảnh)
    if (!file.type.match("image.*")) {
      AlertMessage({
        type: "error",
        message: "Vui lòng chọn file ảnh (JPEG/PNG/WEBP)",
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("id", conversation._id.toString());

    const resAvatar = await cloudinaryApi.uploadImage(formData);
    const url = resAvatar.image.url;
    const resUpdateAvatar = await conversationApi.updateAvatarGroup(
      conversation._id,
      url
    );
    console.log("resUpdateAvatar", resUpdateAvatar);

    e.target.value = "";
  };

  return (
    <>
      {/* kha */}
      <ChooseModal
        isOpen={isOpenOk}
        onClose={() => setIsOpenOk(false)}
        onConfirm={() => setIsOpenOk(false)}
        title="Warning"
        message="Please choose a replacement leader before leaving the group"
        isSingleButton={true}
        confirmButtonClass="bg-green-600 hover:bg-green-700 text-white"
      />
      <ChooseModal
        isOpen={isConfirmLeave}
        onClose={() => setIsConfirmLeave(false)}
        onConfirm={async () => {
          await conversationApi.leaveConversation(conversation._id);
        }}
        title="Warning"
        message="Are you sure you want to leave this group?"
      />
      <ChooseModal
        isOpen={isOpenDelete}
        onClose={() => setIsOpenDelete(false)}
        onConfirm={handleDeleteChat}
        title="Warning"
        message="Are you sure you want to delete this conversation on your side?"
      />
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
          <UserSelectionModal
            buttonText={"Confirm"}
            onSubmit={handleDecentralize}
            users={memberFilter}
            type="transfer"
          />
        )}
      </Modal>
      <Modal
        isOpen={isOpenManager}
        onClose={() => setIsOpenManager(false)}
        title="Adjust manager"
      >
        {isLoading ? (
          <div className="flex justify-center my-8">
            <Spinner />
          </div>
        ) : (
          <UserSelectionModal
            buttonText={"Confirm"}
            onSubmit={handleAddManager}
            users={memberFilter.filter(
              (member) => !conversation.managerIds.includes(member.id)
            )}
          />
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
        <div
          className="relative inline-block"
          onMouseEnter={() => setIsHoverAvatar(true)}
          onMouseLeave={() => setIsHoverAvatar(false)}
        >
          <img
            src={conversation.type ? conversation.avatar : partner[0]?.avatar}
            className="w-16 h-16 rounded-full"
            alt="Avatar"
            onClick={handleButtonClick}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          {isHoverAvatar && (
            <Button
              className="absolute bottom-0 right-0 w-16 h-16 p-1 text-white transition-colors rounded-full hover:opacity-90"
              onClick={handleButtonClick}
            >
              <Pencil className="w-3 h-3" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1">
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-2 py-1 bg-transparent outline-none border-b border-[#086DC0] text-[#959595F3] w-full text-center"
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
          <p className="text-[#086DC0] ml-2 user-select">Mute messages</p>
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
          <>
            <div
              className="flex items-center w-full mt-3 cursor-pointer"
              onClick={() => handleSetActiveTab({ tab: "members" })}
            >
              <div className="flex items-center justify-center w-[26px] bg-white rounded-full h-[26px]">
                <img src={Member} />
              </div>
              <p className="text-[#086DC0] ml-2">
                Members (
                {
                  conversation.members.filter(
                    (member) => member.active !== false
                  ).length
                }
                )
              </p>
              <div className="w-[30px] h-[30px] rounded-[9px] cursor-pointer ml-auto mr-1 bg-white flex items-center justify-center hover:opacity-75">
                <img src={ArrowRight} />
              </div>
            </div>
            {conversation.managerIds.includes(memberLoginNow?._id) ||
            conversation.leaderId === memberLoginNow?._id ? (
              <div
                className="flex items-center w-full mt-3 cursor-pointer"
                onClick={() => handleSetActiveTab({ tab: "request" })}
              >
                <div className="flex items-center justify-center w-[26px] bg-white rounded-full h-[26px]">
                  <img src={Member} />
                </div>
                <p className="text-[#086DC0] ml-2">Request ({requestCount})</p>
                <div className="w-[30px] h-[30px] rounded-[9px] cursor-pointer ml-auto mr-1 bg-white flex items-center justify-center hover:opacity-75">
                  <img src={ArrowRight} />
                </div>
              </div>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
        <div
          className="flex items-center w-full mt-3 cursor-pointer"
          onClick={() => handleSetActiveTab({ tab: "pins" })}
        >
          <div className="flex items-center justify-center w-[26px] bg-white rounded-full h-[26px]">
            <img src={MarkChat} />
          </div>
          <p className="text-[#086DC0] ml-2">
            Pin messages ({pinMessages.length})
          </p>
          <div className="w-[30px] h-[30px] rounded-[9px] cursor-pointer ml-auto mr-1 bg-white flex items-center justify-center hover:opacity-75">
            <img src={ArrowRight} />
          </div>
        </div>
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
            <p className="text-[#086DC0] ml-2">
              Photos/videos ({imagesVideos.length})
            </p>
            <div className="w-[30px] h-[30px] rounded-[9px] cursor-pointer ml-auto mr-1 bg-white flex items-center justify-center hover:opacity-75">
              <img src={ArrowRight} />
            </div>
          </div>
          <PictureList limit={6} imagesVideos={imagesVideos} />
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
            <p className="text-[#086DC0] ml-2">Files ({files.length})</p>
            <div className="w-[30px] h-[30px] rounded-[9px] cursor-pointer ml-auto mr-1 bg-white flex items-center justify-center hover:opacity-75">
              <img src={ArrowRight} />
            </div>
          </div>
          <FileList limit={3} files={files} />
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
            <p className="text-[#086DC0] ml-2">Link ({links.length})</p>
            <div className="w-[30px] h-[30px] rounded-[9px] cursor-pointer ml-auto mr-1 bg-white flex items-center justify-center hover:opacity-75">
              <img src={ArrowRight} />
            </div>
          </div>
          <LinkList limit={3} links={links} />
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
                Decentralize
              </p>
            </div>
            <div
              className="flex items-center p-1 mt-1 cursor-pointer hover:opacity-75"
              onClick={handleToggleJoinApproval}
              disabled={isLoading}
            >
              <img
                src={ApprovalIcon}
                className="w-[18px] h-[18px] rounded-full bg-white p-[3px]"
                alt="Icon"
              />
              <p className="text-[#F49300] font-bold text-sm ml-1">
                {!conversation.isJoinFromLink
                  ? "Tắt phê duyệt thành viên"
                  : "Bật phê duyệt thành viên"}
              </p>
            </div>
            <ChooseModal
              isOpen={isConfirmModalOpen}
              onClose={() => setIsConfirmModalOpen(false)}
              onConfirm={handleDisband}
              title="Disband Conversation"
              message="Are you sure you want to disband this conversation? This action cannot be undone."
              confirmText="Disband"
              cancelText="Cancel"
              confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
            />
            <div
              className="flex items-center p-1 mt-1 cursor-pointer hover:opacity-75"
              onClick={() => setIsConfirmModalOpen(true)}
            >
              <img
                src={Dissolve}
                className="w-[18px] h-[18px] rounded-full bg-white p-[3px]"
                alt="Icon"
              />
              <p className="text-[#F49300] font-bold text-sm ml-1">
                {"Disband"}
              </p>
            </div>
            <div
              className="flex items-center p-1 mt-1 cursor-pointer hover:opacity-75"
              onClick={() => setIsOpenManager(true)}
            >
              <img
                src={Decentraliza}
                className="w-[18px] h-[18px] rounded-full bg-white p-[3px]"
                alt="Icon"
              />
              <p className="text-[#F49300] font-bold text-sm ml-1">
                {"Add manager"}
              </p>
            </div>
          </motion.div>
        </div>
        <div className="flex flex-col items-center w-full gap-4 mt-4">
          {conversation.type && (
            <button
              onClick={handleCreateInviteLink}
              className="px-4 py-2 text-white transition duration-300 bg-blue-600 rounded-lg shadow hover:bg-blue-700"
            >
              Tạo link mời
            </button>
          )}

          {inviteLink && (
            <div className="flex items-center w-full max-w-md p-2 bg-white border border-gray-300 rounded-lg shadow-sm">
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="flex-1 px-2 py-1 text-sm text-gray-800 bg-transparent outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="ml-2 px-4 py-1.5 text-sm text-white bg-green-500 rounded-md hover:bg-green-600 transition duration-300"
              >
                {copySuccess ? "Đã sao chép!" : "Sao chép"}
              </button>
            </div>
          )}
        </div>

        <div className="w-full mt-[18px] flex items-center justify-center gap-4">
          {conversation.type ? (
            <>
              <button
                className="flex items-center px-5 py-2 bg-white cursor-pointer hover:opacity-75 rounded-2xl"
                onClick={() => {
                  setIsOpenDelete(true);
                }}
              >
                <img src={Trash} alt="trash" />
                <span className="text-[#086DC0]  text-xs ml-2">Delete</span>
              </button>
              <button
                className="flex items-center px-5 py-2 bg-white cursor-pointer hover:opacity-75 rounded-2xl"
                onClick={handleLeaveChat}
              >
                <img src={Leave} alt="leave" />
                <span className="text-[#086DC0]  text-xs ml-2">Leave</span>
              </button>
            </>
          ) : (
            <>
              <button
                className="flex items-center px-5 py-2 bg-white cursor-pointer hover:opacity-75 rounded-2xl"
                onClick={() => {
                  setIsOpenDelete(true);
                }}
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
