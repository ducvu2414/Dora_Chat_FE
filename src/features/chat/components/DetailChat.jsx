/* eslint-disable react/prop-types */

import { useState } from "react";
import MainDetail from "./MainDetail";
import MediaDetail from "./detail_chat/MediaDetail";
import MemberList from "./detail_chat/MemberList";
export default function DetailChat({ isConversation, conversationId }) {
  const [activeTab, setActiveTab] = useState({
    tab: "detail",
  });
  const handleSetActiveTab = (tab) => {
    setActiveTab((prev) => ({
      ...prev,
      ...tab,
    }));
  };
  return (
    <div className="h-full w-[385px] p-4 bg-[#E8F4FF] rounded-[20px]">
      {activeTab.tab === "detail" && (
        <MainDetail handleSetActiveTab={handleSetActiveTab} isConversation={isConversation} conversationId={conversationId} />
      )}
      {activeTab.tab === "media" && (
        <MediaDetail
          onBack={() =>
            setActiveTab((prev) => ({
              ...prev,
              tab: "detail",
            }))
          }
          media={activeTab?.media}
        />
      )}
      {activeTab.tab === "members" && (
        <MemberList
          onBack={() =>
            setActiveTab((prev) => ({
              ...prev,
              tab: "detail",
            }))
          }
        />
      )}
    </div>
  );
}
