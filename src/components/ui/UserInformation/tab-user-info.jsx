import { TabGroup } from "@/components/ui/tab-group"
import { User, Settings } from "lucide-react"

// eslint-disable-next-line react/prop-types
export function TabUserInfo({activeTab, onTabChange}) {
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

  return <TabGroup tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
}

