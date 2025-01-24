import { TabGroup } from "@/components/ui/tab-group"

// eslint-disable-next-line react/prop-types
export function TabConversation({ activeTab, onTabChange }) {
  const tabs = [
    { id: "messages", label: "Messages" },
    { id: "group", label: "Group" },
  ]

  const rightContent = <span className="text-regal-blue text-sm hover:underline cursor-pointer">Request (2)</span>

  return <TabGroup tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} rightContent={rightContent} />
}

