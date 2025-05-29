/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { Spinner } from "@/page/Spinner";

import MainDetail from "./MainDetail";
import MediaDetail from "./detail_chat/MediaDetail";
import MemberList from "./detail_chat/MemberList";
import memberApi from "@/api/member";
import PinList from "./detail_chat/PinList";
import RequestList from "./detail_chat/RequestList";
export default function DetailChat({
  conversation,
  imagesVideos,
  files,
  links,
  pinMessages,
  onScrollToMessage,
}) {
  console.log("DetailChat conversation", conversation);
  const [activeTab, setActiveTab] = useState({
    tab: "detail",
  });
  const [memberLoginNow, setMemberLoginNow] = useState(null);
  const handleSetActiveTab = (tab) => {
    setActiveTab((prev) => ({
      ...prev,
      ...tab,
    }));
  };
  useEffect(() => {
    (async () => {
      const memberLoginNow = await memberApi.getByConversationIdAndUserId(
        conversation._id,
        JSON.parse(localStorage.getItem("user"))._id
      );
      setMemberLoginNow(memberLoginNow.data);
    })();
  }, []);
  return (
    <div className="h-full w-[385px] p-4 bg-[#E8F4FF] rounded-[20px]">
      {!memberLoginNow ? (
        <Spinner />
      ) : activeTab.tab === "detail" ? (
        <MainDetail
          memberLogin={memberLoginNow}
          handleSetActiveTab={handleSetActiveTab}
          conversation={conversation}
          imagesVideos={imagesVideos}
          files={files}
          links={links}
          pinMessages={pinMessages}
        />
      ) : null}
      {activeTab.tab === "members" && (
        <MemberList
          onBack={() =>
            setActiveTab((prev) => ({
              ...prev,
              tab: "detail",
            }))
          }
          memberLogin={memberLoginNow}
          conversationId={conversation._id}
          managers={conversation?.managerIds}
          leader={conversation?.leaderId}
          members={conversation?.members}
        />
      )}
      {activeTab.tab === "request" && (
        <RequestList
          onBack={() =>
            setActiveTab((prev) => ({
              ...prev,
              tab: "detail",
            }))
          }
          conversationId={conversation._id}
          managers={conversation?.managerIds}
          leader={conversation?.leaderId}
        />
      )}
      {activeTab.tab === "pins" && (
        <PinList
          onBack={() =>
            setActiveTab((prev) => ({
              ...prev,
              tab: "detail",
            }))
          }
          pinMessages={pinMessages}
          onScrollToMessage={onScrollToMessage}
        />
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
          imagesVideos={imagesVideos}
          files={files}
          links={links}
        />
      )}
    </div>
  );
}
