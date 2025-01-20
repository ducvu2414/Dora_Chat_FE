import { Dropdown, DropdownItem } from "./dropdown"
import { UserPlus, Users } from "lucide-react"

// data: { isOpen, onClose, onAddFriend, onCreateGroup }
export function AddDropdown(data) {
  return (
    <Dropdown isOpen={data.isOpen} onClose={data.onClose} align="right" verticalAlign="bottom">
      <DropdownItem
        icon={UserPlus}
        onClick={() => {
            data.onAddFriend()
            data.onClose()
        }}
      >
        Add friend
      </DropdownItem>
      <DropdownItem
        icon={Users}
        onClick={() => {
            data.onCreateGroup()
            data.onClose()
        }}
      >
        Create chat group
      </DropdownItem>
    </Dropdown>
  )
}

