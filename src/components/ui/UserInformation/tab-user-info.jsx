import { TabGroup } from "../tab-group"
import { User, Settings } from "lucide-react"

// data: {activeTab, onTabChange}
export function TabUserInfo(data) {
  const tabs = [
    {
      id: "information",
      label: "Information",
      icon: User,
    },
    {
      id: "account",
      label: "Account",
      icon: Settings,
    },
  ]

  return <TabGroup tabs={tabs} activeTab={data.activeTab} onTabChange={data.onTabChange} />
}

