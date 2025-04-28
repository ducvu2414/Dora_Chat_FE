/* eslint-disable react/prop-types */
import { useState } from "react";
import ArrowRight from "@assets/chat/arrow_right.svg";
import { TabGroup } from "@/components/ui/tab-group";
import PictureList from "./PictureList";
import FileList from "./FileList";
import LinkList from "./LinkList";

const TABS = [
  { id: "photos/videos", label: "Photos/Videos" },
  { id: "files", label: "Files" },
  { id: "links", label: "Links" },
];

export default function MediaDetail({ onBack, media, imagesVideos, files, links }) {
  const [activeTab, setActiveTab] = useState(media || "photos/videos");
  const renderContent = () => {
    switch (activeTab) {
      case "photos/videos":
        return <PictureList imagesVideos={imagesVideos} />;
      case "files":
        return <FileList files={files} />;
      case "links":
        return <LinkList links={links} />;
      default:
        return null;
    }
  };

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
      <TabGroup tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mt-4 overflow-auto h-[calc(100vh-185px)]">
        {renderContent()}
      </div>
    </div>
  );
}
