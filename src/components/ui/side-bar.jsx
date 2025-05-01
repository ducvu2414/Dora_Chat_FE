/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { SearchBar } from "@/components/ui/search-bar";
import { TabConversation } from "@/components/ui/tab-conversation";
import { Conversation } from "@/components/ui/conversation";
import { UserMenuDropdown } from "@/components/ui/user-menu-dropdown";
import ClassifyManagerModal from "@/components/ui/classify/ClassifyManagerModal";

export function SideBar({
  messages,
  groups,
  requests,
  onConversationClick,
  user,
}) {
  const [activeTab, setActiveTab] = useState("messages");
  const [activeConversation, setActiveConversation] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { unread } = useSelector((state) => state.chat);

  const classifies = useSelector((state) => state.chat.classifies || []);
  const [selectedClassifyIds, setSelectedClassifyIds] = useState([]);
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  const getConversations = () => {
    let sourceList = [];

    switch (activeTab) {
      case "messages":
        sourceList = messages;
        break;
      case "group":
        sourceList = groups;
        break;
      default:
        sourceList = [];
    }

    if (selectedClassifyIds.length === 0) return sourceList;

    const matchedConversationIds = classifies
      .filter((cls) => selectedClassifyIds.includes(cls._id))
      .flatMap((cls) => cls.conversationIds);

    return sourceList.filter((conv) =>
      matchedConversationIds.includes(conv._id)
    );
  };

  const filteredConversations = getConversations();

  const handleConversationClick = (index, conversation) => {
    setActiveConversation(conversation._id || index);
    if (onConversationClick) {
      const chatId = conversation._id || index;
      console.log("Conversation clicked:", chatId);
      onConversationClick(chatId);
    }
  };

  return (
    <div className="w-[380px] bg-white border-r flex flex-col relative">
      <div className="px-4 pt-4 pb-2">
        <SearchBar />
      </div>

      <TabConversation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedClassifyIds={selectedClassifyIds}
        onSelectClassifies={setSelectedClassifyIds}
        onOpenManager={() => setIsManagerOpen(true)}
      />

      <div className="relative z-10 flex-1 px-2 overflow-y-auto scrollbar-hide">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conv, i) => (
            <Conversation
              key={conv._id || i}
              {...conv}
              isActive={activeConversation === conv._id}
              onClick={() => handleConversationClick(i, conv)}
              activeTab={activeTab}
              idUser={user._id}
              unread={unread[conv._id] || 0}
            />
          ))
        ) : (
          <div className="text-sm text-gray-500 text-center py-8">
            Không có hội thoại nào.
          </div>
        )}
      </div>

      <div className="relative flex items-center justify-between p-4 bg-white border-t">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt="Admin"
            className="object-cover w-12 h-12 rounded-full cursor-pointer"
          />
          <div>
            <p className="text-sm font-bold cursor-pointer text-regal-blue">
              {user.name}
            </p>
            <p className="flex items-center gap-1 text-xs text-green-500">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              Active
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            className="p-2 bg-white border-none rounded-md hover:bg-gray-200 focus:outline-none"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 3.5C8.41421 3.5 8.75 3.16421 8.75 2.75C8.75 2.33579 8.41421 2 8 2C7.58579 2 7.25 2.33579 7.25 2.75C7.25 3.16421 7.58579 3.5 8 3.5Z"
                fill="#6B7280"
              />
              <path
                d="M8 8.75C8.41421 8.75 8.75 8.41421 8.75 8C8.75 7.58579 8.41421 7.25 8 7.25C7.58579 7.25 7.25 7.58579 7.25 8C7.25 8.41421 7.58579 8.75 8 8.75Z"
                fill="#6B7280"
              />
              <path
                d="M8 14C8.41421 14 8.75 13.6642 8.75 13.25C8.75 12.8358 8.41421 12.5 8 12.5C7.58579 12.5 7.25 12.8358 7.25 13.25C7.25 13.6642 7.58579 14 8 14Z"
                fill="#6B7280"
              />
            </svg>
          </button>
          <UserMenuDropdown
            isOpen={isUserMenuOpen}
            onClose={() => setIsUserMenuOpen(false)}
          />
        </div>
      </div>

      {isManagerOpen && (
        <ClassifyManagerModal onClose={() => setIsManagerOpen(false)} />
      )}
    </div>
  );
}
