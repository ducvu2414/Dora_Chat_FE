/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from "react";
import { SearchBar } from "@/components/ui/search-bar";
import { TabConversation } from "@/components/ui/tab-conversation";
import { Conversation } from "@/components/ui/conversation";
import { UserMenuDropdown } from "@/components/ui/user-menu-dropdown";
import { set } from "lodash";
import { Spinner } from "@/page/Spinner";

// Sử dụng memo để tránh render lại khi props không thay đổi
export function SideBar({ messages, groups, requests, onConversationClick }) {
  const [activeTab, setActiveTab] = useState("messages");
  const [activeConversation, setActiveConversation] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));
        setUser(user);
        console.log(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, []);

  const getConversations = () => {
    switch (activeTab) {
      case "messages":
        return messages;
      case "group":
        return groups;
      case "requests":
        return requests;
      default:
        return [];
    }
  };

  const conversations = getConversations();

  const handleConversationClick = (index, conversation) => {
    setActiveConversation(index);
    if (onConversationClick) {
      const chatId = conversation.id || index;
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
        requestCount={requests.length}
      />

      <div className="flex-1 overflow-y-auto px-2 scrollbar-hide relative z-10">
        {conversations.map((conv, i) => (
          <Conversation
            key={i}
            {...conv}
            isActive={activeConversation === i}
            onClick={() => handleConversationClick(i, conv)}
            activeTab={activeTab}
          />
        ))}
      </div>

      <div className="p-4 border-t flex items-center justify-between bg-white relative">
        {loading ? (
          <div className="flex justify-center my-8">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt="Admin"
                className="w-12 h-12 rounded-full object-cover cursor-pointer"
              />
              <div>
                <p className="text-sm text-regal-blue font-bold cursor-pointer">
                  {user.name}
                </p>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Active
                </p>
              </div>
            </div>
          </>
        )}

        <div className="relative">
          <button
            className="p-2 hover:bg-gray-200 rounded-md bg-white focus:outline-none border-none"
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
    </div>
  );
}
