/* eslint-disable react/prop-types */
// import { XMarkIcon } from "@heroicons/react/24/outline";

import { useState } from "react";
import MainDetail from "./MainDetail";
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
      {/* {activeTab === "photos" && (
        //<PhotoList onBack={() => setActiveTab("main")} />
      )}
      {activeTab === "files" && (
       // <FileList onBack={() => setActiveTab("main")} />
      )}
      {activeTab === "links" && (
       // <LinkList onBack={() => setActiveTab("main")} />
      )} */}
    </div>
  );
}
