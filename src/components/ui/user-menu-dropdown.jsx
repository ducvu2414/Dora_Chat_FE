import { Dropdown, DropdownItem } from "./dropdown"
import { User, LogOut, Users } from "lucide-react"

// data: { isOpen, onClose }

export function UserMenuDropdown(data) {
  return (
    <Dropdown isOpen={data.isOpen} onClose={data.onClose} align="right" verticalAlign="top">
      <DropdownItem
        icon={User}
        onClick={() => {
          data.onClose()
        }}
      >
        My Profile
      </DropdownItem>
      <DropdownItem
        icon={Users}
        onClick={() => {
          data.onClose()
        }}
      >
        Contacts
      </DropdownItem>
      <DropdownItem
        icon={LogOut}
        onClick={() => {
          data.onClose()
        }}
      >
        Log out
      </DropdownItem>
    </Dropdown>
  )
}

