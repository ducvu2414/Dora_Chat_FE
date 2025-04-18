import { TabGroup } from "@/components/ui/tab-group";

// eslint-disable-next-line react/prop-types
export function ChannelTab({ activeTab, onTabChange }) {
  const channelTabs = [
    { id: "general", label: "#general" },
    { id: "channel1", label: "#channel1" },
    { id: "channel2", label: "#channel2" },
  ];

  return (
    <TabGroup
      tabs={channelTabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
    />
  );
}
