/* eslint-disable react/prop-types */

import { useState } from "react";
import MainDetail from "./MainDetail";
import MediaDetail from "./detail_chat/MediaDetail";
import MemberList from "./detail_chat/MemberList";
export default function DetailChat() {
  const [activeTab, setActiveTab] = useState("main");
  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="h-full w-[385px] p-4 bg-[#E8F4FF] rounded-[20px]">
      {activeTab === "main" && (
        <MainDetail handleSetActiveTab={handleSetActiveTab} />
      )}
      {activeTab === "media" && (
        <MediaDetail onBack={() => setActiveTab("main")} />
      )}
      {activeTab === "members" && (
        <MemberList onBack={() => setActiveTab("main")} />
      )}
    </div>
  );
}
