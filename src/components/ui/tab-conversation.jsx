import { TabGroup } from "@/components/ui/tab-group"

// eslint-disable-next-line react/prop-types
export function TabConversation({ activeTab, onTabChange, requestCount }) {
  const tabs = [
    { id: "messages", label: "Messages" },
    { id: "group", label: "Group" },
  ]

  const handleRequestClick = () => {
    onTabChange("requests")
  }

  const rightContent = (
    <span className="text-regal-blue text-sm hover:underline cursor-pointer" onClick={handleRequestClick}>
      Request ({requestCount})
    </span>
  )

  return <TabGroup tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} rightContent={rightContent} />
}

