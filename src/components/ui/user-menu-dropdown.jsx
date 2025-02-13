import { Dropdown, DropdownItem } from "@/components/ui/dropdown"
import { User, LogOut, Users } from "lucide-react"
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export function UserMenuDropdown({ isOpen, onClose }) {
  const navigate = useNavigate()
  return (
    <Dropdown isOpen={isOpen} onClose={onClose} align="right" verticalAlign="top">
      <DropdownItem
        icon={User}
        onClick={() => {
          onClose()
          navigate("/user-information")
        }}
      >
        My Profile
      </DropdownItem>
      <DropdownItem
        icon={Users}
        onClick={() => {
          onClose()
          navigate("/contacts")
        }}
      >
        Contacts
      </DropdownItem>
      <DropdownItem
        icon={LogOut}
        onClick={() => {
          onClose()
          navigate("/")
        }}
      >
        Log out
      </DropdownItem>
    </Dropdown>
  )
}

