/* eslint-disable react/prop-types */
import { TabGroup } from "@/components/ui/tab-group";
import { ClassifyDropdown } from "@/components/ui/classify/ClassifyDropdown";

export function TabConversation({
  activeTab,
  onTabChange,
  selectedClassifyIds,
  onSelectClassifies,
  onOpenManager,
}) {
  const tabs = [
    { id: "messages", label: "Messages" },
    { id: "group", label: "Group" },
  ];

  const rightContent = (
    <ClassifyDropdown
      selectedIds={selectedClassifyIds}
      onSelect={onSelectClassifies}
      onManage={onOpenManager}
    />
  );

  return (
    <TabGroup
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      rightContent={rightContent}
    />
  );
}
