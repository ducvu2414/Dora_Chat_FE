import { TabGroup } from "../tab-group"

// data: { activeTab, onTabChange }

export function TabConversation(data) {
  const tabs = [
    { id: "messages", label: "Messages" },
    { id: "group", label: "Group" },
  ]

  const rightContent = <span className="text-regal-blue text-sm hover:underline cursor-pointer">Request (2)</span>

  return <TabGroup tabs={tabs} activeTab={data.activeTab} onTabChange={data.onTabChange} rightContent={rightContent} />
}

