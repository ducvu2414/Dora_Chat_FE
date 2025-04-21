import { TabGroup } from "@/components/ui/tab-group";

// eslint-disable-next-line react/prop-types
export function ChannelTab({ tabs, activeTab, onTabChange }) {
  
  return (
    <TabGroup
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
    />
  );
}
