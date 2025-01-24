import { Dropdown, DropdownItem } from "@/components/ui/dropdown"
import { UserPlus, Users } from "lucide-react"

// eslint-disable-next-line react/prop-types
export function AddDropdown({ isOpen, onClose, onAddFriend, onCreateGroup }) {
  return (
    <Dropdown isOpen={isOpen} onClose={onClose} align="right" verticalAlign="bottom">
      <DropdownItem
        icon={UserPlus}
        onClick={() => {
            onAddFriend()
            onClose()
        }}
      >
        Add friend
      </DropdownItem>
      <DropdownItem
        icon={Users}
        onClick={() => {
            onCreateGroup()
            onClose()
        }}
      >
        Create chat group
      </DropdownItem>
    </Dropdown>
  )
}

