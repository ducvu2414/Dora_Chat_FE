import { Dropdown, DropdownItem } from "./dropdown"
import { User, LogOut, Users } from "lucide-react"
import { useNavigate } from "react-router-dom";

// data: { isOpen, onClose }
export function UserMenuDropdown(data) {
  const navigate = useNavigate()
  return (
    <Dropdown isOpen={data.isOpen} onClose={data.onClose} align="right" verticalAlign="top">
      <DropdownItem
        icon={User}
        onClick={() => {
          data.onClose()
          navigate("/user-information")
        }}
      >
        My Profile
      </DropdownItem>
      <DropdownItem
        icon={Users}
        onClick={() => {
          data.onClose()
          navigate("/contacts")
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

